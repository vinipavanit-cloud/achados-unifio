import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { API_URL } from './api.config';
import { Local } from './models';

// Mesmos locais do import.sql do backend (mesma ordem, logo mesmos ids).
// Usados só enquanto o GET /local não existir.
const LOCAIS_PADRAO: Local[] = [
  'Bloco 1', 'Bloco 2', 'Bloco 3', 'Bloco 4', 'Bloco 5', 'Bloco 6', 'Bloco 7',
  'Veterinária', 'Cantina da Unifio', 'Cantina Giovanelli', 'Fonte', 'Outro',
].map((nome, i) => ({ idLocal: i + 1, nome }));

@Injectable({ providedIn: 'root' })
export class LocalService {
  private http = inject(HttpClient);

  listar(): Observable<Local[]> {
    return this.http.get<Local[]>(`${API_URL}/local`).pipe(catchError(() => of(LOCAIS_PADRAO)));
  }
}
