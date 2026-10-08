// Code generated from authara-core/contract/openapi.yaml; DO NOT EDIT.

import { AutharaClient } from "../client.js";
import type * as API from "./types.js";

export type GetCurrentAccountOptions = {
  sessions_cursor?: string;
  sessions_limit?: number;
  passkeys_cursor?: string;
  passkeys_limit?: number;
};

export type LinkCurrentUserAppleOptions = {
  body: API.AppleAuthorizationRequest;
};

export type LinkCurrentUserGoogleOptions = {
  body: API.GoogleLoginRequest;
};

export type UnlinkCurrentUserAuthMethodOptions = {
  provider: "password" | "google" | "apple";
};

export type StartCurrentUserEmailChangeOptions = {
  body: API.EmailChangeRequest;
};

export type VerifyCurrentUserEmailChangeOptions = {
  body: API.ChallengeVerification;
};

export type DeleteCurrentUserPasskeyOptions = {
  passkeyID: string;
};

export type AddCurrentUserPasswordOptions = {
  body: API.SetPasswordRequest;
};

export type ChangeCurrentUserPasswordOptions = {
  body: API.ChangePasswordRequest;
};

export type RevokeCurrentUserSessionOptions = {
  sessionID: string;
};

export type ChangeCurrentUsernameOptions = {
  body: API.ChangeUsernameRequest;
};

export type ResendChallengeOptions = {
  body: API.ChallengeReference;
};

export type AcceptInvitationOptions = {
  audience?: "app";
  body: API.InvitationTokenRequest;
};

export type AuthenticateAndAcceptInvitationWithGoogleOptions = {
  audience?: "app";
  body: API.InvitationGoogleRequest;
};

export type LoginAndAcceptInvitationOptions = {
  audience?: "app";
  body: API.InvitationPasswordLoginRequest;
};

export type PreviewInvitationOptions = {
  token: string;
};

export type LoginWithPasswordOptions = {
  audience?: "app" | "admin" | "operator";
  body: API.PasswordLoginRequest;
};

export type LoginWithAppleOptions = {
  audience?: "app" | "admin" | "operator";
  body: API.AppleAuthorizationRequest;
};

export type LoginWithGoogleOptions = {
  audience?: "app" | "admin" | "operator";
  body: API.GoogleLoginRequest;
};

export type ListCurrentUserOrganizationsOptions = {
  cursor?: string;
  limit?: number;
};

export type ListCurrentOrganizationMembersOptions = {
  cursor?: string;
  limit?: number;
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
  cursor?: string;
  limit?: number;
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
  cursor?: string;
  limit?: number;
};

export type GetPublicOrganizationMemberOptions = {
  organizationID: string;
  userID: string;
};

export type UpdatePublicOrganizationMemberOptions = {
  organizationID: string;
  userID: string;
  body: API.UpdateOrganizationMemberRequest;
};

export type SwitchOrganizationOptions = {
  organizationID: string;
  audience?: "app" | "admin" | "operator";
};

