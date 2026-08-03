#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import prettier from "prettier";
import YAML from "yaml";

const METHODS = ["get", "post", "patch", "put", "delete"];
const REGULAR_API_PREFIX = "/auth/api/v1";

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const openapiPath = path.resolve(
  process.cwd(),
  argument("--openapi", "../../../authara-core/contract/openapi.yaml"),
);
const outputDir = path.resolve(
  process.cwd(),
  argument("--out", "src/generated"),
);
const checkOnly = process.argv.includes("--check");

const document = YAML.parse(fs.readFileSync(openapiPath, "utf8"));

function resolve(refOrValue) {
  if (!refOrValue?.$ref) return refOrValue;

  const prefix = "#/";
  if (!refOrValue.$ref.startsWith(prefix)) {
    throw new Error(`unsupported external reference: ${refOrValue.$ref}`);
  }

  return refOrValue.$ref
    .slice(prefix.length)
    .split("/")
    .reduce((value, key) => value?.[key], document);
}

function schemaName(ref) {
  if (!ref?.$ref?.startsWith("#/components/schemas/")) return null;
  return ref.$ref.slice("#/components/schemas/".length);
}

function selectedOperations() {
  const operations = [];

  for (const [route, item] of Object.entries(document.paths ?? {}).sort()) {
    if (
      route !== REGULAR_API_PREFIX &&
      !route.startsWith(`${REGULAR_API_PREFIX}/`)
    ) {
      continue;
    }

    for (const method of METHODS) {
      const operation = item?.[method];
      if (!operation) continue;
      if (!operation.operationId) {
        throw new Error(`${method.toUpperCase()} ${route} has no operationId`);
      }
      if (!["public", "user"].includes(operation["x-authara-access"])) {
        throw new Error(
          `${method.toUpperCase()} ${route} is not a browser operation`,
        );
      }
      operations.push({ method, route, item, operation });
    }
  }

  if (operations.length === 0) {
    throw new Error(`no regular API operations found in ${openapiPath}`);
  }

  return operations;
}

const operations = selectedOperations();
const neededSchemas = new Set();

function collectSchema(refOrSchema) {
  if (!refOrSchema) return;

  const name = schemaName(refOrSchema);
  if (name) {
    if (neededSchemas.has(name)) return;
    neededSchemas.add(name);
  }

  const schema = resolve(refOrSchema);
  if (!schema) return;

  for (const property of Object.values(schema.properties ?? {})) {
    collectSchema(property);
  }
  collectSchema(schema.items);
  collectSchema(schema.additionalProperties);
  for (const variant of [
    ...(schema.oneOf ?? []),
    ...(schema.anyOf ?? []),
    ...(schema.allOf ?? []),
  ]) {
    collectSchema(variant);
  }
}

function collectOperationSchemas({ item, operation }) {
  for (const parameterRef of [
    ...(item.parameters ?? []),
    ...(operation.parameters ?? []),
  ]) {
    collectSchema(resolve(parameterRef)?.schema);
  }

  const requestSchema = operation.requestBody?.content?.["application/json"]
    ?.schema;
  collectSchema(requestSchema);

  for (const responseRef of Object.values(operation.responses ?? {})) {
    const response = resolve(responseRef);
    collectSchema(response?.content?.["application/json"]?.schema);
  }
}

for (const operation of operations) collectOperationSchemas(operation);

function literal(value) {
  return JSON.stringify(value);
}

function propertyName(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : literal(name);
}

function union(values) {
  return values.map(literal).join(" | ");
}

