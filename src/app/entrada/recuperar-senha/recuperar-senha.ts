import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: false,
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.scss',
})
export class RecuperarSenha {
  constructor(private router: Router) {}

  email = '';
  mensagem = '';
  tipoMensagem: 'erro' | 'aviso' = 'erro';

  enviarCodigo(): void {
    this.mensagem = '';
    const email = this.email.trim();

    if (!email) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Informe seu e-mail institucional.';
      return;
    }

    if (!/^[^\s@]+@unifio\.edu\.br$/i.test(email)) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Informe um e-mail institucional válido (@unifio.edu.br).';
      return;
    }

    // A navegação permite demonstrar o fluxo visual enquanto a API não está disponível.
    this.router.navigate(['/entrada/confirmar-codigo']);
  }
}
