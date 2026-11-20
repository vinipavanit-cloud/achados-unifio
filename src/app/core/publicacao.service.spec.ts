import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from './api.config';
import { Page, Publicacao } from './models';
import { PublicacaoService } from './publicacao.service';

describe('PublicacaoService', () => {
  let service: PublicacaoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PublicacaoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('unwraps the paginated response from minhas', () => {
    const publicacoes: Publicacao[] = [
      {
        idPublicacao: 1,
        usuario: null,
        local: null,
        nome: 'Chaves',
        descricao: 'Chaves encontradas',
        dataCriacao: '2026-11-18T10:00:00',
        dataOcorrencia: '2026-11-18',
        status: 'ATIVA',
        tipo: 'ENCONTRADO',
      },
    ];

    let resultado: Publicacao[] | undefined;
    service.minhas().subscribe((lista) => (resultado = lista));

    const request = http.expectOne((req) => req.url === `${API_URL}/publicacao/minhas`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('0');
    expect(request.request.params.get('size')).toBe('1000');
    request.flush({
      content: publicacoes,
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 1000,
    });

    expect(resultado).toEqual(publicacoes);
  });

  it('sends pagination parameters and returns the paginated search result', () => {
    const resultado: Page<Publicacao> = {
      content: [],
      totalElements: 0,
      totalPages: 3,
      number: 2,
      size: 10,
    };
    let resposta: Page<Publicacao> | undefined;

    service.buscarPorNome('carteira', 2).subscribe((pagina) => (resposta = pagina));

    const request = http.expectOne((req) => req.url === `${API_URL}/publicacao/buscarPorNome`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('nome')).toBe('carteira');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('10');
    expect(request.request.params.get('sort')).toBe('nome');
    request.flush(resultado);

    expect(resposta).toEqual(resultado);
  });
});
