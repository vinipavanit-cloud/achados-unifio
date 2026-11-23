import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import { Contato } from './models';

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private http = inject(HttpClient);
  private base = `${API_URL}/contato`;

  listar(): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${this.base}/listarTodos`);
  }

  buscarPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.base}/${id}`);
  }

  cadastrar(contato: string): Observable<Contato> {
    return this.http.post<Contato>(this.base, { contato });
  }

  atualizar(id: number, contato: string): Observable<Contato> {
    return this.http.put<Contato>(`${this.base}/${id}`, { contato });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