function typeFor(refOrSchema, prefix = "") {
  if (!refOrSchema) return "unknown";

  const name = schemaName(refOrSchema);
  if (name) return `${prefix}${name}`;

  const schema = resolve(refOrSchema);
  if (!schema) return "unknown";

  let type;
  if (schema.oneOf?.length) {
    type = schema.oneOf
      .map((schemaRef) => typeFor(schemaRef, prefix))
      .join(" | ");
  } else if (schema.anyOf?.length) {
    type = schema.anyOf
      .map((schemaRef) => typeFor(schemaRef, prefix))
      .join(" | ");
  } else if (schema.allOf?.length) {
    type = schema.allOf
      .map((schemaRef) => typeFor(schemaRef, prefix))
      .join(" & ");
  } else if (schema.enum?.length) {
    type = union(schema.enum);
  } else {
    switch (schema.type) {
      case "string":
        type = "string";
        break;
      case "boolean":
        type = "boolean";
        break;
      case "integer":
      case "number":
        type = "number";
        break;
      case "array":
        type = `Array<${typeFor(schema.items, prefix)}>`;
        break;
      case "object": {
        const properties = Object.entries(schema.properties ?? {}).map(
          ([name, property]) => {
            const optional = !(schema.required ?? []).includes(name);
            return `${propertyName(name)}${optional ? "?" : ""}: ${typeFor(property, prefix)}`;
          },
        );

        if (properties.length > 0) {
          if (schema.additionalProperties === true) {
            properties.push("[key: string]: unknown");
          } else if (schema.additionalProperties?.$ref || schema.additionalProperties?.type) {
            properties.push(
              `[key: string]: ${typeFor(schema.additionalProperties, prefix)}`,
            );
          }
          type = `{ ${properties.join("; ")} }`;
        } else if (schema.additionalProperties === false) {
          type = "Record<string, never>";
        } else {
          type = `Record<string, ${
            schema.additionalProperties && schema.additionalProperties !== true
              ? typeFor(schema.additionalProperties, prefix)
              : "unknown"
          }>`;
        }
        break;
      }
      default:
        type = "unknown";
    }
  }

  return schema.nullable ? `${type} | null` : type;
}

function schemaDeclaration(name) {
  const schema = resolve(document.components.schemas[name]);
  if (schema.enum?.length) return `export type ${name} = ${union(schema.enum)};`;
  if (schema.type !== "object" || !Object.keys(schema.properties ?? {}).length) {
    return `export type ${name} = ${typeFor(schema)};`;
  }

  const required = new Set(schema.required ?? []);
  const properties = Object.entries(schema.properties).map(
    ([property, propertySchema]) =>
      `  ${propertyName(property)}${required.has(property) ? "" : "?"}: ${typeFor(propertySchema)};`,
  );

  if (schema.additionalProperties === true) {
    properties.push("  [key: string]: unknown;");
  } else if (schema.additionalProperties?.$ref || schema.additionalProperties?.type) {
    properties.push(`  [key: string]: ${typeFor(schema.additionalProperties)};`);
  }

  return `export interface ${name} {\n${properties.join("\n")}\n}`;
}

function typesSource() {
  const declarations = [...neededSchemas]
    .sort()
    .map(schemaDeclaration)
    .join("\n\n");

  return `// Code generated from authara-core/contract/openapi.yaml; DO NOT EDIT.\n\n${declarations}\n`;
}

