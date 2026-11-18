import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from './api.config';
import { Kpis, Page, Publicacao, PublicacaoRequest } from './models';

@Injectable({ providedIn: 'root' })
export class PublicacaoService {
  private http = inject(HttpClient);
  private base = `${API_URL}/publicacao`;

  // Traz as publicações mais recentes primeiro. Com poucos dados, uma página grande basta;
  // quando o backend tiver /publicacao/buscar e /minhas, trocar por elas.
  listarTodas(): Observable<Publicacao[]> {
    const params = new HttpParams().set('page', 0).set('size', 1000).set('sort', 'idPublicacao,desc');
    return this.http
      .get<Page<Publicacao>>(`${this.base}/listarTodos`, { params })
      .pipe(map((pagina) => pagina.content));
  }

  buscarPorId(id: number): Observable<Publicacao> {
    return this.http.get<Publicacao>(`${this.base}/${id}`);
  }

  cadastrar(dados: PublicacaoRequest): Observable<Publicacao> {
    return this.http.post<Publicacao>(this.base, dados);
  }

  // PUT e DELETE ainda precisam ser criados no backend.
  atualizar(id: number, dados: PublicacaoRequest): Observable<Publicacao> {
    return this.http.put<Publicacao>(`${this.base}/${id}`, dados);
  }

  excluir(id: number): Observable<string> {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' });
  }
}

// KPIs do dashboard, calculados a partir das publicações carregadas.
export function calcularKpis(lista: Publicacao[], idUsuario?: number): Kpis {
  return {
    total: lista.length,
    ativas: lista.filter((p) => p.status === 'ATIVA').length,
    finalizadas: lista.filter((p) => p.status === 'FINALIZADA').length,
    perdidos: lista.filter((p) => p.tipo === 'PERDIDO').length,
    encontrados: lista.filter((p) => p.tipo === 'ENCONTRADO').length,
    minhas:
      idUsuario === undefined ? 0 : lista.filter((p) => p.usuario?.idUsuario === idUsuario).length,
  };
}
