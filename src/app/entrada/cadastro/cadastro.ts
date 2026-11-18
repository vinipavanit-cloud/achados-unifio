import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensagemErro } from '../../core/api.config';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: './cadastro.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private auth = inject(AuthService);
  private router = inject(Router);

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  mostrarSenha = false;
  mostrarConfirmacao = false;
  mensagem = signal('');
  enviando = signal(false);

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
    if (!this.formularioValido || this.enviando()) return;
    this.enviando.set(true);
    this.mensagem.set('');
    this.auth.cadastrar(this.nome.trim(), this.email.trim(), this.senha).subscribe({
      next: () => {
        this.enviando.set(false);
        this.mensagem.set('Cadastro realizado! Redirecionando para o login...');
        setTimeout(() => this.router.navigate(['/entrada/login']), 1200);
      },
      error: (erro) => {
        this.enviando.set(false);
        this.mensagem.set(mensagemErro(erro, 'Não foi possível concluir o cadastro.'));
      },
    });
  }

  limpar(): void {
    this.nome = '';
    this.email = '';
    this.senha = '';
    this.confirmarSenha = '';
    this.mensagem.set('');
  }
}
