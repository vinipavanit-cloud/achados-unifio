import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, switchMap } from 'rxjs';
import { API_URL } from './api.config';
import { CsrfService } from './csrf.service';
import { ModoVisitanteService } from './modo-visitante.service';
import { UsuarioLogado, UsuarioResumo } from './models';

const CHAVE = 'achados.usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);
  private router = inject(Router);
  private visitante = inject(ModoVisitanteService);

  usuario: UsuarioLogado | null = this.ler();

  get logado(): boolean {
    return this.usuario !== null;
  }

  get nome(): string {
    return this.usuario?.nome ?? '';
  }

  // Aceita "ADMIN" e "ROLE_ADMIN". Sessões antigas, sem permissão guardada, não são admin.
  get admin(): boolean {
    return /admin/i.test(this.usuario?.permissao ?? '');
  }

  cadastrar(nome: string, email: string, senha: string): Observable<UsuarioResumo> {
    return this.csrf.token().pipe(
      switchMap(() =>
        this.http.post<UsuarioResumo>(`${API_URL}/usuario/autenticacao/cadastrar`, {
          nome,
          email,
          senha,
        }),
      ),
    );
  }

  login(email: string, senha: string): Observable<UsuarioLogado> {
    const corpo = new HttpParams().set('email', email).set('senha', senha).toString();
    return this.csrf.token().pipe(
      switchMap(() =>
        this.http.post(`${API_URL}/usuario/autenticacao/login`, corpo, {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
          responseType: 'text',
        }),
      ),
      switchMap(() => this.csrf.renovar()),
      switchMap(() => this.http.get<UsuarioResumo & { email: string }>(`${API_URL}/usuario/me`)),
      map((me) => {
        const usuario: UsuarioLogado = {
          idUsuario: me.idUsuario,
          nome: me.nome,
          email: me.email,
          permissao: me.permissao,
        };
        this.guardar(usuario);
        return usuario;
      }),
    );
  }

  entrarComoVisitante(): UsuarioLogado {
    const usuario = this.visitante.ativar();
    this.guardar(usuario);
    return usuario;
  }

  sair(): void {
    if (this.visitante.ativo()) {
      this.visitante.desativar();
      this.limparSessao();
      this.router.navigate(['/entrada/login']);
      return;
    }
    this.http
      .post(`${API_URL}/logout`, null, { responseType: 'text' })
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.limparSessao();
          this.router.navigate(['/entrada/login']);
        }),
      )
      .subscribe();
  }

  limparSessao(): void {
    this.usuario = null;
    this.csrf.limpar();
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {
      // armazenamento indisponível: ignora
    }
  }

  private guardar(usuario: UsuarioLogado): void {
    this.usuario = usuario;
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify(usuario));
    } catch {
      // armazenamento indisponível: a sessão vale só até recarregar
    }
  }

  private ler(): UsuarioLogado | null {
    try {
      const bruto = sessionStorage.getItem(CHAVE);
      return bruto ? (JSON.parse(bruto) as UsuarioLogado) : null;
    } catch {
      return null;
    }
  }
}
