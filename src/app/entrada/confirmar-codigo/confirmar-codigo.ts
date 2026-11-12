import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-codigo',
  standalone: false,
  templateUrl: './confirmar-codigo.html',
  styleUrl: './confirmar-codigo.scss',
})
export class ConfirmarCodigo {
  @ViewChildren('campoCodigo') camposCodigo!: QueryList<ElementRef<HTMLInputElement>>;

  digitos: string[] = ['', '', '', '', '', ''];
  mensagem = '';
  tipoMensagem: 'erro' | 'aviso' = 'erro';

  constructor(private router: Router) {}

  aoDigitar(event: Event, indice: number): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.replace(/\D/g, '').slice(-1);
    this.digitos[indice] = valor;
    input.value = valor;
    this.mensagem = '';

    if (valor && indice < this.digitos.length - 1) {
      this.camposCodigo.get(indice + 1)?.nativeElement.focus();
    }
  }

  aoPressionar(event: KeyboardEvent, indice: number): void {
    if (event.key === 'Backspace' && !this.digitos[indice] && indice > 0) {
      this.camposCodigo.get(indice - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowLeft' && indice > 0) {
      this.camposCodigo.get(indice - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && indice < this.digitos.length - 1) {
      this.camposCodigo.get(indice + 1)?.nativeElement.focus();
    }
  }

  colarCodigo(event: ClipboardEvent): void {
    const texto = event.clipboardData?.getData('text') ?? '';
    const codigo = texto.replace(/\D/g, '').slice(0, 6);
    if (!codigo) return;

    event.preventDefault();
    this.digitos = Array.from({ length: 6 }, (_, i) => codigo[i] ?? '');
    const proximoCampo = Math.min(codigo.length, 5);
    setTimeout(() => this.camposCodigo.get(proximoCampo)?.nativeElement.focus());
  }

  confirmar(): void {
    const codigo = this.digitos.join('');
    if (codigo.length !== 6) {
      this.tipoMensagem = 'erro';
      this.mensagem = 'Digite os 6 números do código recebido.';
      return;
    }

    // Avança no protótipo; a validação real do código será conectada à API quando o endpoint existir.
    this.router.navigate(['/entrada/nova-senha']);
  }

  reenviar(): void {
    this.tipoMensagem = 'aviso';
    this.mensagem = 'O reenvio do código ainda depende da API de recuperação de senha.';
  }

  voltar(): void {
    this.router.navigate(['/entrada/recuperar-senha']);
  }
}
