import { HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { API_URL } from './api.config';
import {
  Contato,
  Dashboard,
  Local,
  Page,
  Publicacao,
  PublicacaoContato,
  PublicacaoRequest,
  StatusPublicacao,
  TipoPublicacao,
  UsuarioLogado,
  UsuarioResumo,
} from './models';

export const CHAVE_DADOS_VISITANTE = 'achados.visitante.dados';
export const ID_VISITANTE = 1;

interface UsuarioMock extends UsuarioResumo {
  email: string;
}

interface ContatoMock {
  idContato: number;
  idUsuario: number;
  contato: string;
}

interface PublicacaoMock {
  idPublicacao: number;
  idUsuario: number;
  idLocal: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataOcorrencia: string;
  status: StatusPublicacao;
  tipo: TipoPublicacao;
  idsContatos: number[];
}

interface EstadoMock {
  usuarios: UsuarioMock[];
  contatos: ContatoMock[];
  publicacoes: PublicacaoMock[];
  proximoIdPublicacao: number;
  proximoIdContato: number;
}

class ErroMock {
  constructor(
    readonly status: number,
    readonly mensagem: string,
  ) {}
}

const LOCAIS: Local[] = [
  'Bloco 1',
  'Bloco 2',
  'Bloco 3',
  'Bloco 4',
  'Bloco 5',
  'Bloco 6',
  'Bloco 7',
  'Veterinária',
  'Cantina da Unifio',
  'Cantina Giovanelli',
  'Fonte',
  'Outro',
].map((nome, i) => ({ idLocal: i + 1, nome }));

function diasAtras(dias: number, hora = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, 0, 0, 0);
  return d;
}

