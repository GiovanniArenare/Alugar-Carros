
import { useEffect, useState } from "react";
import { buscarUsuarioAtual, API_URL } from "../services/api";

import Navbar from "../components/Navbar";
import Notificacao from "../components/Notificacao";

import NavegacaoCliente from "../components/NavegacaoCliente";
import AutomoveisCliente from "../components/AutomoveisCliente";
import ModalAluguel from "../components/ModalAluguel";
import SolicitacaoCliente from "../components/SolicitacaoCliente";

import "../components/Notificacao.css";
import "./Cliente.css";

function Cliente() {
  const [usuario, setUsuario] = useState(null);
  const [automoveis, setAutomoveis] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [areaAtiva, setAreaAtiva] = useState("automoveis");
  const [modalAberto, setModalAberto] = useState(false);

  const [automovelId, setAutomovelId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [solicitacaoEdicao, setSolicitacaoEdicao] = useState(null);
  const [automovelIdEdicao, setAutomovelIdEdicao] = useState("");
  const [dataInicioEdicao, setDataInicioEdicao] = useState("");
  const [dataFimEdicao, setDataFimEdicao] = useState("");

  const [solicitacaoContrato, setSolicitacaoContrato] = useState(null);
  const [nomeContratante, setNomeContratante] = useState("");
  const [profissao, setProfissao] = useState("");
  const [rendaMensal, setRendaMensal] = useState("");
  const [contratos, setContratos] = useState({});

  function notificarErro(mensagemErro) {
    setMensagem("");
    setErro(mensagemErro);
  }

  function notificarSucesso(mensagemSucesso) {
    setErro("");
    setMensagem(mensagemSucesso);
  }

  async function carregarSolicitacoes() {
    const resposta = await fetch(`${API_URL}/solicitacoes/minhas`, {
      credentials: "include"
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar suas solicitações.");
    }

    const dados = await resposta.json();
    setSolicitacoes(dados);
  }

  async function carregarDados() {
    try {
      setCarregando(true);

      const usuarioAtual = await buscarUsuarioAtual();
      setUsuario(usuarioAtual);

      const respostaAutomoveis = await fetch(`${API_URL}/automoveis`, {
        credentials: "include"
      });

      if (!respostaAutomoveis.ok) {
        throw new Error("Não foi possível carregar os automóveis.");
      }

      const dadosAutomoveis = await respostaAutomoveis.json();
      setAutomoveis(dadosAutomoveis);

      await carregarSolicitacoes();
    } catch (error) {
      notificarErro(error.message || "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function solicitarAluguel(event) {
    event.preventDefault();

    try {
      const resposta = await fetch(`${API_URL}/solicitacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          automovelId: Number(automovelId),
          dataInicio,
          dataFim
        })
      });

      if (!resposta.ok) {
        const mensagemErro = await resposta.text();
        throw new Error(mensagemErro || "Erro ao solicitar aluguel.");
      }

      setAutomovelId("");
      setDataInicio("");
      setDataFim("");
      setModalAberto(false);

      await carregarSolicitacoes();

      notificarSucesso("Solicitação de aluguel enviada com sucesso!");
      setAreaAtiva("solicitacoes");
    } catch (error) {
      notificarErro(error.message || "Erro ao solicitar aluguel.");
    }
  }

  function iniciarEdicao(solicitacao) {
    setSolicitacaoEdicao(solicitacao.id);
    setAutomovelIdEdicao(String(solicitacao.automovelId));
    setDataInicioEdicao(solicitacao.dataInicio);
    setDataFimEdicao(solicitacao.dataFim);
  }

  function cancelarEdicao() {
    setSolicitacaoEdicao(null);
    setAutomovelIdEdicao("");
    setDataInicioEdicao("");
    setDataFimEdicao("");
  }

  async function salvarEdicao(solicitacaoId) {
    try {
      const resposta = await fetch(
        `${API_URL}/solicitacoes/${solicitacaoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            automovelId: Number(automovelIdEdicao),
            dataInicio: dataInicioEdicao,
            dataFim: dataFimEdicao
          })
        }
      );

      if (!resposta.ok) {
        const mensagemErro = await resposta.text();
        throw new Error(mensagemErro || "Erro ao atualizar solicitação.");
      }

      cancelarEdicao();
      await carregarSolicitacoes();

      notificarSucesso("Solicitação atualizada com sucesso!");
    } catch (error) {
      notificarErro(error.message || "Erro ao atualizar solicitação.");
    }
  }

  async function cancelarSolicitacao(solicitacaoId) {
    if (!window.confirm("Deseja realmente cancelar esta solicitação?")) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/solicitacoes/${solicitacaoId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (!resposta.ok) {
        const mensagemErro = await resposta.text();
        throw new Error(mensagemErro || "Erro ao cancelar solicitação.");
      }

      await carregarSolicitacoes();

      notificarSucesso("Solicitação cancelada com sucesso!");
    } catch (error) {
      notificarErro(error.message || "Erro ao cancelar solicitação.");
    }
  }

  async function gerarContrato(solicitacaoId) {
    try {
      const resposta = await fetch(`${API_URL}/contratos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          solicitacaoId,
          nomeContratante,
          profissao,
          rendaMensal: Number(rendaMensal)
        })
      });

      if (!resposta.ok) {
        const mensagemErro = await resposta.text();
        throw new Error(mensagemErro || "Erro ao gerar contrato.");
      }

      setNomeContratante("");
      setProfissao("");
      setRendaMensal("");
      setSolicitacaoContrato(null);

      await consultarContrato(solicitacaoId);

      notificarSucesso("Contrato gerado com sucesso!");
    } catch (error) {
      notificarErro(error.message || "Erro ao gerar contrato.");
    }
  }

  async function consultarContrato(solicitacaoId) {
    try {
      const resposta = await fetch(
        `${API_URL}/contratos/solicitacao/${solicitacaoId}`,
        {
          credentials: "include"
        }
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível consultar o contrato.");
      }

      const dados = await resposta.json();

      setContratos((anteriores) => ({
        ...anteriores,
        [solicitacaoId]: dados
      }));

      return dados;
    } catch (error) {
      notificarErro(error.message || "Erro ao consultar contrato.");
      return null;
    }
  }

  async function baixarContrato(contratoId) {
    try {
      const resposta = await fetch(
        `${API_URL}/contratos/${contratoId}/pdf`,
        {
          credentials: "include"
        }
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível baixar o contrato.");
      }

      const arquivo = await resposta.blob();
      const url = window.URL.createObjectURL(arquivo);

      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-${contratoId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      notificarSucesso("Download do contrato iniciado!");
    } catch (error) {
      notificarErro(error.message || "Erro ao baixar contrato.");
    }
  }

  if (carregando) {
    return (
      <main className="cliente-page">
        <Navbar usuario={usuario} tipo="CLIENTE" />

        <div className="cliente-container">
          <p className="cliente-carregando">
            Carregando informações...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="cliente-page">
      <Navbar
        usuario={usuario}
        tipo="CLIENTE"
        onSolicitarAluguel={() => setModalAberto(true)}
        onMudarArea={setAreaAtiva}
      />

      <div className="cliente-container">
        <Notificacao
          tipo="erro"
          mensagem={erro}
          onFechar={() => setErro("")}
        />

        <Notificacao
          tipo="sucesso"
          mensagem={mensagem}
          onFechar={() => setMensagem("")}
        />

        <header className="cliente-header">
          <span className="cliente-etiqueta">ÁREA DO CLIENTE</span>

          <h1>
            Olá, {usuario?.nome || "cliente"}!
          </h1>

          <p>
            Consulte nossos automóveis, solicite um aluguel e acompanhe
            suas solicitações.
          </p>
        </header>

        <div className="cliente-toolbar">
          <NavegacaoCliente
            areaAtiva={areaAtiva}
            onMudarArea={setAreaAtiva}
          />

          <button
            type="button"
            className="cliente-botao-aluguel"
            onClick={() => setModalAberto(true)}
          >
            <span>+</span>
            Solicitar aluguel
          </button>
        </div>

        {areaAtiva === "automoveis" && (
          <AutomoveisCliente automoveis={automoveis} />
        )}

        {areaAtiva === "solicitacoes" && (
          <section className="cliente-section" id="solicitacoes">
            <div className="cliente-section-header">
              <span className="cliente-etiqueta">ACOMPANHAMENTO</span>
              <h2>Minhas solicitações</h2>
              <p>
                Acompanhe o andamento dos seus pedidos de aluguel.
              </p>
            </div>

            {solicitacoes.length === 0 ? (
              <p>Você ainda não possui solicitações.</p>
            ) : (
              <div className="solicitacoes-lista">
                {solicitacoes.map((solicitacao) => (
                  <SolicitacaoCliente
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    automoveis={automoveis}
                    solicitacaoEdicao={solicitacaoEdicao}
                    automovelIdEdicao={automovelIdEdicao}
                    setAutomovelIdEdicao={setAutomovelIdEdicao}
                    dataInicioEdicao={dataInicioEdicao}
                    setDataInicioEdicao={setDataInicioEdicao}
                    dataFimEdicao={dataFimEdicao}
                    setDataFimEdicao={setDataFimEdicao}
                    iniciarEdicao={iniciarEdicao}
                    cancelarEdicao={cancelarEdicao}
                    salvarEdicao={salvarEdicao}
                    cancelarSolicitacao={cancelarSolicitacao}
                    contratos={contratos}
                    consultarContrato={consultarContrato}
                    baixarContrato={baixarContrato}
                    solicitacaoContrato={solicitacaoContrato}
                    setSolicitacaoContrato={setSolicitacaoContrato}
                    nomeContratante={nomeContratante}
                    setNomeContratante={setNomeContratante}
                    profissao={profissao}
                    setProfissao={setProfissao}
                    rendaMensal={rendaMensal}
                    setRendaMensal={setRendaMensal}
                    gerarContrato={gerarContrato}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <ModalAluguel
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        automoveis={automoveis}
        automovelId={automovelId}
        setAutomovelId={setAutomovelId}
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        onSubmit={solicitarAluguel}
      />
    </main>
  );
}

export default Cliente;
