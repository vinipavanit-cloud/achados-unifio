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

  renovar(): Observable<string> {
    this.limpar();
    return this.token();
  }

  limpar(): void {
    this.cache$ = null;
  }
}
