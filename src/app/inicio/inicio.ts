import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Publicacao } from '../core/models';
import { PublicacaoService, calcularKpis } from '../core/publicacao.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  publicacoes = signal<Publicacao[]>([]);
  carregando = signal(true);
  erro = signal('');

  recentes = computed(() => this.publicacoes().slice(0, 3));
  kpis = computed(() => calcularKpis(this.publicacoes(), this.auth.usuario?.idUsuario));

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
}
