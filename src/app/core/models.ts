export type TipoPublicacao = 'PERDIDO' | 'ENCONTRADO';
export type StatusPublicacao = 'ATIVA' | 'FINALIZADA' | 'CANCELADA';

export interface Local {
  idLocal: number;
  nome: string;
}

export interface UsuarioResumo {
  idUsuario: number;
  nome: string;
  permissao: string;
}

export interface Publicacao {
  idPublicacao: number;
  usuario: UsuarioResumo | null;
  local: Local | null;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataOcorrencia: string;
  status: StatusPublicacao;
  tipo: TipoPublicacao;
  contatos?: PublicacaoContato[];
}

export interface PublicacaoRequest {
  idLocal: number;
  nome: string;
  descricao: string;
  dataOcorrencia: string; // yyyy-MM-dd
  tipo: TipoPublicacao;
  status?: StatusPublicacao;
  idsContatos: number[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UsuarioLogado {
  idUsuario?: number;
  nome: string;
  email: string;
  permissao?: string;
}

export interface Contato {
  idContato: number;
  usuario: UsuarioResumo | null;
  contato: string;
}

export interface PublicacaoContato {
  idPublicacao: number;
  idContato: number;
  contato: string;
}

export interface Dashboard {
  usuariosCadastrados: number;
  publicacoesAtivas: number;
  publicacoesFinalizadas: number;
  perdidos: number;
  encontrados: number;
}

export interface Kpis {
  total: number;
  ativas: number;
  finalizadas: number;
  perdidos: number;
  encontrados: number;
  minhas: number;
}
