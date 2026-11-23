import { Component, OnInit, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Publicacao, StatusPublicacao, TipoPublicacao } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

@Component({
  selector: 'app-pesquisa',
  standalone: false,
  templateUrl: './pesquisa.html',
  styleUrl: './pesquisa.scss',
})
export class Pesquisa implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  termo = '';
  tipo: TipoPublicacao | 'TODOS' = 'TODOS';
  status: StatusPublicacao | 'TODOS' = 'TODOS';
  todasPublicacoes: Publicacao[] = [];
  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  erro = signal('');
  paginaAtual = signal(0);
  totalPaginas = signal(0);

  ngOnInit(): void {
    this.carregarTodas();
  }

  pesquisar(pagina = 0): void {
    void pagina;
    const termo = this.termo.trim().toLowerCase();
    const filtradas = this.todasPublicacoes.filter((publicacao) => {
      const correspondeNome = !termo ||
        publicacao.nome.toLowerCase().includes(termo) ||
        publicacao.descricao.toLowerCase().includes(termo);
      const correspondeTipo = this.tipo === 'TODOS' || publicacao.tipo === this.tipo;
      const correspondeStatus = this.status === 'TODOS' || publicacao.status === this.status;
      return correspondeNome && correspondeTipo && correspondeStatus;
    });
    this.publicacoes.set(filtradas);
    this.paginaAtual.set(0);
    this.totalPaginas.set(1);
  }

  mudarPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas() || this.carregando()) return;
    this.pesquisar(pagina);
  }

  private carregarTodas(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.totalPaginas.set(0);
    this.publicacoesService.listarTodas().subscribe({
      next: (lista) => {
        this.todasPublicacoes = lista;
        this.publicacoes.set(lista);
        this.paginaAtual.set(0);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.publicacoes.set([]);
        this.erro.set(mensagemErro(erro, 'Não foi possível carregar as publicações.'));
        this.carregando.set(false);
      },
    });
  }

  get resultados(): Publicacao[] {
    return this.publicacoes();
  }
}
