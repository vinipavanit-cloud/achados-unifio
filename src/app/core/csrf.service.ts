import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private http = inject(HttpClient);
  private cache$: Observable<string> | null = null;

  token(): Observable<string> {
    if (!this.cache$) {
      this.cache$ = this.http.get<{ token: string }>(`${API_URL}/usuario/autenticacao/csrf`).pipe(
        map((r) => r.token),
        shareReplay(1),
        catchError((e) => {
          this.cache$ = null;
          return throwError(() => e);
        }),
      );
    }
    return this.cache$;
  }

  // O Spring troca o token ao logar/deslogar; é preciso buscar de novo.
  limpar(): void {
    this.cache$ = null;
  }
}
