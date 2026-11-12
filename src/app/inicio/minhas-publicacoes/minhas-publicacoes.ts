import { Component } from '@angular/core';

type Status = 'Ativa' | 'Finalizada' | 'Cancelada';
type Filtro = 'Todas' | Status;

interface MinhaPublicacao {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  status: Status;
}

@Component({
  selector: 'app-minhas-publicacoes',
  standalone: false,
  templateUrl: './minhas-publicacoes.html',
  styleUrl: './minhas-publicacoes.scss',
})
export class MinhasPublicacoes {
  usuario = 'User0000000000';

  // Mesmo valor usado no value de cada mat-button-toggle (filtro no template).
  filtros: { rotulo: string; valor: Filtro }[] = [
    { rotulo: 'Todas', valor: 'Todas' },
    { rotulo: 'Ativas', valor: 'Ativa' },
    { rotulo: 'Finalizadas', valor: 'Finalizada' },
    { rotulo: 'Canceladas', valor: 'Cancelada' },
  ];
  filtro: Filtro = 'Todas';

  // Dados provisórios até a API de publicações do backend ficar pronta.
  publicacoes: MinhaPublicacao[] = [
    {
      id: 1,
      titulo: 'Garrafa Stanley perdida no Bloco 7',
      descricao: 'Perdi uma garrafa azul próxima às salas do bloco 7.',
      data: '01/09/2026',
      status: 'Ativa',
    },
    {
      id: 2,
      titulo: 'Caderno encontrado na Biblioteca',
      descricao: 'Caderno encontrado na mesa de estudos da biblioteca.',
      data: '18/08/2026',
      status: 'Finalizada',
    },
  ];

  editandoId: number | null = null;
  tituloEdicao = '';
  descricaoEdicao = '';
  mensagem = '';

  get lista(): MinhaPublicacao[] {
    return this.filtro === 'Todas'
      ? this.publicacoes
      : this.publicacoes.filter((p) => p.status === this.filtro);
  }

  get edicaoValida(): boolean {
    return !!this.tituloEdicao.trim() && !!this.descricaoEdicao.trim();
  }

  alteravel(p: MinhaPublicacao): boolean {
    return p.status === 'Ativa';
  }

  editar(p: MinhaPublicacao): void {
    if (!this.alteravel(p)) return;
    this.editandoId = p.id;
    this.tituloEdicao = p.titulo;
    this.descricaoEdicao = p.descricao;
    this.mensagem = '';
  }

  salvarEdicao(p: MinhaPublicacao): void {
    if (!this.alteravel(p) || !this.edicaoValida) return;
    // Simulação: a alteração só é aplicada localmente (PUT ainda não existe).
    p.titulo = this.tituloEdicao.trim();
    p.descricao = this.descricaoEdicao.trim();
    this.editandoId = null;
    this.mensagem = 'Alteração aplicada (simulação). Será gravada quando a API estiver integrada.';
  }

  cancelarEdicao(): void {
    this.editandoId = null;
  }

  finalizar(p: MinhaPublicacao): void {
    if (!this.alteravel(p)) return;
    p.status = 'Finalizada';
    this.editandoId = null;
    this.mensagem = 'Ocorrência finalizada (simulação). Será gravada quando a API estiver integrada.';
  }

  cancelar(p: MinhaPublicacao): void {
    if (!this.alteravel(p)) return;
    p.status = 'Cancelada';
    this.editandoId = null;
    this.mensagem = 'Ocorrência cancelada (simulação). Será gravada quando a API estiver integrada.';
  }
}
