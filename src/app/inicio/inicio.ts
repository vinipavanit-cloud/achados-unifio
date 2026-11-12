import { Component } from '@angular/core';

interface PublicacaoResumo {
  data: string;
  titulo: string;
  descricao: string;
  tipo: 'Perdido' | 'Encontrado';
}

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  usuario = 'User0000000000';
  menuSelecionado = 'inicio';

  // Conteúdo provisório para reproduzir o layout do Figma até a API de publicações ficar pronta.
  publicacoes: PublicacaoResumo[] = [
    {
      data: 'Publicado 01/09/2026 14:26',
      titulo: 'Garrafa Stanley perdida no Bloco 7',
      descricao: 'Perdi uma garrafa no bloco 7 no dia 31/09/2026...',
      tipo: 'Perdido',
    },
    {
      data: 'Publicado 27/08/2026 02:34',
      titulo: 'Mochila perdida nos corredores',
      descricao: 'Acabei deixando uma mochila preta no corredor...',
      tipo: 'Encontrado',
    },
    {
      data: 'Publicado 27/08/2026 02:34',
      titulo: 'Celular e carteira perdidos',
      descricao: 'Alguém pelo amor de Deus consegue me...',
      tipo: 'Perdido',
    },
  ];

  selecionarMenu(menu: string): void {
    this.menuSelecionado = menu;
  }
}
