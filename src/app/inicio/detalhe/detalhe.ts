import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Publicacao, PublicacaoContato, PublicacaoRequest, StatusPublicacao, TipoPublicacao } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

@Component({
  selector: 'app-detalhe',
  standalone: false,
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.scss',
})
export class Detalhe implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);
  readonly hoje = new Date();

  publicacao = signal<Publicacao | null>(null);
  carregando = signal(true);
  erro = signal('');
  contatoVisivel = signal(false);
  contatosPublicacao = signal<PublicacaoContato[]>([]);
  carregandoContatos = signal(false);
  editando = signal(false);
  salvando = signal(false);
  mensagem = signal('');

  tituloEdicao = '';
  descricaoEdicao = '';
  tipoEdicao: TipoPublicacao = 'PERDIDO';
  statusEdicao: StatusPublicacao = 'ATIVA';
  dataEdicao: Date | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.erro.set('Publicação não encontrada.');
      this.carregando.set(false);
      return;
    }
    this.publicacoesService.buscarPorId(id).subscribe({
      next: (p) => {
        this.publicacao.set(p);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Publicação não encontrada.');
        this.carregando.set(false);
      },
    });
  }

  verContato(): void {
    const p = this.publicacao();
    if (!p) return;

    this.carregandoContatos.set(true);
    this.mensagem.set('');
    this.publicacoesService.listarContatos(p.idPublicacao).subscribe({
      next: (contatos) => {
        this.contatosPublicacao.set(contatos);
        this.carregandoContatos.set(false);
        this.contatoVisivel.set(true);
      },
      error: (erro) => {
        this.carregandoContatos.set(false);
        this.mensagem.set(mensagemErro(erro, 'Não foi possível carregar os contatos desta publicação.'));
      },
    });
  }

  podeEditar(p: Publicacao): boolean {
    if (this.auth.admin) return true;
    return p.status === 'ATIVA' &&
      p.usuario?.idUsuario !== undefined &&
      p.usuario.idUsuario === this.auth.usuario?.idUsuario;
  }

  podeExcluir(p: Publicacao): boolean {
    return this.auth.admin || this.podeEditar(p);
  }

  editar(p: Publicacao): void {
    if (!this.podeEditar(p)) return;
    this.editando.set(true);
    this.mensagem.set('');
    this.tituloEdicao = p.nome;
    this.descricaoEdicao = p.descricao;
    this.tipoEdicao = p.tipo;
    this.statusEdicao = p.status;
    this.dataEdicao = new Date(`${p.dataOcorrencia.slice(0, 10)}T12:00:00`);
  }

  cancelarEdicao(): void {
    this.editando.set(false);
  }

  get edicaoValida(): boolean {
    return !!this.tituloEdicao.trim() &&
      !!this.descricaoEdicao.trim() &&
      !!this.dataEdicao;
  }

  salvarEdicao(p: Publicacao): void {
    if (!this.podeEditar(p) || !this.edicaoValida || !p.local || !this.dataEdicao) return;
    this.salvando.set(true);
    this.mensagem.set('');
    const dados: PublicacaoRequest = {
      idLocal: p.local.idLocal,
      nome: this.tituloEdicao.trim(),
      descricao: this.descricaoEdicao.trim(),
      dataOcorrencia: this.formatarData(this.dataEdicao),
      tipo: this.tipoEdicao,
      status: this.statusEdicao,
      idsContatos: p.contatos?.map((contato) => contato.idContato) ?? [],
    };
    this.publicacoesService.atualizar(p.idPublicacao, dados).subscribe({
      next: (atualizada) => {
        this.publicacao.set(atualizada);
        this.editando.set(false);
        this.salvando.set(false);
        this.mensagem.set('Publicação atualizada.');
      },
      error: (erro) => {
        this.salvando.set(false);
        this.mensagem.set(mensagemErro(erro, 'Não foi possível atualizar a publicação.'));
      },
    });
  }

  excluir(p: Publicacao): void {
    if (!this.podeExcluir(p)) return;
    if (!window.confirm(`Excluir a publicação "${p.nome}"? Essa ação não pode ser desfeita.`)) return;
    this.publicacoesService.excluir(p.idPublicacao).subscribe({
      next: () => this.router.navigate(['/inicio/pesquisar']),
      error: (erro) => this.mensagem.set(mensagemErro(erro, 'Não foi possível excluir a publicação.')),
    });
  }

  private formatarData(d: Date): string {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
