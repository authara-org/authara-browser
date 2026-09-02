// Code generated from authara-core/contract/openapi.yaml; DO NOT EDIT.

export interface APIError {
  code: string;
  message: string;
}

export interface Account {
  user: AuthUser;
  sessions: Array<AccountSession>;
  auth_methods: Array<AuthMethod>;
  passkeys: Array<AccountPasskey>;
}

export interface AccountPasskey {
  id: string;
  name: string;
  created_at: string;
  last_used_at?: string;
}

export interface AccountRecoveryGoogleProofRequest {
  credential: string;
  nonce: string;
  invitation_token?: string;
}

export interface AccountRecoveryLink {
  link_id: string;
  proof_methods: Array<"password" | "google">;
}

export interface AccountRecoveryPasswordProofRequest {
  password: string;
  invitation_token?: string;
}

export interface AccountSession {
  id: string;
  current: boolean;
  created_at: string;
  expires_at: string;
  user_agent: string;
}

export interface AuthMethod {
  provider: "password" | "google";
  created_at: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  disabled: boolean;
  created_at: string;
}

export interface CSRFToken {
  csrf_token: string;
}

export interface Capabilities {
  organization_mode: "personal" | "single" | "multi";
  has_visible_organizations: boolean;
  allows_invitations: boolean;
  allows_public_organization_management: boolean;
  allows_org_switching: boolean;
  allows_user_created_team_orgs: boolean;
  allows_organization_leave: boolean;
}

export interface ChallengeReference {
  challenge_id: string;
}

export interface ChallengeVerification {
  challenge_id: string;
  code: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangeUsernameRequest {
  username: string;
}

export interface CurrentOrganizationMember {
  user_id: string;
  email: string;
  username: string;
  role: OrganizationRole;
  created_at: string;
}

export interface CurrentOrganizationMembers {
  members: Array<CurrentOrganizationMember>;
}

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  disabled: boolean;
  created_at: string;
  roles: Array<"authara:admin" | "authara:auditor" | "authara:monitor">;
  organization: OrganizationSummary;
}

export interface EmailChangeRequest {
  new_email: string;
}

export interface ErrorResponse {
  error: APIError;
}

export interface GoogleLoginOptions {
  client_id: string;
  nonce: string;
}

export interface GoogleLoginRequest {
  credential: string;
  nonce: string;
}

export interface InvitationGoogleRequest {
  token: string;
  credential: string;
  nonce: string;
  flow: "signup" | "login";
}

export interface InvitationGoogleResult {
  status: "authenticated" | "proof_required";
  session?: AuthSession;
  recovery?: AccountRecoveryLink;
}

export interface InvitationPasswordLoginRequest {
  token: string;
  password: string;
}

export interface InvitationPreview {
  invitation: OrganizationInvitation;
  organization: Organization;
}

export interface InvitationTokenRequest {
  token: string;
}

export interface Membership {
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  created_at: string;
  updated_at: string;
}

export interface MembershipWithOrganization {
  organization: Organization;
  membership: Membership;
}

export interface Organization {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  kind: "personal" | "team";
  created_by_user_id?: string;
}

export interface OrganizationEnvelope {
  organization: Organization;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  metadata: Record<string, unknown>;
  status: "pending" | "accepted" | "revoked" | "expired";
  expires_at: string;
  invite_url?: string;
}

export interface OrganizationInvitationEnvelope {
  invitation: OrganizationInvitation;
}

export interface OrganizationInvitations {
  invitations: Array<OrganizationInvitation>;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  email: string;
  username: string;
  role: OrganizationRole;
  created_at: string;
  updated_at: string;
  disabled: boolean;
}

export interface OrganizationMemberEnvelope {
  member: OrganizationMember;
}

export interface OrganizationMembers {
  members: Array<OrganizationMember>;
}

export type OrganizationRole = "owner" | "admin" | "member";

export interface OrganizationSummaries {
  organizations: Array<OrganizationSummary>;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  role: OrganizationRole;
}

export interface PasskeyAuthenticationFinishRequest {
  challenge_id: string;
  credential: Record<string, unknown>;
}

export interface PasskeyOptions {
  challenge_id: string;
  options: Record<string, unknown>;
}

export interface PasskeyRegistrationFinishRequest {
  challenge_id: string;
  credential: Record<string, unknown>;
  name?: string;
  platform_hint?: string;
}

export interface PasswordLoginRequest {
  email: string;
  password: string;
}

export interface PasswordResetChallengeVerification {
  challenge_id: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
  new_password: string;
}

export interface SetPasswordRequest {
  password: string;
}

export interface SignupChallenge {
  challenge_id: string;
}

export interface SignupChallengeVerification {
  challenge_id: string;
  code: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  invitation_code?: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
  audience?: "app" | "admin";
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UpdateOrganizationRequest {
  name: string;
}

export interface UserMemberships {
  memberships: Array<MembershipWithOrganization>;
}
