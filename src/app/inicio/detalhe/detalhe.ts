import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface DetalhePublicacao {
  publicado: string;
  titulo: string;
  tipo: 'Perdido' | 'Encontrado';
  status: 'Ativo' | 'Resolvido';
  local: string;
  dataOcorrencia: string;
  descricao: string;
  contato: string;
}

@Component({
  selector: 'app-detalhe',
  standalone: false,
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.scss',
})
export class Detalhe {
  private publicacoes: DetalhePublicacao[] = [
    {
      publicado: 'Publicado em 01/09/2026 às 14:26',
      titulo: 'Garrafa Stanley perdida no Bloco 7',
      tipo: 'Perdido', status: 'Ativo', local: 'Bloco 7',
      dataOcorrencia: '31/08/2026',
      descricao: 'Perdi uma garrafa azul próxima às salas do bloco 7. Caso alguém tenha encontrado, entre em contato.',
      contato: '(43) 99999-9999',
    },
    {
      publicado: 'Publicado em 27/08/2026 às 02:34',
      titulo: 'Mochila perdida nos corredores',
      tipo: 'Encontrado', status: 'Ativo', local: 'Corredores da faculdade',
      dataOcorrencia: '27/08/2026',
      descricao: 'Foi encontrada uma mochila preta no corredor. Entre em contato para combinar a retirada.',
      contato: '(66) 66666-6666',
    },
    {
      publicado: 'Publicado em 27/08/2026 às 02:34',
      titulo: 'Celular e carteira perdidos',
      tipo: 'Perdido', status: 'Ativo', local: 'Não informado',
      dataOcorrencia: '27/08/2026',
      descricao: 'Procuro um celular e uma carteira perdidos na faculdade.',
      contato: 'Contato não informado',
    },
  ];

  publicacao: DetalhePublicacao = this.publicacoes[0];
  contatoVisivel = false;

  constructor(private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id >= 0 && id < this.publicacoes.length) {
      this.publicacao = this.publicacoes[id];
    }
  }

  verContato(): void {
    this.contatoVisivel = true;
  }
}
