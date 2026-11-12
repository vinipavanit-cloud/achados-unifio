import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nova-senha',
  standalone: false,
  templateUrl: './nova-senha.html',
  styleUrl: './nova-senha.scss',
})
export class NovaSenha {
  senha = '';
  confirmarSenha = '';
  mostrarSenha = false;
  mostrarConfirmacao = false;
  mensagem = '';
  tipoMensagem: 'erro' | 'aviso' = 'erro';

  constructor(private router: Router) {}

  salvarNovaSenha(): void {
    this.mensagem = '';

    if (!this.senha || !this.confirmarSenha) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Preencha os dois campos de senha.';
      return;
    }

    if (this.senha.length < 8) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'A senha deve ter pelo menos 8 caracteres.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'As senhas não coincidem.';
      return;
    }

    this.tipoMensagem = 'aviso';
    this.mensagem = 'As senhas foram validadas. A alteração ainda depende da integração com a API.';
  }

  voltar(): void {
    this.router.navigate(['/entrada/confirmar-codigo']);
  }
}
