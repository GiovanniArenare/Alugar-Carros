import { useCallback, useEffect, useState } from "react";
import { buscarUsuarioAtual } from "../services/api";
import * as agenteApi from "../services/agenteApi";

/**
 * Estado e ações do painel do agente (frota, solicitações, bancos e empresas).
 * Os avisos ao usuário são delegados a notificarSucesso/notificarErro.
 */
export default function useAgente({ notificarSucesso, notificarErro }) {
  const [usuario, setUsuario] = useState(null);
  const [pendentes, setPendentes] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [recusadas, setRecusadas] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSolicitacoes = useCallback(async () => {
    const [p, a, r] = await Promise.all([
      agenteApi.listarSolicitacoes("pendentes"),
      agenteApi.listarSolicitacoes("aprovadas"),
      agenteApi.listarSolicitacoes("recusadas")
    ]);

    setPendentes(p);
    setAprovadas(a);
    setRecusadas(r);
  }, []);

  const carregarAutomoveis = useCallback(async () => {
    setAutomoveis(await agenteApi.listarAutomoveis());
  }, []);

  const carregarBancos = useCallback(async () => {
    setBancos(await agenteApi.listarBancos());
  }, []);

  const carregarEmpresas = useCallback(async () => {
    setEmpresas(await agenteApi.listarEmpresas());
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dadosUsuario = await buscarUsuarioAtual();

        if (ativo) setUsuario(dadosUsuario);

        await Promise.all([
          carregarSolicitacoes(),
          carregarAutomoveis(),
          carregarBancos(),
          carregarEmpresas()
        ]);
      } catch (error) {
        if (ativo) notificarErro(error.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
    // O carregamento inicial roda apenas uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Executa uma ação, recarrega os dados afetados e avisa o resultado.
  async function executar(acao, recarregar, textoSucesso) {
    try {
      await acao();
      await recarregar();
      notificarSucesso(textoSucesso);
      return true;
    } catch (error) {
      notificarErro(error.message);
      return false;
    }
  }

  function salvarAutomovel(dados, automovelEmEdicao) {
    return executar(
      () => agenteApi.salvarAutomovel(dados, automovelEmEdicao),
      carregarAutomoveis,
      automovelEmEdicao
        ? "Automóvel atualizado com sucesso!"
        : "Automóvel cadastrado com sucesso!"
    );
  }

  function excluirAutomovel(id) {
    return executar(
      () => agenteApi.excluirAutomovel(id),
      carregarAutomoveis,
      "Automóvel excluído com sucesso!"
    );
  }

  async function avaliarSolicitacao(id, status, parecer) {
    if (!parecer || !parecer.trim()) {
      notificarErro("Informe o parecer financeiro antes de avaliar.");
      return false;
    }

    return executar(
      () => agenteApi.avaliarSolicitacao(id, status, parecer),
      carregarSolicitacoes,
      `Solicitação ${id} ${
        status === "APROVADA" ? "aprovada" : "recusada"
      } com sucesso!`
    );
  }

  function cadastrarBanco(dados) {
    return executar(
      () => agenteApi.cadastrarBanco(dados),
      carregarBancos,
      "Banco cadastrado com sucesso!"
    );
  }

  function cadastrarEmpresa(dados) {
    return executar(
      () => agenteApi.cadastrarEmpresa(dados),
      carregarEmpresas,
      "Empresa cadastrada com sucesso!"
    );
  }

  return {
    usuario,
    pendentes,
    aprovadas,
    recusadas,
    automoveis,
    bancos,
    empresas,
    carregando,
    salvarAutomovel,
    excluirAutomovel,
    avaliarSolicitacao,
    cadastrarBanco,
    cadastrarEmpresa
  };
}
