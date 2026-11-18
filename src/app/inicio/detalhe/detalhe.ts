import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Publicacao } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

@Component({
  selector: 'app-detalhe',
  standalone: false,
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.scss',
})
export class Detalhe implements OnInit {
  private route = inject(ActivatedRoute);
  private publicacoesService = inject(PublicacaoService);
  protected auth = inject(AuthService);

  publicacao = signal<Publicacao | null>(null);
  carregando = signal(true);
  erro = signal('');
  contatoVisivel = signal(false);

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
    this.contatoVisivel.set(true);
  }
}