function somenteData(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function estadoInicial(): EstadoMock {
  const pub = (
    idPublicacao: number,
    idUsuario: number,
    idLocal: number,
    nome: string,
    descricao: string,
    dias: number,
    status: StatusPublicacao,
    tipo: TipoPublicacao,
    idsContatos: number[],
  ): PublicacaoMock => ({
    idPublicacao,
    idUsuario,
    idLocal,
    nome,
    descricao,
    dataCriacao: diasAtras(dias, 14).toISOString(),
    dataOcorrencia: somenteData(diasAtras(dias + 1)),
    status,
    tipo,
    idsContatos,
  });

  return {
    usuarios: [
      { idUsuario: 1, nome: 'Visitante', email: 'visitante@unifio.edu.br', permissao: 'ADMIN' },
      { idUsuario: 2, nome: 'Maria Souza', email: 'maria.souza@unifio.edu.br', permissao: 'USUARIO' },
      { idUsuario: 3, nome: 'João Lima', email: 'joao.lima@unifio.edu.br', permissao: 'USUARIO' },
    ],
    contatos: [
      { idContato: 1, idUsuario: 1, contato: 'visitante@unifio.edu.br' },
      { idContato: 2, idUsuario: 1, contato: '(14) 99999-0000' },
      { idContato: 3, idUsuario: 2, contato: 'maria.souza@unifio.edu.br' },
      { idContato: 4, idUsuario: 2, contato: 'Instagram @maria.souza' },
      { idContato: 5, idUsuario: 3, contato: 'joao.lima@unifio.edu.br' },
    ],
    publicacoes: [
      pub(1, 2, 2, 'Carteira preta de couro', 'Perdida perto da escada do Bloco 2. Tem documentos dentro.', 1, 'ATIVA', 'PERDIDO', [3, 4]),
      pub(2, 3, 9, 'Garrafa térmica azul', 'Encontrada em cima de uma mesa da cantina da Unifio.', 2, 'ATIVA', 'ENCONTRADO', [5]),
      pub(3, 1, 1, 'Chaves com chaveiro de gato', 'Perdi as chaves de casa no Bloco 1, chaveiro de gato cinza.', 3, 'ATIVA', 'PERDIDO', [1, 2]),
      pub(4, 2, 11, 'Fones de ouvido branco', 'Encontrados perto da fonte, estão com a secretaria.', 5, 'FINALIZADA', 'ENCONTRADO', [3]),
      pub(5, 3, 5, 'Calculadora científica', 'Esqueci em uma sala do Bloco 5 depois da prova.', 6, 'ATIVA', 'PERDIDO', [5]),
      pub(6, 1, 8, 'Jaleco com nome bordado', 'Encontrei um jaleco na Veterinária com nome bordado "Ana".', 8, 'FINALIZADA', 'ENCONTRADO', [1]),
      pub(7, 2, 12, 'Guarda-chuva preto', 'Perdido na saída principal, dia de chuva.', 10, 'CANCELADA', 'PERDIDO', [4]),
    ],
    proximoIdPublicacao: 8,
    proximoIdContato: 6,
  };
}

@Injectable({ providedIn: 'root' })
export class MockBackendService {
  private estado: EstadoMock = this.carregar() ?? estadoInicial();

  reiniciar(): void {
    this.estado = estadoInicial();
    this.salvar();
  }

  descartar(): void {
    this.estado = estadoInicial();
    try {
      sessionStorage.removeItem(CHAVE_DADOS_VISITANTE);
    } catch {
    }
  }

  usuarioVisitante(): UsuarioLogado {
    const u = this.usuario(ID_VISITANTE);
    return { idUsuario: u.idUsuario, nome: u.nome, email: u.email, permissao: u.permissao };
  }

  tratar(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    try {
      const caminho = req.url.slice(API_URL.length).split('?')[0].replace(/\/+$/, '');
      const resposta = this.rotear(req, caminho);
      return of(resposta as HttpEvent<unknown>).pipe(delay(120));
    } catch (e) {
      const erro = e instanceof ErroMock ? e : new ErroMock(500, 'Erro no modo visitante.');
      return throwError(
        () =>
          new HttpErrorResponse({
            status: erro.status,
            statusText: erro.mensagem,
            url: req.url,
            error: { mensagem: erro.mensagem },
          }),
      ).pipe(delay(120));
    }
  }

  private rotear(req: HttpRequest<unknown>, caminho: string): HttpResponse<unknown> {
    const metodo = req.method;
    let m: RegExpMatchArray | null;

    if (metodo === 'GET' && caminho === '/usuario/autenticacao/csrf') {
      return this.ok({ token: 'modo-visitante', headerName: 'X-CSRF-TOKEN', parameterName: '_csrf' });
    }
    if (metodo === 'POST' && caminho === '/logout') return this.semConteudo();
    if (metodo === 'GET' && caminho === '/usuario/me') {
      return this.ok(this.usuarioVisitante());
    }
    if (metodo === 'GET' && caminho === '/local/listarTodos') return this.ok(LOCAIS);
    if (metodo === 'GET' && caminho === '/dashboard') return this.ok(this.dashboard());

    if (metodo === 'GET' && caminho === '/publicacao/listarTodos') {
      return this.ok(this.paginar(this.publicacoes(), req));
    }
    if (metodo === 'GET' && caminho === '/publicacao/minhas') {
      const minhas = this.publicacoes().filter((p) => p.usuario?.idUsuario === ID_VISITANTE);
      return this.ok(this.paginar(minhas, req));
    }
    if (metodo === 'GET' && caminho === '/publicacao/buscarPorNome') {
      const nome = (req.params.get('nome') ?? '').trim().toLowerCase();
      if (!nome) throw new ErroMock(404, 'Nenhuma publicação encontrada com esse nome');
      const achadas = this.publicacoes().filter((p) => p.nome.toLowerCase().includes(nome));
      return this.ok(this.paginar(achadas, req));
    }
    if (metodo === 'POST' && caminho === '/publicacao') {
      return this.ok(this.criarPublicacao(req.body as PublicacaoRequest), 201);
    }
    if ((m = caminho.match(/^\/publicacao\/(\d+)\/contatos$/)) && metodo === 'GET') {
      return this.ok(this.contatosDaPublicacao(this.buscarPublicacao(Number(m[1]))));
    }
    if ((m = caminho.match(/^\/publicacao\/(\d+)$/))) {
      const id = Number(m[1]);
      if (metodo === 'GET') return this.ok(this.paraPublicacao(this.buscarPublicacao(id)));
      if (metodo === 'PUT') {
        return this.ok(this.atualizarPublicacao(id, req.body as PublicacaoRequest));
      }
      if (metodo === 'DELETE') {
        this.excluirPublicacao(id);
        return this.ok('Publicação deletada com sucesso!');
      }
    }

    if (metodo === 'GET' && caminho === '/contato/listarTodos') {
      return this.ok(this.contatosDoVisitante().map((c) => this.paraContato(c)));
    }
    if (metodo === 'POST' && caminho === '/contato') {
      return this.ok(this.criarContato(this.textoContato(req.body)), 201);
    }
    if ((m = caminho.match(/^\/contato\/(\d+)$/))) {
      const id = Number(m[1]);
      if (metodo === 'GET') return this.ok(this.paraContato(this.buscarContato(id)));
      if (metodo === 'PUT') return this.ok(this.editarContato(id, this.textoContato(req.body)));
      if (metodo === 'DELETE') {
        this.excluirContato(id);
        return this.semConteudo();
      }
    }

    throw new ErroMock(404, 'Esta função não está disponível no modo visitante.');
  }

  private publicacoes(): Publicacao[] {
    return [...this.estado.publicacoes]
      .sort((a, b) => b.idPublicacao - a.idPublicacao)
      .map((p) => this.paraPublicacao(p));
  }

  private buscarPublicacao(id: number): PublicacaoMock {
    const p = this.estado.publicacoes.find((x) => x.idPublicacao === id);
    if (!p) throw new ErroMock(404, 'Erro! Publicação não existe!');
    return p;
  }

  private criarPublicacao(dados: PublicacaoRequest): Publicacao {
    this.validarPublicacao(dados);
    const contatos = this.validarContatos(dados.idsContatos, ID_VISITANTE);
    const nova: PublicacaoMock = {
      idPublicacao: this.estado.proximoIdPublicacao++,
      idUsuario: ID_VISITANTE,
      idLocal: dados.idLocal,
      nome: dados.nome.trim(),
      descricao: dados.descricao.trim(),
      dataCriacao: new Date().toISOString(),
      dataOcorrencia: String(dados.dataOcorrencia).slice(0, 10),
      status: 'ATIVA',
      tipo: dados.tipo ?? 'PERDIDO',
      idsContatos: contatos.map((c) => c.idContato),
    };
    this.estado.publicacoes.push(nova);
    this.salvar();
    return this.paraPublicacao(nova);
  }

  private atualizarPublicacao(id: number, dados: PublicacaoRequest): Publicacao {
    const p = this.buscarPublicacao(id);
    this.validarPublicacao(dados);
    const contatos = this.validarContatos(dados.idsContatos, p.idUsuario);
    p.idLocal = dados.idLocal;
    p.nome = dados.nome.trim();
    p.descricao = dados.descricao.trim();
    p.dataOcorrencia = String(dados.dataOcorrencia).slice(0, 10);
    p.status = dados.status ?? p.status;
    p.tipo = dados.tipo ?? p.tipo;
    p.idsContatos = contatos.map((c) => c.idContato);
    this.salvar();
    return this.paraPublicacao(p);
  }

  private excluirPublicacao(id: number): void {
    this.buscarPublicacao(id);
    this.estado.publicacoes = this.estado.publicacoes.filter((p) => p.idPublicacao !== id);
    this.salvar();
  }

  private validarPublicacao(d: PublicacaoRequest): void {
    if (!d || d.idLocal == null) throw new ErroMock(400, 'idLocal não pode ser nulo!');
    if (!LOCAIS.some((l) => l.idLocal === d.idLocal)) {
      throw new ErroMock(404, 'Erro! Local não existente');
    }
    if (!d.nome?.trim()) throw new ErroMock(400, 'Nome não pode ser vazio');
    if (!d.descricao?.trim()) throw new ErroMock(400, 'Descrição não pode ser vazio');
    if (!d.dataOcorrencia) throw new ErroMock(400, 'Data da ocorrência não pode ser nula!');
  }

  private validarContatos(ids: number[] | undefined, idDono: number): ContatoMock[] {
    if (!ids) throw new ErroMock(400, 'A lista de contatos não pode ser nula');
    if (ids.length === 0) throw new ErroMock(400, 'Informe ao menos um contato para a publicação');
    if (new Set(ids).size !== ids.length) {
      throw new ErroMock(400, 'A lista contém contatos duplicados');
    }
    const contatos = ids.map((id) =>
      this.estado.contatos.find((c) => c.idContato === id && c.idUsuario === idDono),
    );
    if (contatos.some((c) => !c)) {
      throw new ErroMock(400, 'Um ou mais contatos não pertencem ao usuário da publicação');
    }
    return contatos as ContatoMock[];
  }

  private contatosDaPublicacao(p: PublicacaoMock): PublicacaoContato[] {
    return p.idsContatos
      .map((id) => this.estado.contatos.find((c) => c.idContato === id))
      .filter((c): c is ContatoMock => !!c)
      .map((c) => ({ idPublicacao: p.idPublicacao, idContato: c.idContato, contato: c.contato }));
  }

  private paraPublicacao(p: PublicacaoMock): Publicacao {
    return {
      idPublicacao: p.idPublicacao,
      usuario: this.resumo(p.idUsuario),
      local: LOCAIS.find((l) => l.idLocal === p.idLocal) ?? null,
      nome: p.nome,
      descricao: p.descricao,
      dataCriacao: p.dataCriacao,
      dataOcorrencia: p.dataOcorrencia,
      status: p.status,
      tipo: p.tipo,
      contatos: this.contatosDaPublicacao(p),
    };
  }

  private contatosDoVisitante(): ContatoMock[] {
    return this.estado.contatos.filter((c) => c.idUsuario === ID_VISITANTE);
  }

  private buscarContato(id: number): ContatoMock {
    const c = this.estado.contatos.find((x) => x.idContato === id);
    if (!c) throw new ErroMock(404, 'Contato inexistente');
    if (c.idUsuario !== ID_VISITANTE) {
      throw new ErroMock(403, 'Você não tem permissão para visualizar esse contato');
    }
    return c;
  }

  private textoContato(corpo: unknown): string {
    const texto = ((corpo as { contato?: string } | null)?.contato ?? '').trim();
    if (!texto) throw new ErroMock(400, 'O contato não pode estar vazio!');
    return texto;
  }

  private criarContato(texto: string): Contato {
    if (this.contatosDoVisitante().length >= 3) {
      throw new ErroMock(409, 'ERRO! Não são permitidos mais de 3 contatos por usuário');
    }
    const novo: ContatoMock = {
      idContato: this.estado.proximoIdContato++,
      idUsuario: ID_VISITANTE,
      contato: texto,
    };
    this.estado.contatos.push(novo);
    this.salvar();
    return this.paraContato(novo);
  }

  private editarContato(id: number, texto: string): Contato {
    const c = this.buscarContato(id);
    c.contato = texto;
    this.salvar();
    return this.paraContato(c);
  }

  private excluirContato(id: number): void {
    const c = this.buscarContato(id);
    const unicoEmAlguma = this.estado.publicacoes.some(
      (p) => p.idsContatos.length === 1 && p.idsContatos[0] === id,
    );
    if (unicoEmAlguma) {
      throw new ErroMock(
        409,
        'O contato é o único disponibilizado em uma ou mais publicações. Edite as publicações antes de excluí-lo.',
      );
    }
    this.estado.contatos = this.estado.contatos.filter((x) => x.idContato !== c.idContato);
    this.estado.publicacoes.forEach((p) => {
      p.idsContatos = p.idsContatos.filter((x) => x !== id);
    });
    this.salvar();
  }

  private paraContato(c: ContatoMock): Contato {
    return { idContato: c.idContato, usuario: this.resumo(c.idUsuario), contato: c.contato };
  }

  private dashboard(): Dashboard {
    const ps = this.estado.publicacoes;
    return {
      usuariosCadastrados: this.estado.usuarios.length,
      publicacoesAtivas: ps.filter((p) => p.status === 'ATIVA').length,
      publicacoesFinalizadas: ps.filter((p) => p.status === 'FINALIZADA').length,
      perdidos: ps.filter((p) => p.tipo === 'PERDIDO').length,
      encontrados: ps.filter((p) => p.tipo === 'ENCONTRADO').length,
    };
  }

  private usuario(id: number): UsuarioMock {
    return this.estado.usuarios.find((u) => u.idUsuario === id) ?? this.estado.usuarios[0];
  }

  private resumo(id: number): UsuarioResumo {
    const u = this.usuario(id);
    return { idUsuario: u.idUsuario, nome: u.nome, permissao: u.permissao ?? 'USUARIO' };
  }

  private paginar(itens: Publicacao[], req: HttpRequest<unknown>): Page<Publicacao> {
    const size = Math.max(1, Number(req.params.get('size') ?? 10));
    const page = Math.max(0, Number(req.params.get('page') ?? 0));
    const [campo, sentido] = (req.params.get('sort') ?? '').split(',');

    let ordenados = itens;
    if (campo === 'nome') {
      ordenados = [...itens].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      if (sentido === 'desc') ordenados.reverse();
    }

    return {
      content: ordenados.slice(page * size, page * size + size),
      totalElements: ordenados.length,
      totalPages: Math.max(1, Math.ceil(ordenados.length / size)),
      number: page,
      size,
    };
  }

  private ok(corpo: unknown, status = 200): HttpResponse<unknown> {
    return new HttpResponse({ status, body: corpo });
  }

  private semConteudo(): HttpResponse<unknown> {
    return new HttpResponse({ status: 204, body: null });
  }

  private salvar(): void {
    try {
      sessionStorage.setItem(CHAVE_DADOS_VISITANTE, JSON.stringify(this.estado));
    } catch {
    }
  }

  private carregar(): EstadoMock | null {
    try {
      const bruto = sessionStorage.getItem(CHAVE_DADOS_VISITANTE);
      return bruto ? (JSON.parse(bruto) as EstadoMock) : null;
    } catch {
      return null;
    }
  }
}
