import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from './api.config';
import { Dashboard, Page, Publicacao, PublicacaoContato, PublicacaoRequest } from './models';

@Injectable({ providedIn: 'root' })
export class PublicacaoService {
  private http = inject(HttpClient);
  private base = `${API_URL}/publicacao`;

  // Traz as publicações mais recentes primeiro.
  listarTodas(): Observable<Publicacao[]> {
    const params = new HttpParams().set('page', 0).set('size', 1000).set('sort', 'idPublicacao,desc');
    return this.http
      .get<Page<Publicacao>>(`${this.base}/listarTodos`, { params })
      .pipe(map((pagina) => pagina.content));
  }

  buscarPorNome(nome: string, page = 0): Observable<Page<Publicacao>> {
    const params = new HttpParams()
      .set('nome', nome)
      .set('page', page)
      .set('size', 10)
      .set('sort', 'nome');
    return this.http.get<Page<Publicacao>>(`${this.base}/buscarPorNome`, { params });
  }

  minhas(): Observable<Publicacao[]> {
    const params = new HttpParams().set('page', 0).set('size', 1000).set('sort', 'idPublicacao,desc');
    return this.http
      .get<Page<Publicacao>>(`${this.base}/minhas`, { params })
      .pipe(map((pagina) => pagina.content));
  }

  buscarPorId(id: number): Observable<Publicacao> {
    return this.http.get<Publicacao>(`${this.base}/${id}`);
  }

  listarContatos(idPublicacao: number): Observable<PublicacaoContato[]> {
    return this.http.get<PublicacaoContato[]>(`${this.base}/${idPublicacao}/contatos`);
  }

  cadastrar(dados: PublicacaoRequest): Observable<Publicacao> {
    return this.http.post<Publicacao>(this.base, dados);
  }

  atualizar(id: number, dados: PublicacaoRequest): Observable<Publicacao> {
    return this.http.put<Publicacao>(`${this.base}/${id}`, dados);
  }

  excluir(id: number): Observable<string> {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' });
  }

  dashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${API_URL}/dashboard`);
  }
}
