// Code generated from authara-core/contract/openapi.yaml; DO NOT EDIT.

import { AutharaClient } from "../client.js";
import type * as API from "./types.js";

export type ResendChallengeOptions = {
  body: API.ChallengeReference;
};

export type LoginWithPasswordOptions = {
  audience?: "app" | "admin";
  body: API.PasswordLoginRequest;
};

export type LoginWithGoogleOptions = {
  audience?: "app" | "admin";
  body: API.GoogleLoginRequest;
};

export type GetPublicOrganizationOptions = {
  organizationID: string;
};

export type UpdatePublicOrganizationOptions = {
  organizationID: string;
  body: API.UpdateOrganizationRequest;
};

export type ListPublicOrganizationInvitationsOptions = {
  organizationID: string;
};

export type GetPublicOrganizationInvitationOptions = {
  organizationID: string;
  invitationID: string;
};

export type RevokePublicOrganizationInvitationOptions = {
  organizationID: string;
  invitationID: string;
};

export type ListPublicOrganizationMembersOptions = {
  organizationID: string;
};

export type GetPublicOrganizationMemberOptions = {
  organizationID: string;
  userID: string;
};

export type SwitchOrganizationOptions = {
  organizationID: string;
  audience?: "app" | "admin";
};

export type FinishPasskeyAuthenticationOptions = {
  audience?: "app" | "admin";
  body: API.PasskeyAuthenticationFinishRequest;
};

export type FinishPasskeyRegistrationOptions = {
  body: API.PasskeyRegistrationFinishRequest;
};

export type StartPasswordResetChallengeOptions = {
  body: API.PasswordResetRequest;
};

export type VerifyPasswordResetChallengeOptions = {
  body: API.PasswordResetChallengeVerification;
};

export type RefreshSessionOptions = {
  audience?: "app" | "admin";
};

export type StartSignupChallengeOptions = {
  audience?: "app";
  body: API.SignupRequest;
};

export type VerifySignupChallengeOptions = {
  audience?: "app";
  body: API.SignupChallengeVerification;
};

export type SignupDirectOptions = {
  audience?: "app";
  body: API.SignupRequest;
};

export type RefreshTokensOptions = {
  body: API.TokenRefreshRequest;
};

export type SetCurrentUserPasswordOptions = {
  body: API.SetPasswordRequest;
};

export type ListPublicUserMembershipsOptions = {
  userID: string;
};

export class AutharaBrowserClient extends AutharaClient {
  public getPublicCapabilities(): Promise<API.Capabilities> {
    return this.request<API.Capabilities>("GET", `/auth/api/v1/capabilities`);
  }

