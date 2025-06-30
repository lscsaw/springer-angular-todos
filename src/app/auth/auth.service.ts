import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  JwtResponse,
  RefreshJwtWithSessionTokenDto,
  UserLoginDto,
} from '../backend';
import { tap } from 'rxjs';

const refreshTokenKey = 'refreshToken';
const accessTokenKey = 'accessToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  accessToken = signal(localStorage.getItem(accessTokenKey));

  isLoggedIn = signal(!!localStorage.getItem(refreshTokenKey));

  logout() {
    localStorage.removeItem(refreshTokenKey);
    localStorage.clear();
    this.isLoggedIn.set(false);
    window?.location.reload();
  }

  login(dto: UserLoginDto) {
    return this.httpClient
      .post<JwtResponse>(`${environment.apiUrl}/v1/auth/login`, dto)
      .pipe(
        tap((response) => {
          this.accessToken.set(response.accessToken);
          localStorage.setItem(refreshTokenKey, response.refreshToken);
          localStorage.setItem(accessTokenKey, response.accessToken);
          this.isLoggedIn.set(true);
        }),
      );
  }

  refreshAccessToken() {
    return this.httpClient
      .post<JwtResponse>(`${environment.apiUrl}/v1/auth/refresh`, {
        refreshToken: localStorage.getItem(refreshTokenKey)!!,
      } satisfies RefreshJwtWithSessionTokenDto)
      .pipe(
        tap((response) => {
          this.accessToken.set(response.accessToken);
          localStorage.setItem(refreshTokenKey, response.refreshToken);
          localStorage.setItem(accessTokenKey, response.accessToken);
        }),
      );
  }
}
