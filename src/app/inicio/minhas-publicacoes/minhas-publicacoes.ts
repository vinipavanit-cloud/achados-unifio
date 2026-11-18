import { Component, OnInit, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Publicacao, PublicacaoRequest, StatusPublicacao } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

type Filtro = 'TODAS' | StatusPublicacao;

@Component({
  selector: 'app-minhas-publicacoes',
  standalone: false,
  templateUrl: './minhas-publicacoes.html',
  styleUrl: './minhas-publicacoes.scss',
})
export class MinhasPublicacoes implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  filtros: { rotulo: string; valor: Filtro }[] = [
    { rotulo: 'Todas', valor: 'TODAS' },
    { rotulo: 'Ativas', valor: 'ATIVA' },
    { rotulo: 'Finalizadas', valor: 'FINALIZADA' },
    { rotulo: 'Canceladas', valor: 'CANCELADA' },
  ];
  filtro: Filtro = 'TODAS';

  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  mensagem = signal('');

  editandoId: number | null = null;
  tituloEdicao = '';
  descricaoEdicao = '';

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    const idUsuario = this.auth.usuario?.idUsuario;
    this.publicacoesService.listarTodas().subscribe({
      next: (lista) => {
        // Enquanto não existir GET /publicacao/minhas, filtramos pelo usuário logado aqui.
        this.publicacoes.set(lista.filter((p) => p.usuario?.idUsuario === idUsuario));
        this.carregando.set(false);
      },
      error: () => {
        this.mensagem.set('Não foi possível carregar suas publicações.');
        this.carregando.set(false);
      },
    });
  }

  get lista(): Publicacao[] {
    const todas = this.publicacoes();
    return this.filtro === 'TODAS' ? todas : todas.filter((p) => p.status === this.filtro);
  }

  get edicaoValida(): boolean {
    return !!this.tituloEdicao.trim() && !!this.descricaoEdicao.trim();
  }

  alteravel(p: Publicacao): boolean {
    return p.status === 'ATIVA';
  }

  editar(p: Publicacao): void {
    if (!this.alteravel(p)) return;
    this.editandoId = p.idPublicacao;
    this.tituloEdicao = p.nome;
    this.descricaoEdicao = p.descricao;
    this.mensagem.set('');
  }

  salvarEdicao(p: Publicacao): void {
    if (!this.alteravel(p) || !this.edicaoValida) return;
    this.enviarAtualizacao(
      p,
      { nome: this.tituloEdicao.trim(), descricao: this.descricaoEdicao.trim() },
      'Publicação atualizada.',
    );
  }

  cancelarEdicao(): void {
    this.editandoId = null;
  }

  finalizar(p: Publicacao): void {
    if (!this.alteravel(p)) return;
    this.enviarAtualizacao(p, { status: 'FINALIZADA' }, 'Ocorrência finalizada.');
  }

  cancelar(p: Publicacao): void {
    if (!this.alteravel(p)) return;
    this.enviarAtualizacao(p, { status: 'CANCELADA' }, 'Ocorrência cancelada.');
  }

  excluir(p: Publicacao): void {
    if (!window.confirm(`Excluir a publicação "${p.nome}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    this.publicacoesService.excluir(p.idPublicacao).subscribe({
      next: () => {
        this.editandoId = null;
        this.mensagem.set('Publicação excluída.');
        this.carregar();
      },
      error: (erro) => this.mensagem.set(mensagemErro(erro, 'Não foi possível excluir.')),
    });
  }

  private enviarAtualizacao(
    p: Publicacao,
    mudancas: Partial<PublicacaoRequest>,
    sucesso: string,
  ): void {
    if (!p.local) {
      this.mensagem.set('Publicação sem local; não é possível atualizar.');
      return;
    }
    const dados: PublicacaoRequest = {
      idLocal: p.local.idLocal,
      nome: p.nome,
      descricao: p.descricao,
      dataOcorrencia: p.dataOcorrencia.slice(0, 10),
      tipo: p.tipo,
      status: p.status,
      contato: p.contato ?? undefined,
      ...mudancas,
    };
    this.publicacoesService.atualizar(p.idPublicacao, dados).subscribe({
      next: () => {
        this.editandoId = null;
        this.mensagem.set(sucesso);
        this.carregar();
      },
      error: (erro) => this.mensagem.set(mensagemErro(erro, 'Não foi possível atualizar.')),
    });
  }
}
