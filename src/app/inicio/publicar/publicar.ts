import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { LocalService } from '../../core/local.service';
import { Local, TipoPublicacao } from '../../core/models';
import { PublicacaoService } from '../../core/publicacao.service';

@Component({
  selector: 'app-publicar',
  standalone: false,
  templateUrl: './publicar.html',
  styleUrl: './publicar.scss',
})
export class Publicar implements OnInit {
  private publicacoesService = inject(PublicacaoService);
  private localService = inject(LocalService);
  private router = inject(Router);
  protected auth = inject(AuthService);

  titulo = '';
  tipo: TipoPublicacao = 'PERDIDO';
  idLocal: number | null = null;
  data: Date | null = null;
  readonly hoje = new Date();
  descricao = '';
  contato = '';

  locais = signal<Local[]>([]);
  mensagem = signal('');
  enviando = signal(false);

  ngOnInit(): void {
    this.localService.listar().subscribe({
      next: (locais) => this.locais.set(locais),
      error: (erro) => {
        this.mensagem.set(mensagemErro(erro, 'Não foi possível carregar os locais.'));
      },
    });
  }

  enviar(): void {
    if (
      !this.titulo.trim() ||
      !this.data ||
      !this.descricao.trim() ||
      !this.contato.trim() ||
      this.idLocal === null
    ) {
      this.mensagem.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.enviando.set(true);
    this.mensagem.set('');
    this.publicacoesService
      .cadastrar({
        idLocal: this.idLocal,
        nome: this.titulo.trim(),
        descricao: this.descricao.trim(),
        dataOcorrencia: this.formatarData(this.data),
        tipo: this.tipo,
        contato: this.contato.trim(),
      })
      .subscribe({
        next: (criada) => {
          this.enviando.set(false);
          this.router.navigate(['/inicio/detalhe', criada.idPublicacao]);
        },
        error: (erro) => {
          this.enviando.set(false);
          this.mensagem.set(mensagemErro(erro, 'Não foi possível publicar. Tente novamente.'));
        },
      });
  }

  // yyyy-MM-dd no fuso local (toISOString usaria UTC e poderia voltar um dia).
  private formatarData(d: Date): string {
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
