import { HttpErrorResponse } from '@angular/common/http';

export const API_URL = '/backend';

export function mensagemErro(erro: unknown, padrao: string): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) return 'Não foi possível conectar ao servidor. Tente novamente.';
    const corpo = erro.error;
    if (corpo && typeof corpo === 'object' && typeof corpo.mensagem === 'string') {
      return corpo.mensagem;
    }
  }
  return padrao;
}
