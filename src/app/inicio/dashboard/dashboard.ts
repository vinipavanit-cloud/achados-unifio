import { Component, OnInit, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { Dashboard as DashboardDados } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  dados = signal<DashboardDados | null>(null);
  carregando = signal(true);
  erro = signal('');

  ngOnInit(): void {
    this.publicacoesService.dashboard().subscribe({
      next: (dados) => {
        this.dados.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.erro.set(mensagemErro(erro, 'Não foi possível carregar os indicadores.'));
        this.carregando.set(false);
      },
    });
  }
}
