
import { useEffect, useState } from "react";
import { buscarUsuarioAtual, API_URL } from "../services/api";
import "./Cliente.css";

function Cliente() {
  const [usuario, setUsuario] = useState(null);
  const [automoveis, setAutomoveis] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Campos para criar uma solicitação
  const [automovelId, setAutomovelId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Campos exclusivos para editar uma solicitação
  const [solicitacaoEdicao, setSolicitacaoEdicao] = useState(null);
  const [automovelIdEdicao, setAutomovelIdEdicao] = useState("");
  const [dataInicioEdicao, setDataInicioEdicao] = useState("");
  const [dataFimEdicao, setDataFimEdicao] = useState("");

  // Campos para contrato
  const [solicitacaoContrato, setSolicitacaoContrato] = useState(null);
  const [nomeContratante, setNomeContratante] = useState("");
  const [profissao, setProfissao] = useState("");
  const [rendaMensal, setRendaMensal] = useState("");

  const [contratos, setContratos] = useState({});

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
      const [dadosUsuario, respostaAutomoveis] = await Promise.all([
        buscarUsuarioAtual(),
        fetch(`${API_URL}/automoveis`, {
          credentials: "include"
        })
      ]);

      if (!respostaAutomoveis.ok) {
        throw new Error("Não foi possível carregar os automóveis.");
      }

      const dadosAutomoveis = await respostaAutomoveis.json();

      setUsuario(dadosUsuario);
      setAutomoveis(dadosAutomoveis);

      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Criar solicitação
  async function solicitarAluguel(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

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

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao solicitar aluguel.");
      }

      setMensagem(`Solicitação ${resultado.id} criada com sucesso!`);

      setAutomovelId("");
      setDataInicio("");
      setDataFim("");

      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    }
  }

  // Iniciar edição
  function iniciarEdicao(solicitacao) {
    setSolicitacaoEdicao(solicitacao.id);
    setAutomovelIdEdicao(String(solicitacao.automovelId));
    setDataInicioEdicao(solicitacao.dataInicio);
    setDataFimEdicao(solicitacao.dataFim);

    setErro("");
    setMensagem("");
  }

  // Cancelar edição
  function cancelarEdicao() {
    setSolicitacaoEdicao(null);
    setAutomovelIdEdicao("");
    setDataInicioEdicao("");
    setDataFimEdicao("");
  }

  // Salvar edição
  async function salvarEdicao(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/solicitacoes/${solicitacaoEdicao}`,
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

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao editar solicitação.");
      }

      setMensagem(`Solicitação ${resultado.id} atualizada com sucesso!`);

      cancelarEdicao();
      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    }
  }

  // Cancelar solicitação
  async function cancelarSolicitacao(id) {
    const confirmar = window.confirm(
      `Tem certeza que deseja cancelar a solicitação ${id}?`
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/solicitacoes/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao cancelar solicitação.");
      }

      setMensagem(`Solicitação ${id} cancelada com sucesso!`);

      if (solicitacaoEdicao === id) {
        cancelarEdicao();
      }

      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    }
  }

  // Gerar contrato
  async function gerarContrato(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/contratos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          solicitacaoId: solicitacaoContrato,
          nomeContratante,
          profissao,
          rendaMensal: Number(rendaMensal)
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao gerar contrato.");
      }

      setContratos((anteriores) => ({
        ...anteriores,
        [solicitacaoContrato]: resultado
      }));

      setMensagem(`Contrato ${resultado.id} criado com sucesso!`);

      setSolicitacaoContrato(null);
      setNomeContratante("");
      setProfissao("");
      setRendaMensal("");
    } catch (error) {
      setErro(error.message);
    }
  }

  // Consultar contrato
  async function consultarContrato(solicitacaoId) {
    setErro("");

    try {
      const resposta = await fetch(
        `${API_URL}/contratos/solicitacao/${solicitacaoId}`,
        {
          credentials: "include"
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Contrato não encontrado.");
      }

      setContratos((anteriores) => ({
        ...anteriores,
        [solicitacaoId]: resultado
      }));
    } catch (error) {
      setErro(error.message);
    }
  }

  if (carregando) {
    return <p>Carregando área do cliente...</p>;
  }

  return (
    <main className="cliente-page">
      <div className="cliente-container">

        {/* Cabeçalho */}
        <header className="cliente-header">
          <h1>AlugaCar</h1>
          <h2>Área do Cliente</h2>
          <p>Bem-vindo, {usuario?.email}!</p>
          <p>Confira os automóveis disponíveis para aluguel.</p>
        </header>

        {/* Mensagens */}
        {erro && (
          <p className="cliente-erro">{erro}</p>
        )}

        {mensagem && (
          <p className="cliente-sucesso">{mensagem}</p>
        )}

        {/* Automóveis cadastrados */}
        <section className="cliente-section">
          <h2>Automóveis cadastrados</h2>

          {automoveis.length === 0 ? (
            <p>Nenhum automóvel cadastrado no momento.</p>
          ) : (
            <div className="automoveis-grid">
              {automoveis.map((automovel) => (
                <article
                  className="automovel-card"
                  key={automovel.id}
                >
                  <h3>
                    {automovel.marca} {automovel.modelo}
                  </h3>

                  <p>Ano: {automovel.ano}</p>
                  <p>Placa: {automovel.placa}</p>
                  <p>Matrícula: {automovel.matricula}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Criar solicitação */}
        <section className="cliente-section">
          <h2>Solicitar aluguel</h2>

          <form
            className="cliente-form"
            onSubmit={solicitarAluguel}
          >
            <label>Automóvel:</label>

            <select
              value={automovelId}
              onChange={(event) => setAutomovelId(event.target.value)}
              required
            >
              <option value="">Selecione um automóvel</option>

              {automoveis.map((automovel) => (
                <option key={automovel.id} value={automovel.id}>
                  {automovel.marca} {automovel.modelo}
                </option>
              ))}
            </select>

            <label>Data de início:</label>

            <input
              type="date"
              value={dataInicio}
              onChange={(event) => setDataInicio(event.target.value)}
              required
            />

            <label>Data de término:</label>

            <input
              type="date"
              value={dataFim}
              onChange={(event) => setDataFim(event.target.value)}
              required
            />

            <button type="submit">
              Solicitar aluguel
            </button>
          </form>
        </section>

        {/* Minhas solicitações */}
        <section className="cliente-section">
          <h2>Minhas solicitações</h2>

          {solicitacoes.length === 0 ? (
            <p>Você ainda não possui solicitações.</p>
          ) : (
            solicitacoes.map((solicitacao) => (
              <article
                className="solicitacao-card"
                key={solicitacao.id}
              >
                <h3>
                  {solicitacao.marca} {solicitacao.modelo}
                </h3>

                <p>Solicitação: {solicitacao.id}</p>
                <p>Início: {solicitacao.dataInicio}</p>
                <p>Término: {solicitacao.dataFim}</p>

                <p>
                  Status:{" "}
                  <span className={`status status-${solicitacao.status}`}>
                    {solicitacao.status}
                  </span>
                </p>

                {solicitacao.parecerFinanceiro && (
                  <p>
                    Parecer financeiro: {solicitacao.parecerFinanceiro}
                  </p>
                )}

                {/* Ações da solicitação */}
                {solicitacao.status === "PENDENTE" && (
                  <div className="solicitacao-acoes">
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(solicitacao)}
                    >
                      Editar solicitação
                    </button>

                    <button
                      type="button"
                      className="botao-perigo"
                      onClick={() => cancelarSolicitacao(solicitacao.id)}
                    >
                      Cancelar solicitação
                    </button>
                  </div>
                )}

                {/* Formulário de edição */}
                {solicitacaoEdicao === solicitacao.id && (
                  <form
                    className="cliente-form cliente-subform"
                    onSubmit={salvarEdicao}
                  >
                    <h4>Editar solicitação #{solicitacao.id}</h4>

                    <label>Automóvel:</label>

                    <select
                      value={automovelIdEdicao}
                      onChange={(event) =>
                        setAutomovelIdEdicao(event.target.value)
                      }
                      required
                    >
                      <option value="">Selecione um automóvel</option>

                      {automoveis.map((automovel) => (
                        <option key={automovel.id} value={automovel.id}>
                          {automovel.marca} {automovel.modelo}
                        </option>
                      ))}
                    </select>

                    <label>Data de início:</label>

                    <input
                      type="date"
                      value={dataInicioEdicao}
                      onChange={(event) =>
                        setDataInicioEdicao(event.target.value)
                      }
                      required
                    />

                    <label>Data de término:</label>

                    <input
                      type="date"
                      value={dataFimEdicao}
                      onChange={(event) =>
                        setDataFimEdicao(event.target.value)
                      }
                      required
                    />

                    <button type="submit">
                      Salvar alterações
                    </button>

                    <button
                      type="button"
                      className="botao-secundario"
                      onClick={cancelarEdicao}
                    >
                      Voltar
                    </button>
                  </form>
                )}

                {/* Contratos de solicitações aprovadas */}
                {solicitacao.status === "APROVADA" && (
                  <div className="solicitacao-acoes">
                    {contratos[solicitacao.id] ? (
                      <div className="cliente-subform">
                        <h4>
                          Contrato #{contratos[solicitacao.id].id}
                        </h4>

                        <p>
                          Contratante:{" "}
                          {contratos[solicitacao.id].nomeContratante}
                        </p>

                        <p>
                          Profissão: {contratos[solicitacao.id].profissao}
                        </p>

                        <p>
                          Status: {contratos[solicitacao.id].status}
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => consultarContrato(solicitacao.id)}
                        >
                          Consultar contrato
                        </button>

                        <button
                          type="button"
                          onClick={() => setSolicitacaoContrato(solicitacao.id)}
                        >
                          Gerar contrato
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Formulário de contrato */}
                {solicitacaoContrato === solicitacao.id && (
                  <form
                    className="cliente-form cliente-subform"
                    onSubmit={gerarContrato}
                  >
                    <h4>Dados do contrato</h4>

                    <label>Nome do contratante:</label>

                    <input
                      type="text"
                      value={nomeContratante}
                      onChange={(event) =>
                        setNomeContratante(event.target.value)
                      }
                      required
                    />

                    <label>Profissão:</label>

                    <input
                      type="text"
                      value={profissao}
                      onChange={(event) => setProfissao(event.target.value)}
                    />

                    <label>Renda mensal:</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rendaMensal}
                      onChange={(event) => setRendaMensal(event.target.value)}
                    />

                    <button type="submit">
                      Confirmar contrato
                    </button>

                    <button
                      type="button"
                      className="botao-secundario"
                      onClick={() => setSolicitacaoContrato(null)}
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </article>
            ))
          )}
        </section>

      </div>
    </main>
  );
}

export default Cliente;