  public resendChallenge(options: ResendChallengeOptions): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/challenges/resend`, {
      body: options.body,
      csrf: true,
    });
  }

  public getCsrfToken(): Promise<API.CSRFToken> {
    return this.request<API.CSRFToken>("GET", `/auth/api/v1/csrf`);
  }

  public loginWithPassword(
    options: LoginWithPasswordOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>("POST", `/auth/api/v1/login`, {
      query: { audience: options?.audience },
      body: options.body,
      csrf: true,
    });
  }

  public loginWithGoogle(
    options: LoginWithGoogleOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>("POST", `/auth/api/v1/oauth/google`, {
      query: { audience: options?.audience },
      body: options.body,
      csrf: true,
    });
  }

  public getGoogleLoginOptions(): Promise<API.GoogleLoginOptions> {
    return this.request<API.GoogleLoginOptions>(
      "GET",
      `/auth/api/v1/oauth/google/options`,
    );
  }

  public listCurrentUserOrganizations(): Promise<API.OrganizationSummaries> {
    return this.request<API.OrganizationSummaries>(
      "GET",
      `/auth/api/v1/organizations`,
    );
  }

  public getCurrentOrganization(): Promise<API.OrganizationSummary> {
    return this.request<API.OrganizationSummary>(
      "GET",
      `/auth/api/v1/organizations/current`,
    );
  }

  public listCurrentOrganizationMembers(): Promise<API.CurrentOrganizationMembers> {
    return this.request<API.CurrentOrganizationMembers>(
      "GET",
      `/auth/api/v1/organizations/current/members`,
    );
  }

  public getPublicOrganization(
    options: GetPublicOrganizationOptions,
  ): Promise<API.OrganizationEnvelope> {
    return this.request<API.OrganizationEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}`,
    );
  }

  public updatePublicOrganization(
    options: UpdatePublicOrganizationOptions,
  ): Promise<API.OrganizationEnvelope> {
    return this.request<API.OrganizationEnvelope>(
      "PATCH",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}`,
      { body: options.body, csrf: true },
    );
  }

  public listPublicOrganizationInvitations(
    options: ListPublicOrganizationInvitationsOptions,
  ): Promise<API.OrganizationInvitations> {
    return this.request<API.OrganizationInvitations>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations`,
    );
  }

  public getPublicOrganizationInvitation(
    options: GetPublicOrganizationInvitationOptions,
  ): Promise<API.OrganizationInvitationEnvelope> {
    return this.request<API.OrganizationInvitationEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations/${encodeURIComponent(String(options.invitationID))}`,
    );
  }

  public revokePublicOrganizationInvitation(
    options: RevokePublicOrganizationInvitationOptions,
  ): Promise<API.OrganizationInvitationEnvelope> {
    return this.request<API.OrganizationInvitationEnvelope>(
      "POST",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations/${encodeURIComponent(String(options.invitationID))}/revoke`,
      { csrf: true },
    );
  }

  public listPublicOrganizationMembers(
    options: ListPublicOrganizationMembersOptions,
  ): Promise<API.OrganizationMembers> {
    return this.request<API.OrganizationMembers>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/members`,
    );
  }

  public getPublicOrganizationMember(
    options: GetPublicOrganizationMemberOptions,
  ): Promise<API.OrganizationMemberEnvelope> {
    return this.request<API.OrganizationMemberEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/members/${encodeURIComponent(String(options.userID))}`,
    );
  }

  public switchOrganization(
    options: SwitchOrganizationOptions,
  ): Promise<API.Tokens> {
    return this.request<API.Tokens>(
      "POST",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/switch`,
      { query: { audience: options?.audience }, csrf: true },
    );
  }

  public finishPasskeyAuthentication(
    options: FinishPasskeyAuthenticationOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/passkeys/authenticate/finish`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public beginPasskeyAuthentication(): Promise<API.PasskeyOptions> {
    return this.request<API.PasskeyOptions>(
      "POST",
      `/auth/api/v1/passkeys/authenticate/options`,
      { csrf: true },
    );
  }

  public finishPasskeyRegistration(
    options: FinishPasskeyRegistrationOptions,
  ): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/passkeys/register/finish`, {
      body: options.body,
      csrf: true,
    });
  }

  public beginPasskeyRegistration(): Promise<API.PasskeyOptions> {
    return this.request<API.PasskeyOptions>(
      "POST",
      `/auth/api/v1/passkeys/register/options`,
      { csrf: true },
    );
  }

  public startPasswordResetChallenge(
    options: StartPasswordResetChallengeOptions,
  ): Promise<API.ChallengeReference> {
    return this.request<API.ChallengeReference>(
      "POST",
      `/auth/api/v1/password-reset/challenges`,
      { body: options.body, csrf: true },
    );
  }

  public verifyPasswordResetChallenge(
    options: VerifyPasswordResetChallengeOptions,
  ): Promise<void> {
    return this.request<void>(
      "POST",
      `/auth/api/v1/password-reset/challenges/verify`,
      { body: options.body, csrf: true },
    );
  }

  public logout(): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/sessions/logout`, {
      csrf: true,
    });
  }

  public refreshSession(options?: RefreshSessionOptions): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/sessions/refresh`, {
      query: { audience: options?.audience },
      csrf: true,
    });
  }

  public startSignupChallenge(
    options: StartSignupChallengeOptions,
  ): Promise<API.SignupChallenge> {
    return this.request<API.SignupChallenge>(
      "POST",
      `/auth/api/v1/signup/challenges`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public verifySignupChallenge(
    options: VerifySignupChallengeOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/signup/challenges/verify`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public signupDirect(options: SignupDirectOptions): Promise<API.AuthSession> {
    return this.request<API.AuthSession>("POST", `/auth/api/v1/signup/direct`, {
      query: { audience: options?.audience },
      body: options.body,
      csrf: true,
    });
  }

  public refreshTokens(options: RefreshTokensOptions): Promise<API.Tokens> {
    return this.request<API.Tokens>("POST", `/auth/api/v1/tokens/refresh`, {
      body: options.body,
    });
  }

  public getCurrentUser(): Promise<API.CurrentUser> {
    return this.request<API.CurrentUser>("GET", `/auth/api/v1/user`);
  }

  public setCurrentUserPassword(
    options: SetCurrentUserPasswordOptions,
  ): Promise<void> {
    return this.request<void>("PUT", `/auth/api/v1/users/password`, {
      body: options.body,
      csrf: true,
    });
  }

  public listPublicUserMemberships(
    options: ListPublicUserMembershipsOptions,
  ): Promise<API.UserMemberships> {
    return this.request<API.UserMemberships>(
      "GET",
      `/auth/api/v1/users/${encodeURIComponent(String(options.userID))}/memberships`,
    );
  }
}
