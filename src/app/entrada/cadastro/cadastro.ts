import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: './cadastro.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  mostrarSenha = false;
  mostrarConfirmacao = false;
  mensagem = '';

  get emailValido(): boolean {
    return /^[^\s@]+@unifio\.edu\.br$/i.test(this.email.trim());
  }

  get senhasConferem(): boolean {
    return this.senha === this.confirmarSenha;
  }

  get formularioValido(): boolean {
    return (
      !!this.nome.trim() &&
      this.emailValido &&
      this.senha.length >= 8 &&
      this.senhasConferem
    );
  }

  cadastrar(): void {
    if (!this.formularioValido) return;
    // A API de cadastro ainda não foi disponibilizada: isto é uma simulação.
    this.mensagem =
      'Dados validados (simulação). O cadastro será gravado quando a API estiver integrada.';
  }

  limpar(): void {
    this.nome = '';
    this.email = '';
    this.senha = '';
    this.confirmarSenha = '';
    this.mensagem = '';
  }
}
