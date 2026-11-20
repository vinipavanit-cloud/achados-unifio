import { isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

const BACKEND_URL =
  'https://expert-chainsaw-gx59x9x9v7pwh964q-8080.app.github.dev';

export const API_URL = isDevMode() ? '/backend' : BACKEND_URL;

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
