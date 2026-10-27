
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  senha = '';
  lembrarMe = false;
  mostrarSenha = false;
  mensagem = '';

  entrar(): void {
    this.mensagem = '';

    if (!this.email.trim() || !this.senha) {
      this.mensagem = 'Preencha o e-mail e a senha.';
      return;
    }

    this.mensagem =
      'Formulário validado. A autenticação ainda precisa ser conectada.';
  }
}