export type FinishPasskeyAuthenticationOptions = {
  audience?: "app" | "admin" | "operator";
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

export type StartGoogleAccountRecoveryLinkOptions = {
  body: API.GoogleLoginRequest;
};

export type CompleteAccountRecoveryLinkWithAppleOptions = {
  linkID: string;
  audience?: "app";
  body: API.AccountRecoveryAppleProofRequest;
};

export type CompleteAccountRecoveryLinkWithGoogleOptions = {
  linkID: string;
  audience?: "app";
  body: API.AccountRecoveryGoogleProofRequest;
};

export type CompleteAccountRecoveryLinkWithPasswordOptions = {
  linkID: string;
  audience?: "app";
  body: API.AccountRecoveryPasswordProofRequest;
};

export type ReauthenticateWithAppleOptions = {
  body: API.AppleReauthenticationRequest;
};

export type ReauthenticateWithGoogleOptions = {
  body: API.GoogleReauthenticationRequest;
};

export type FinishPasskeyReauthenticationOptions = {
  body: API.PasskeyReauthenticationFinishRequest;
};

export type BeginPasskeyReauthenticationOptions = {
  body: API.AuthenticationChallengeReference;
};

export type ReauthenticateWithPasswordOptions = {
  body: API.PasswordReauthenticationRequest;
};

export type RefreshSessionOptions = {
  audience?: "app" | "admin" | "operator";
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
  cursor?: string;
  limit?: number;
};

export class AutharaBrowserClient extends AutharaClient {
  public getCurrentAccount(
    options?: GetCurrentAccountOptions,
  ): Promise<API.Account> {
    return this.request<API.Account>("GET", `/auth/api/v1/account`, {
      query: {
        sessions_cursor: options?.sessions_cursor,
        sessions_limit: options?.sessions_limit,
        passkeys_cursor: options?.passkeys_cursor,
        passkeys_limit: options?.passkeys_limit,
      },
      authenticated: true,
    });
  }

  public linkCurrentUserApple(
    options: LinkCurrentUserAppleOptions,
  ): Promise<void> {
    return this.request<void>(
      "POST",
      `/auth/api/v1/account/auth-methods/apple`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public linkCurrentUserGoogle(
    options: LinkCurrentUserGoogleOptions,
  ): Promise<void> {
    return this.request<void>(
      "POST",
      `/auth/api/v1/account/auth-methods/google`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public unlinkCurrentUserAuthMethod(
    options: UnlinkCurrentUserAuthMethodOptions,
  ): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/auth/api/v1/account/auth-methods/${encodeURIComponent(String(options.provider))}`,
      { csrf: true, authenticated: true },
    );
  }

  public startCurrentUserEmailChange(
    options: StartCurrentUserEmailChangeOptions,
  ): Promise<API.ChallengeReference> {
    return this.request<API.ChallengeReference>(
      "POST",
      `/auth/api/v1/account/email-change/challenges`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public verifyCurrentUserEmailChange(
    options: VerifyCurrentUserEmailChangeOptions,
  ): Promise<void> {
    return this.request<void>(
      "POST",
      `/auth/api/v1/account/email-change/challenges/verify`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public deleteCurrentUserPasskey(
    options: DeleteCurrentUserPasskeyOptions,
  ): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/auth/api/v1/account/passkeys/${encodeURIComponent(String(options.passkeyID))}`,
      { csrf: true, authenticated: true },
    );
  }

  public addCurrentUserPassword(
    options: AddCurrentUserPasswordOptions,
  ): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/account/password`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public changeCurrentUserPassword(
    options: ChangeCurrentUserPasswordOptions,
  ): Promise<void> {
    return this.request<void>("PUT", `/auth/api/v1/account/password`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public revokeCurrentUserOtherSessions(): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/auth/api/v1/account/sessions/others`,
      { csrf: true, authenticated: true },
    );
  }

  public revokeCurrentUserSession(
    options: RevokeCurrentUserSessionOptions,
  ): Promise<void> {
    return this.request<void>(
      "DELETE",
      `/auth/api/v1/account/sessions/${encodeURIComponent(String(options.sessionID))}`,
      { csrf: true, authenticated: true },
    );
  }

  public changeCurrentUsername(
    options: ChangeCurrentUsernameOptions,
  ): Promise<void> {
    return this.request<void>("PATCH", `/auth/api/v1/account/username`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public getPublicCapabilities(): Promise<API.Capabilities> {
    return this.request<API.Capabilities>("GET", `/auth/api/v1/capabilities`, {
      authenticated: true,
    });
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

  public acceptInvitation(
    options: AcceptInvitationOptions,
  ): Promise<API.Tokens> {
    return this.request<API.Tokens>("POST", `/auth/api/v1/invitations/accept`, {
      query: { audience: options?.audience },
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public authenticateAndAcceptInvitationWithGoogle(
    options: AuthenticateAndAcceptInvitationWithGoogleOptions,
  ): Promise<API.InvitationGoogleResult> {
    return this.request<API.InvitationGoogleResult>(
      "POST",
      `/auth/api/v1/invitations/google`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public loginAndAcceptInvitation(
    options: LoginAndAcceptInvitationOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/invitations/login`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public previewInvitation(
    options: PreviewInvitationOptions,
  ): Promise<API.InvitationPreview> {
    return this.request<API.InvitationPreview>(
      "GET",
      `/auth/api/v1/invitations/preview`,
      { query: { token: options?.token } },
    );
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

  public loginWithApple(
    options: LoginWithAppleOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>("POST", `/auth/api/v1/oauth/apple`, {
      query: { audience: options?.audience },
      body: options.body,
      csrf: true,
    });
  }

  public getAppleLoginOptions(): Promise<API.AppleLoginOptions> {
    return this.request<API.AppleLoginOptions>(
      "GET",
      `/auth/api/v1/oauth/apple/options`,
    );
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

  public listCurrentUserOrganizations(
    options?: ListCurrentUserOrganizationsOptions,
  ): Promise<API.OrganizationSummaries> {
    return this.request<API.OrganizationSummaries>(
      "GET",
      `/auth/api/v1/organizations`,
      {
        query: { cursor: options?.cursor, limit: options?.limit },
        authenticated: true,
      },
    );
  }

  public getCurrentOrganization(): Promise<API.OrganizationSummary> {
    return this.request<API.OrganizationSummary>(
      "GET",
      `/auth/api/v1/organizations/current`,
      { authenticated: true },
    );
  }

  public listCurrentOrganizationMembers(
    options?: ListCurrentOrganizationMembersOptions,
  ): Promise<API.CurrentOrganizationMembers> {
    return this.request<API.CurrentOrganizationMembers>(
      "GET",
      `/auth/api/v1/organizations/current/members`,
      {
        query: { cursor: options?.cursor, limit: options?.limit },
        authenticated: true,
      },
    );
  }

  public getPublicOrganization(
    options: GetPublicOrganizationOptions,
  ): Promise<API.OrganizationEnvelope> {
    return this.request<API.OrganizationEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}`,
      { authenticated: true },
    );
  }

  public updatePublicOrganization(
    options: UpdatePublicOrganizationOptions,
  ): Promise<API.OrganizationEnvelope> {
    return this.request<API.OrganizationEnvelope>(
      "PATCH",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public listPublicOrganizationInvitations(
    options: ListPublicOrganizationInvitationsOptions,
  ): Promise<API.OrganizationInvitations> {
    return this.request<API.OrganizationInvitations>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations`,
      {
        query: { cursor: options?.cursor, limit: options?.limit },
        authenticated: true,
      },
    );
  }

  public getPublicOrganizationInvitation(
    options: GetPublicOrganizationInvitationOptions,
  ): Promise<API.OrganizationInvitationEnvelope> {
    return this.request<API.OrganizationInvitationEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations/${encodeURIComponent(String(options.invitationID))}`,
      { authenticated: true },
    );
  }

  public revokePublicOrganizationInvitation(
    options: RevokePublicOrganizationInvitationOptions,
  ): Promise<API.OrganizationInvitationEnvelope> {
    return this.request<API.OrganizationInvitationEnvelope>(
      "POST",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/invitations/${encodeURIComponent(String(options.invitationID))}/revoke`,
      { csrf: true, authenticated: true },
    );
  }

  public listPublicOrganizationMembers(
    options: ListPublicOrganizationMembersOptions,
  ): Promise<API.OrganizationMembers> {
    return this.request<API.OrganizationMembers>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/members`,
      {
        query: { cursor: options?.cursor, limit: options?.limit },
        authenticated: true,
      },
    );
  }

  public getPublicOrganizationMember(
    options: GetPublicOrganizationMemberOptions,
  ): Promise<API.OrganizationMemberEnvelope> {
    return this.request<API.OrganizationMemberEnvelope>(
      "GET",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/members/${encodeURIComponent(String(options.userID))}`,
      { authenticated: true },
    );
  }

  public updatePublicOrganizationMember(
    options: UpdatePublicOrganizationMemberOptions,
  ): Promise<API.OrganizationMemberEnvelope> {
    return this.request<API.OrganizationMemberEnvelope>(
      "PATCH",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/members/${encodeURIComponent(String(options.userID))}`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public switchOrganization(
    options: SwitchOrganizationOptions,
  ): Promise<API.Tokens> {
    return this.request<API.Tokens>(
      "POST",
      `/auth/api/v1/organizations/${encodeURIComponent(String(options.organizationID))}/switch`,
      {
        query: { audience: options?.audience },
        csrf: true,
        authenticated: true,
      },
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
      authenticated: true,
    });
  }

  public beginPasskeyRegistration(): Promise<API.PasskeyOptions> {
    return this.request<API.PasskeyOptions>(
      "POST",
      `/auth/api/v1/passkeys/register/options`,
      { csrf: true, authenticated: true },
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

  public startGoogleAccountRecoveryLink(
    options: StartGoogleAccountRecoveryLinkOptions,
  ): Promise<API.AccountRecoveryLink> {
    return this.request<API.AccountRecoveryLink>(
      "POST",
      `/auth/api/v1/provider-links/recovery/google`,
      { body: options.body, csrf: true },
    );
  }

  public completeAccountRecoveryLinkWithApple(
    options: CompleteAccountRecoveryLinkWithAppleOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/provider-links/recovery/${encodeURIComponent(String(options.linkID))}/apple`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public completeAccountRecoveryLinkWithGoogle(
    options: CompleteAccountRecoveryLinkWithGoogleOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/provider-links/recovery/${encodeURIComponent(String(options.linkID))}/google`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public completeAccountRecoveryLinkWithPassword(
    options: CompleteAccountRecoveryLinkWithPasswordOptions,
  ): Promise<API.AuthSession> {
    return this.request<API.AuthSession>(
      "POST",
      `/auth/api/v1/provider-links/recovery/${encodeURIComponent(String(options.linkID))}/password`,
      {
        query: { audience: options?.audience },
        body: options.body,
        csrf: true,
      },
    );
  }

  public reauthenticateWithApple(
    options: ReauthenticateWithAppleOptions,
  ): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/reauthenticate/apple`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public checkRecentAuthentication(): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/reauthenticate/check`, {
      csrf: true,
      authenticated: true,
    });
  }

  public reauthenticateWithGoogle(
    options: ReauthenticateWithGoogleOptions,
  ): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/reauthenticate/google`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public finishPasskeyReauthentication(
    options: FinishPasskeyReauthenticationOptions,
  ): Promise<void> {
    return this.request<void>(
      "POST",
      `/auth/api/v1/reauthenticate/passkeys/finish`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public beginPasskeyReauthentication(
    options: BeginPasskeyReauthenticationOptions,
  ): Promise<API.PasskeyOptions> {
    return this.request<API.PasskeyOptions>(
      "POST",
      `/auth/api/v1/reauthenticate/passkeys/options`,
      { body: options.body, csrf: true, authenticated: true },
    );
  }

  public reauthenticateWithPassword(
    options: ReauthenticateWithPasswordOptions,
  ): Promise<void> {
    return this.request<void>("POST", `/auth/api/v1/reauthenticate/password`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
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
    return this.request<API.CurrentUser>("GET", `/auth/api/v1/user`, {
      authenticated: true,
    });
  }

  public setCurrentUserPassword(
    options: SetCurrentUserPasswordOptions,
  ): Promise<void> {
    return this.request<void>("PUT", `/auth/api/v1/users/password`, {
      body: options.body,
      csrf: true,
      authenticated: true,
    });
  }

  public listPublicUserMemberships(
    options: ListPublicUserMembershipsOptions,
  ): Promise<API.UserMemberships> {
    return this.request<API.UserMemberships>(
      "GET",
      `/auth/api/v1/users/${encodeURIComponent(String(options.userID))}/memberships`,
      {
        query: { cursor: options?.cursor, limit: options?.limit },
        authenticated: true,
      },
    );
  }
}
