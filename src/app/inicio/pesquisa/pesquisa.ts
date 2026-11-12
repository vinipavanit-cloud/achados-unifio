import { Component } from '@angular/core';

interface Publicacao {
  data: string;
  titulo: string;
  descricao: string;
  tipo: 'Perdido' | 'Encontrado';
}

@Component({
  selector: 'app-pesquisa',
  standalone: false,
  templateUrl: './pesquisa.html',
  styleUrl: './pesquisa.scss',
})
export class Pesquisa {
  termo = '';

  // Dados temporários até a equipe disponibilizar o endpoint de publicações.
  publicacoes: Publicacao[] = [
    {
      data: 'Publicado 01/09/2026 14:26',
      titulo: 'Garrafa Stanley perdida no Bloco 7',
      descricao: 'Perdi uma garrafa no bloco 7 no dia 31/09/2026. A cor dela era azul, para mais detalhes chama no whatsapp (43) 9999999999',
      tipo: 'Perdido',
    },
    {
      data: 'Publicado 27/08/2026 02:34',
      titulo: 'Mochila perdida nos corredores',
      descricao: 'Acabei deixando uma mochila preta no corredor, se alguém encontrar, favor dar um toque em (66) 6666666666',
      tipo: 'Encontrado',
    },
  ];

  indiceOriginal(publicacao: Publicacao): number {
    return this.publicacoes.indexOf(publicacao);
  }

  get resultados(): Publicacao[] {
    const termo = this.termo.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return this.publicacoes;
    return this.publicacoes.filter((item) =>
      [item.titulo, item.descricao, item.tipo].some((valor) =>
        valor.toLocaleLowerCase('pt-BR').includes(termo),
      ),
    );
  }
}
