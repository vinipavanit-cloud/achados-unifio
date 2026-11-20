import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Publicacao } from '../../core/models';
import { PublicacaoService, calcularKpis } from '../../core/publicacao.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  erro = signal('');

  kpis = computed(() => calcularKpis(this.publicacoes(), this.auth.usuario?.idUsuario));

  ngOnInit(): void {
    this.publicacoesService.listarTodas().subscribe({
      next: (lista) => {
        this.publicacoes.set(lista);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.erro.set(mensagemErro(erro, 'Não foi possível carregar os indicadores.'));
        this.carregando.set(false);
      },
    });
  }
}
