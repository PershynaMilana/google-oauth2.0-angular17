import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  profileSubject: BehaviorSubject<{ email: string; token: string }> =
    new BehaviorSubject<{ email: string; token: string }>({
      email: '',
      token: '',
    });

  constructor(private oauthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId:
        'YOUR_CLIENT_ID',
      redirectUri: window.location.origin + '/main',
      scope: 'openid profile email',
    };

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.loadProfile();
      }
    });
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  loadProfile() {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      const email = claims['email'];
      const token = this.oauthService.getAccessToken();
      const profileData = { email, token };
      this.profileSubject.next(profileData);
    }
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
}
