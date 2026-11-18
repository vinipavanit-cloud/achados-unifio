import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErro } from '../../core/api.config';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  lembrarMe = false;
  mostrarSenha = false;
  mensagem = signal('');
  enviando = signal(false);

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
        this.mensagem.set(
          erro?.status === 401
            ? 'E-mail ou senha incorretos.'
            : mensagemErro(erro, 'Não foi possível entrar. Tente novamente.'),
        );
      },
    });
  }
}
