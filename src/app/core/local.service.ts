import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import { Local } from './models';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private http = inject(HttpClient);

  listar(): Observable<Local[]> {
    return this.http.get<Local[]>(`${API_URL}/local/listarTodos`);
  }
}
