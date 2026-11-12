import { Component } from '@angular/core';

@Component({
  selector: 'app-publicar',
  standalone: false,
  templateUrl: './publicar.html',
  styleUrl: './publicar.scss',
})
export class Publicar {
  titulo = '';
  data = '';
  descricao = '';
  contato = '';
  mensagem = '';

  enviar(): void {
    if (!this.titulo.trim() || !this.data || !this.descricao.trim() || !this.contato.trim()) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }
    // A API de publicações ainda não foi disponibilizada pela equipe de backend.
    this.mensagem = 'Dados preenchidos. A publicação será enviada quando a API estiver integrada.';
  }
}
