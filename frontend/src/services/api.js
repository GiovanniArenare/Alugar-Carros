
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function cadastrarUsuario(dados) {
  const resposta = await fetch(`${API_URL}/usuarios/cadastro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao cadastrar usuário.");
  }

  return resultado;
}

export async function fazerLogin(dados) {
  const resposta = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao realizar login.");
  }

  return resultado;
}

export async function fazerLogout() {
  const resposta = await fetch(`${API_URL}/usuarios/logout`, {
    method: "POST",
    credentials: "include"
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao sair da conta.");
  }

  return resultado;
}

export async function buscarUsuarioAtual() {
  const resposta = await fetch(`${API_URL}/usuarios/me`, {
    method: "GET",
    credentials: "include"
  });

  if (!resposta.ok) {
    throw new Error("Usuário não autenticado.");
  }

  return await resposta.json();
}
