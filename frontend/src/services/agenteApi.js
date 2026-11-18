import { requisicao } from "./http";

export function listarSolicitacoes(tipo) {
  return requisicao(
    `/solicitacoes/${tipo}`,
    {},
    "Não foi possível carregar as solicitações."
  );
}

export function avaliarSolicitacao(id, status, parecerFinanceiro) {
  return requisicao(
    `/solicitacoes/${id}/avaliacao`,
    { method: "PUT", body: { status, parecerFinanceiro } },
    "Erro ao avaliar solicitação."
  );
}

export function listarAutomoveis() {
  return requisicao(
    "/automoveis",
    {},
    "Não foi possível carregar os automóveis."
  );
}

export function salvarAutomovel(dados, automovelEmEdicao) {
  if (automovelEmEdicao) {
    return requisicao(
      `/automoveis/${automovelEmEdicao.id}`,
      {
        method: "PUT",
        body: { ano: dados.ano, marca: dados.marca, modelo: dados.modelo }
      },
      "Erro ao editar automóvel."
    );
  }

  return requisicao(
    "/automoveis",
    { method: "POST", body: dados },
    "Erro ao cadastrar automóvel."
  );
}

export function excluirAutomovel(id) {
  return requisicao(
    `/automoveis/${id}`,
    { method: "DELETE" },
    "Erro ao excluir automóvel."
  );
}

export function listarBancos() {
  return requisicao("/bancos", {}, "Não foi possível carregar os bancos.");
}

export function cadastrarBanco(dados) {
  return requisicao(
    "/bancos",
    { method: "POST", body: dados },
    "Erro ao cadastrar banco."
  );
}

export function listarEmpresas() {
  return requisicao("/empresas", {}, "Não foi possível carregar as empresas.");
}

export function cadastrarEmpresa(dados) {
  return requisicao(
    "/empresas",
    { method: "POST", body: dados },
    "Erro ao cadastrar empresa."
  );
}

export function buscarContratoPorSolicitacao(solicitacaoId) {
  return requisicao(
    `/contratos/solicitacao/${solicitacaoId}`,
    {},
    "Contrato não encontrado."
  );
}

// Retorna null quando o contrato ainda não possui crédito registrado.
export async function buscarCredito(contratoId) {
  try {
    return await requisicao(
      `/contratos-credito/contrato/${contratoId}`,
      {},
      "Não foi possível consultar o crédito."
    );
  } catch (erro) {
    if (erro.status === 404) return null;
    throw erro;
  }
}

export function criarCredito(dados) {
  return requisicao(
    "/contratos-credito",
    { method: "POST", body: dados },
    "Erro ao registrar contrato de crédito."
  );
}
