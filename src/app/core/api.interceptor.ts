import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_URL } from './api.config';
import { AuthService } from './auth.service';
import { CsrfService } from './csrf.service';

// Envia cookies de sessão e o token CSRF em toda chamada de escrita ao backend.
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) return next(req);

  const csrf = inject(CsrfService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const base = req.clone({ withCredentials: true });
  const leitura = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  const envio$ = leitura
    ? next(base)
    : csrf
        .token()
        .pipe(switchMap((token) => next(base.clone({ setHeaders: { 'X-CSRF-TOKEN': token } }))));

  return envio$.pipe(
    catchError((erro: unknown) => {
      if (
        erro instanceof HttpErrorResponse &&
        erro.status === 401 &&
        !req.url.endsWith('/usuario/autenticacao/login')
      ) {
        auth.limparSessao();
        router.navigate(['/entrada/login']);
      }
      return throwError(() => erro);
    }),
  );
};
