import { API_URL } from "./api";

/**
 * Requisição JSON para a API (sempre com cookies de sessão).
 * Lança Error com a mensagem do backend ({ erro }) quando a resposta falha.
 */
export async function requisicao(caminho, opcoes = {}, mensagemPadrao) {
  const { body, headers, ...restante } = opcoes;

  const resposta = await fetch(`${API_URL}${caminho}`, {
    credentials: "include",
    ...restante,
    headers: body ? { "Content-Type": "application/json", ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined
  });

  // Respostas sem corpo JSON (ex.: 204) resultam em null.
  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erro = new Error(
      corpo?.erro || mensagemPadrao || "Não foi possível concluir a operação."
    );

    erro.status = resposta.status;
    throw erro;
  }

  return corpo;
}
