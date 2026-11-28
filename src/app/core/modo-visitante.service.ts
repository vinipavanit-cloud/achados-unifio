import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { API_URL } from './api.config';
import { MockBackendService } from './mock-backend.service';
import { UsuarioLogado } from './models';

const CHAVE = 'achados.visitante';

@Injectable({ providedIn: 'root' })
export class ModoVisitanteService {
  private http = inject(HttpClient);
  private mock = inject(MockBackendService);

  readonly ativo = signal(this.lerFlag());

  verificarBackend(): Observable<boolean> {
    return this.http.get<{ token?: string }>(`${API_URL}/usuario/autenticacao/csrf`).pipe(
      timeout(5000),
      map((r) => !!r?.token),
      catchError(() => of(false)),
    );
  }

  ativar(): UsuarioLogado {
    this.mock.reiniciar();
    this.gravarFlag(true);
    this.ativo.set(true);
    return this.mock.usuarioVisitante();
  }

  desativar(): void {
    this.gravarFlag(false);
    this.ativo.set(false);
    this.mock.descartar();
  }

  private lerFlag(): boolean {
    try {
      return sessionStorage.getItem(CHAVE) === '1';
    } catch {
      return false;
    }
  }

  private gravarFlag(valor: boolean): void {
    try {
      if (valor) sessionStorage.setItem(CHAVE, '1');
      else sessionStorage.removeItem(CHAVE);
    } catch {
    }
  }
}