function parametersFor({ item, operation }) {
  const parameters = [
    ...(item.parameters ?? []),
    ...(operation.parameters ?? []),
  ].map(resolve);
  const seen = new Set();
  return parameters.filter((parameter) => {
    const key = `${parameter.in}:${parameter.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function successResponse(operation) {
  for (const status of Object.keys(operation.responses ?? {})
    .filter((value) => value.startsWith("2"))
    .sort()) {
    const response = resolve(operation.responses[status]);
    const schema = response?.content?.["application/json"]?.schema;
    if (schema) return typeFor(schema, "API.");
  }
  return "void";
}

function operationNeedsCSRF(operation) {
  return (operation.security ?? []).some((requirement) =>
    Object.hasOwn(requirement, "csrfHeader"),
  );
}

function operationOptions({ item, operation }) {
  const fields = [];
  for (const parameter of parametersFor({ item, operation })) {
    fields.push({
      name: parameter.name,
      type: typeFor(parameter.schema, "API."),
      required: parameter.required !== false || parameter.in === "path",
      in: parameter.in,
    });
  }

  const body = operation.requestBody?.content?.["application/json"];
  if (body?.schema) {
    fields.push({
      name: "body",
      type: typeFor(body.schema, "API."),
      required: operation.requestBody.required !== false,
      in: "body",
    });
  }
  return fields;
}

function pathExpression(route, fields) {
  const names = new Map(fields.map((field) => [field.name, field]));
  const expression = route.replace(/\{([^}]+)\}/g, (_, name) => {
    if (!names.has(name)) throw new Error(`missing path parameter ${name}`);
    return `\${encodeURIComponent(String(options.${name}))}`;
  });
  return `\`${expression}\``;
}

function apiMethod({ method, route, item, operation }) {
  const fields = operationOptions({ item, operation });
  const parameters = parametersFor({ item, operation });
  const itemFields = fields;
  const optionsName = `${operation.operationId[0].toUpperCase()}${operation.operationId.slice(1)}Options`;
  const optionsRequired = itemFields.some((field) => field.required);
  const hasOptions = itemFields.length > 0;
  const response = successResponse(operation);

  const optionDeclaration = hasOptions
    ? `export type ${optionsName} = {\n${itemFields
        .map(
          (field) =>
            `  ${field.name}${field.required ? "" : "?"}: ${field.type};`,
        )
        .join("\n")}\n};\n\n`
    : "";

  const pathFields = itemFields.filter((field) => field.in === "path");
  const path = pathExpression(route, pathFields);
  const queryFields = parameters.filter((parameter) => parameter.in === "query");
  const bodyField = itemFields.find((field) => field.in === "body");
  const requestOptions = [];
  if (queryFields.length) {
    requestOptions.push(
      `query: { ${queryFields
        .map((parameter) => `${parameter.name}: options?.${parameter.name}`)
        .join(", ")} }`,
    );
  }
  if (bodyField) requestOptions.push(`body: options.${bodyField.name}`);
  if (operationNeedsCSRF(operation)) requestOptions.push("csrf: true");
  const request = requestOptions.length
    ? `this.request<${response}>("${method.toUpperCase()}", ${path}, { ${requestOptions.join(", ")} })`
    : `this.request<${response}>("${method.toUpperCase()}", ${path})`;

  const signature = hasOptions
    ? `options${optionsRequired ? "" : "?"}: ${optionsName}`
    : "";
  return {
    optionDeclaration,
    method: `  public ${operation.operationId}(${signature}): Promise<${response}> {\n    return ${request};\n  }`,
  };
}

function apiSource() {
  const generated = operations.map((entry) => apiMethod(entry));
  const options = generated
    .map(({ optionDeclaration }) => optionDeclaration)
    .filter(Boolean)
    .join("\n");
  const methods = generated.map(({ method }) => method).join("\n\n");
  return `// Code generated from authara-core/contract/openapi.yaml; DO NOT EDIT.\n\nimport { AutharaClient } from "../client.js";\nimport type * as API from "./types.js";\n\n${options}${options ? "\n" : ""}export class AutharaBrowserClient extends AutharaClient {\n${methods}\n}\n`;
}

function generatedFiles() {
  return {
    [path.join(outputDir, "types.ts")]: typesSource(),
    [path.join(outputDir, "api.ts")]: apiSource(),
  };
}

const files = generatedFiles();
let failed = false;

for (const [file, rawSource] of Object.entries(files)) {
  const source = await prettier.format(rawSource, { parser: "typescript" });
  if (checkOnly) {
    const actual = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (actual !== source) {
      console.error(`generated file is stale: ${path.relative(process.cwd(), file)}`);
      failed = true;
    }
    continue;
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, source);
  console.log(`generated ${path.relative(process.cwd(), file)}`);
}

if (failed) process.exit(1);
