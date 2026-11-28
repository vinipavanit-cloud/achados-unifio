import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErro } from '../../core/api.config';
import { ModoVisitanteService } from '../../core/modo-visitante.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private visitante = inject(ModoVisitanteService);

  email = '';
  senha = '';
  lembrarMe = false;
  mostrarSenha = false;
  mensagem = signal('');
  enviando = signal(false);
  verificandoServidor = signal(true);
  servidorOffline = signal(false);

  ngOnInit(): void {
    if (this.visitante.ativo()) {
      this.visitante.desativar();
      this.auth.limparSessao();
    }
    this.verificarServidor();
  }

  verificarServidor(): void {
    this.verificandoServidor.set(true);
    this.visitante.verificarBackend().subscribe((online) => {
      this.servidorOffline.set(!online);
      this.verificandoServidor.set(false);
    });
  }

  entrarComoVisitante(): void {
    this.auth.entrarComoVisitante();
    this.router.navigate(['/inicio']);
  }

  entrar(): void {
    this.mensagem.set('');

    if (!this.email.trim() || !this.senha) {
      this.mensagem.set('Preencha o e-mail e a senha.');
      return;
    }

    this.enviando.set(true);
    this.auth.login(this.email.trim(), this.senha).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/inicio']);
      },
      error: (erro) => {
        this.enviando.set(false);
        if (erro?.status === 0 || erro?.status === 404 || erro?.status >= 500) {
          this.servidorOffline.set(true);
        }
        this.mensagem.set(
          erro?.status === 401
            ? 'E-mail ou senha incorretos.'
            : mensagemErro(erro, 'Não foi possível entrar. Tente novamente.'),
        );
      },
    });
  }
}
