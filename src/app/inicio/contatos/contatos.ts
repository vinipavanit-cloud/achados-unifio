import { Component, OnInit, inject, signal } from '@angular/core';
import { mensagemErro } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';
import { ContatoService } from '../../core/contato.service';
import { Contato } from '../../core/models';

@Component({
  selector: 'app-contatos',
  standalone: false,
  templateUrl: './contatos.html',
  styleUrl: './contatos.scss',
})
export class Contatos implements OnInit {
  private contatoService = inject(ContatoService);
  protected auth = inject(AuthService);

  contatos = signal<Contato[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  mensagem = signal('');
  novoContato = '';
  editandoId: number | null = null;
  contatoEdicao = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.contatoService.listar().subscribe({
      next: (contatos) => {
        this.contatos.set(contatos);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.mensagem.set(mensagemErro(erro, 'Não foi possível carregar seus contatos.'));
        this.carregando.set(false);
      },
    });
  }

  cadastrar(): void {
    const contato = this.novoContato.trim();
    if (!contato) return;
    this.salvando.set(true);
    this.mensagem.set('');
    this.contatoService.cadastrar(contato).subscribe({
      next: () => {
        this.novoContato = '';
        this.salvando.set(false);
        this.mensagem.set('Contato cadastrado.');
        this.carregar();
      },
      error: (erro) => {
        this.salvando.set(false);
        this.mensagem.set(mensagemErro(erro, 'Não foi possível cadastrar o contato.'));
      },
    });
  }

  editar(contato: Contato): void {
    this.editandoId = contato.idContato;
    this.contatoEdicao = contato.contato;
  }

  salvar(contato: Contato): void {
    const valor = this.contatoEdicao.trim();
    if (!valor) return;
    this.contatoService.atualizar(contato.idContato, valor).subscribe({
      next: () => {
        this.editandoId = null;
        this.mensagem.set('Contato atualizado.');
        this.carregar();
      },
      error: (erro) => this.mensagem.set(mensagemErro(erro, 'Não foi possível atualizar o contato.')),
    });
  }

  excluir(contato: Contato): void {
    if (!window.confirm(`Excluir o contato "${contato.contato}"?`)) return;
    this.contatoService.excluir(contato.idContato).subscribe({
      next: () => {
        this.mensagem.set('Contato excluído.');
        this.carregar();
      },
      error: (erro) => this.mensagem.set(mensagemErro(erro, 'Não foi possível excluir o contato.')),
    });
  }
}
