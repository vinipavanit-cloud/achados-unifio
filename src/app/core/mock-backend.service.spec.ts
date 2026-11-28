import { HttpErrorResponse, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { API_URL } from './api.config';
import { MockBackendService } from './mock-backend.service';
import { Contato, Dashboard, Page, Publicacao } from './models';

describe('MockBackendService (modo visitante)', () => {
  let mock: MockBackendService;

  beforeEach(() => {
    sessionStorage.clear();
    mock = new MockBackendService();
    mock.reiniciar();
  });

  function chamar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<HttpResponse<T>> {
    const req = new HttpRequest(metodo as 'GET', `${API_URL}${caminho}`, corpo ?? null);
    return new Promise((resolve, reject) =>
      mock.tratar(req).subscribe({
        next: (r) => resolve(r as HttpResponse<T>),
        error: (e: HttpErrorResponse) => reject(e),
      }),
    );
  }

  const nova = (extra: object = {}) => ({
    idLocal: 1,
    nome: 'Estojo',
    descricao: 'Estojo azul',
    dataOcorrencia: '2026-11-20',
    tipo: 'ENCONTRADO',
    idsContatos: [1],
    ...extra,
  });

  it('lista as publicações de exemplo, da mais nova para a mais antiga', async () => {
    const r = await chamar<Page<Publicacao>>('GET', '/publicacao/listarTodos');
    const ids = r.body!.content.map((p) => p.idPublicacao);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
    expect(r.body!.totalElements).toBeGreaterThan(0);
  });

  it('cria uma publicação respeitando o tipo informado', async () => {
    const r = await chamar<Publicacao>('POST', '/publicacao', nova());
    expect(r.status).toBe(201);
    expect(r.body!.tipo).toBe('ENCONTRADO');
    expect(r.body!.status).toBe('ATIVA');
    expect(r.body!.contatos!.length).toBe(1);
  });

  it('exige ao menos um contato e só aceita contatos do próprio usuário', async () => {
    await expect(chamar('POST', '/publicacao', nova({ idsContatos: [] }))).rejects.toMatchObject({
      status: 400,
    });
    await expect(chamar('POST', '/publicacao', nova({ idsContatos: [3] }))).rejects.toMatchObject({
      status: 400,
    });
  });

  it('atualiza e exclui uma publicação', async () => {
    const criada = await chamar<Publicacao>('POST', '/publicacao', nova());
    const id = criada.body!.idPublicacao;
    const att = await chamar<Publicacao>('PUT', `/publicacao/${id}`, nova({ nome: 'Novo nome', status: 'FINALIZADA' }));
    expect(att.body!.nome).toBe('Novo nome');
    expect(att.body!.status).toBe('FINALIZADA');
    await chamar('DELETE', `/publicacao/${id}`);
    await expect(chamar('GET', `/publicacao/${id}`)).rejects.toMatchObject({ status: 404 });
  });

  it('limita a 3 contatos por usuário', async () => {
    await chamar('POST', '/contato', { contato: 'terceiro@unifio.edu.br' });
    await expect(chamar('POST', '/contato', { contato: 'quarto' })).rejects.toMatchObject({
      status: 409,
    });
  });

  it('não exclui o único contato de uma publicação', async () => {
    await expect(chamar('DELETE', '/contato/1')).rejects.toMatchObject({ status: 409 });
  });

  it('só devolve os contatos do visitante', async () => {
    const r = await chamar<Contato[]>('GET', '/contato/listarTodos');
    expect(r.body!.every((c) => c.usuario?.idUsuario === 1)).toBe(true);
  });

  it('calcula os indicadores do dashboard', async () => {
    const r = await chamar<Dashboard>('GET', '/dashboard');
    const todas = await chamar<Page<Publicacao>>('GET', '/publicacao/listarTodos');
    expect(r.body!.perdidos + r.body!.encontrados).toBe(todas.body!.totalElements);
    expect(r.body!.usuariosCadastrados).toBe(3);
  });

  it('mantém os dados na sessão e os descarta ao sair', async () => {
    await chamar('POST', '/publicacao', nova({ nome: 'Persistida' }));
    const recarregado = new MockBackendService();
    const r = await new Promise<HttpResponse<Page<Publicacao>>>((resolve) =>
      recarregado
        .tratar(
          new HttpRequest('GET', `${API_URL}/publicacao/buscarPorNome`, {
            params: new HttpParams().set('nome', 'Persistida'),
          }),
        )
        .subscribe((x) => resolve(x as HttpResponse<Page<Publicacao>>)),
    );
    expect(r.body!.totalElements).toBe(1);

    mock.descartar();
    expect(sessionStorage.getItem('achados.visitante.dados')).toBeNull();
  });
});
