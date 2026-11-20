import { Component, OnInit, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Publicacao } from '../../core/models';
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
  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  erro = signal('');
  paginaAtual = signal(0);
  totalPaginas = signal(0);

  ngOnInit(): void {
    this.carregarTodas();
  }

  pesquisar(pagina = 0): void {
    const termo = this.termo.trim();
    if (!termo) {
      this.carregarTodas();
      return;
    }

    this.carregando.set(true);
    this.erro.set('');
    this.publicacoesService.buscarPorNome(termo, pagina).subscribe({
      next: (resultado) => {
        this.publicacoes.set(resultado.content);
        this.paginaAtual.set(resultado.number);
        this.totalPaginas.set(resultado.totalPages);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.publicacoes.set([]);
        this.totalPaginas.set(0);
        this.erro.set(mensagemErro(erro, 'Não foi possível pesquisar as publicações.'));
        this.carregando.set(false);
      },
    });
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
