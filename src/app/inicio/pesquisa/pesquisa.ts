import { Component, OnInit, inject, signal } from '@angular/core';
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

  ngOnInit(): void {
    this.publicacoesService.listarTodas().subscribe({
      next: (lista) => {
        this.publicacoes.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as publicações.');
        this.carregando.set(false);
      },
    });
  }

  get resultados(): Publicacao[] {
    const termo = this.termo.trim().toLocaleLowerCase('pt-BR');
    const todas = this.publicacoes();
    if (!termo) return todas;
    return todas.filter((item) =>
      [item.nome, item.descricao, item.tipo, item.local?.nome ?? ''].some((valor) =>
        valor.toLocaleLowerCase('pt-BR').includes(termo),
      ),
    );
  }
}
