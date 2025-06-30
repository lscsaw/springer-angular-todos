import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from './auth.service';
import { JwtResponse } from '../backend';

/**
 * Don't intercept this requests
 */
const paths = ['auth/login', 'auth/refresh', 'assets/i18n'];

let isRefreshing = false;
const nextAccessTokenSubject = new BehaviorSubject<string | undefined>(
  undefined,
);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  let toIntercept = true;
  for (const path of paths) {
    if (req.url.includes(path)) {
      toIntercept = false;
      break;
    }
  }

  if (!toIntercept) {
    return next(req);
  } else {
    req = addToken(req, authService.accessToken());

    return next(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              if (!isRefreshing) {
                isRefreshing = true;
                nextAccessTokenSubject.next(undefined);

                return authService.refreshAccessToken().pipe(
                  switchMap((data: JwtResponse) => {
                    console.info('handle401Error', 'JWT token refreshed');
                    isRefreshing = false;
                    nextAccessTokenSubject.next(data.accessToken);
                    return next(addToken(req, data.accessToken));
                  }),
                  catchError(() => {
                    console.error(
                      'handle401Error',
                      'Could not refresh access token with refresh token',
                    );
                    authService.logout();

                    return next(req);
                  }),
                );
              } else {
                return nextAccessTokenSubject.pipe(
                  filter((token) => !!token),
                  take(1),
                  switchMap((jwt: string | undefined) => {
                    console.info(
                      'handle401Error',
                      'Already refreshing; JWT: "' + jwt + '"',
                    );
                    return next(addToken(req, jwt));
                  }),
                );
              }
            default:
              return throwError(() => error);
          }
        } else if (error.error instanceof ErrorEvent) {
          // Client Side Error
          console.error('intercept', 'Client side error');
          return throwError(() => error as unknown);
        } else {
          // Server Side Error
          console.error('intercept', 'Server side error');
          return throwError(() => error as unknown);
        }
      }),
    );
  }
}

const addToken = (
  req: HttpRequest<unknown>,
  token?: string | null,
): HttpRequest<unknown> =>
  req.clone({
    setHeaders: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    },
  });
