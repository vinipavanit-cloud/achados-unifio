import { HttpErrorResponse } from '@angular/common/http';

// URL base do backend. Troque pela URL publicada ao fazer o deploy.
export const API_URL = 'http://localhost:8080';

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
