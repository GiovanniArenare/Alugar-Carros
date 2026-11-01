
import { useEffect, useState } from "react";
import { buscarUsuarioAtual, API_URL } from "../services/api";
import "./Agente.css";

function Agente() {
  const [usuario, setUsuario] = useState(null);
  const [pendentes, setPendentes] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [recusadas, setRecusadas] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);

  const [pareceres, setPareceres] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [matricula, setMatricula] = useState("");
  const [ano, setAno] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");

  const [automovelEdicao, setAutomovelEdicao] = useState(null);
  const [anoEdicao, setAnoEdicao] = useState("");
  const [marcaEdicao, setMarcaEdicao] = useState("");
  const [modeloEdicao, setModeloEdicao] = useState("");

  async function buscarSolicitacoes(tipo) {
    const resposta = await fetch(`${API_URL}/solicitacoes/${tipo}`, {
      credentials: "include"
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar as solicitações.");
    }

    return await resposta.json();
  }

  async function carregarSolicitacoes() {
    const [dadosPendentes, dadosAprovadas, dadosRecusadas] =
      await Promise.all([
        buscarSolicitacoes("pendentes"),
        buscarSolicitacoes("aprovadas"),
        buscarSolicitacoes("recusadas")
      ]);

    setPendentes(dadosPendentes);
    setAprovadas(dadosAprovadas);
    setRecusadas(dadosRecusadas);
  }

  async function carregarAutomoveis() {
    const resposta = await fetch(`${API_URL}/automoveis`, {
      credentials: "include"
    });

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os automóveis.");
    }

    const dados = await resposta.json();
    setAutomoveis(dados);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosUsuario = await buscarUsuarioAtual();
        setUsuario(dadosUsuario);

        await Promise.all([
          carregarSolicitacoes(),
          carregarAutomoveis()
        ]);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  async function cadastrarAutomovel(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/automoveis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          matricula,
          ano: Number(ano),
          marca,
          modelo,
          placa
        })
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao cadastrar automóvel.");
      }

      setMensagem("Automóvel cadastrado com sucesso!");

      setMatricula("");
      setAno("");
      setMarca("");
      setModelo("");
      setPlaca("");

      await carregarAutomoveis();
    } catch (error) {
      setErro(error.message);
    }
  }

  function iniciarEdicao(automovel) {
    setAutomovelEdicao(automovel.id);
    setAnoEdicao(String(automovel.ano));
    setMarcaEdicao(automovel.marca);
    setModeloEdicao(automovel.modelo);
    setErro("");
    setMensagem("");
  }

  function cancelarEdicao() {
    setAutomovelEdicao(null);
    setAnoEdicao("");
    setMarcaEdicao("");
    setModeloEdicao("");
  }

  async function salvarEdicao(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/automoveis/${automovelEdicao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            ano: Number(anoEdicao),
            marca: marcaEdicao,
            modelo: modeloEdicao
          })
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao editar automóvel.");
      }

      setMensagem("Automóvel atualizado com sucesso!");

      cancelarEdicao();
      await carregarAutomoveis();
    } catch (error) {
      setErro(error.message);
    }
  }

  async function excluirAutomovel(id) {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o automóvel ${id}?`
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/automoveis/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao excluir automóvel.");
      }

      setMensagem("Automóvel excluído com sucesso!");

      if (automovelEdicao === id) {
        cancelarEdicao();
      }

      await carregarAutomoveis();
    } catch (error) {
      setErro(error.message);
    }
  }

  async function avaliarSolicitacao(id, status) {
    setErro("");
    setMensagem("");

    const parecer = pareceres[id];

    if (!parecer || !parecer.trim()) {
      setErro("Informe o parecer financeiro antes de avaliar.");
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/solicitacoes/${id}/avaliacao`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            status,
            parecerFinanceiro: parecer
          })
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.erro || "Erro ao avaliar solicitação.");
      }

      setMensagem(
        `Solicitação ${id} ${
          status === "APROVADA" ? "aprovada" : "recusada"
        } com sucesso!`
      );

      setPareceres((anteriores) => ({
        ...anteriores,
        [id]: ""
      }));

      await carregarSolicitacoes();
    } catch (error) {
      setErro(error.message);
    }
  }

  function renderSolicitacao(solicitacao, mostrarAvaliacao = false) {
    return (
      <article className="agente-solicitacao-card" key={solicitacao.id}>
        <div className="solicitacao-card-header">
          <h3>Solicitação #{solicitacao.id}</h3>

          <span
            className={`status status-${solicitacao.status}`}
          >
            {solicitacao.status}
          </span>
        </div>

        <p><strong>Cliente:</strong> #{solicitacao.clienteId}</p>

        <p>
          <strong>Automóvel:</strong> {solicitacao.marca}{" "}
          {solicitacao.modelo}
        </p>

        <p><strong>Placa:</strong> {solicitacao.placa}</p>
        <p><strong>Data de início:</strong> {solicitacao.dataInicio}</p>
        <p><strong>Data de término:</strong> {solicitacao.dataFim}</p>

        {!mostrarAvaliacao && (
          <p>
            <strong>Parecer financeiro:</strong>{" "}
            {solicitacao.parecerFinanceiro || "Não informado."}
          </p>
        )}

        {mostrarAvaliacao && (
          <div className="avaliacao-form">
            <label htmlFor={`parecer-${solicitacao.id}`}>
              Parecer financeiro
            </label>

            <textarea
              id={`parecer-${solicitacao.id}`}
              rows="4"
              value={pareceres[solicitacao.id] || ""}
              onChange={(event) =>
                setPareceres((anteriores) => ({
                  ...anteriores,
                  [solicitacao.id]: event.target.value
                }))
              }
              placeholder="Digite o parecer da análise financeira..."
            />

            <div className="solicitacao-acoes">
              <button
                className="botao-principal"
                type="button"
                onClick={() =>
                  avaliarSolicitacao(solicitacao.id, "APROVADA")
                }
              >
                Aprovar solicitação
              </button>

              <button
                className="botao-perigo"
                type="button"
                onClick={() =>
                  avaliarSolicitacao(solicitacao.id, "RECUSADA")
                }
              >
                Recusar solicitação
              </button>
            </div>
          </div>
        )}
      </article>
    );
  }

  if (carregando) {
    return (
      <main className="agente-page">
        <p className="agente-carregando">Carregando área do agente...</p>
      </main>
    );
  }

  return (
    <main className="agente-page">
      <div className="agente-container">
        <header className="agente-header">
          <div>
            <span className="agente-etiqueta">ALUGACAR</span>
            <h1>Área do Agente</h1>
            <p>Bem-vindo, {usuario?.email}!</p>
            <p>Gerencie os automóveis e avalie as solicitações de aluguel.</p>
          </div>
        </header>

        {erro && <p className="agente-erro">{erro}</p>}
        {mensagem && <p className="agente-sucesso">{mensagem}</p>}

        <section className="agente-section">
          <div className="agente-section-header">
            <h2>Cadastrar automóvel</h2>
            <p>Adicione um veículo ao sistema.</p>
          </div>

          <form className="agente-form" onSubmit={cadastrarAutomovel}>
            <div className="agente-form-grid">
              <div className="agente-campo">
                <label htmlFor="matricula">Matrícula</label>
                <input
                  id="matricula"
                  type="text"
                  value={matricula}
                  onChange={(event) => setMatricula(event.target.value)}
                  required
                />
              </div>

              <div className="agente-campo">
                <label htmlFor="ano">Ano</label>
                <input
                  id="ano"
                  type="number"
                  min="1900"
                  value={ano}
                  onChange={(event) => setAno(event.target.value)}
                  required
                />
              </div>

              <div className="agente-campo">
                <label htmlFor="marca">Marca</label>
                <input
                  id="marca"
                  type="text"
                  value={marca}
                  onChange={(event) => setMarca(event.target.value)}
                  required
                />
              </div>

              <div className="agente-campo">
                <label htmlFor="modelo">Modelo</label>
                <input
                  id="modelo"
                  type="text"
                  value={modelo}
                  onChange={(event) => setModelo(event.target.value)}
                  required
                />
              </div>

              <div className="agente-campo">
                <label htmlFor="placa">Placa</label>
                <input
                  id="placa"
                  type="text"
                  value={placa}
                  onChange={(event) => setPlaca(event.target.value)}
                  required
                />
              </div>
            </div>

            <button className="botao-principal" type="submit">
              Cadastrar automóvel
            </button>
          </form>
        </section>

        <section className="agente-section">
          <div className="agente-section-header">
            <h2>Automóveis cadastrados</h2>
            <p>Consulte e gerencie os veículos do sistema.</p>
          </div>

          {automoveis.length === 0 ? (
            <p className="agente-vazio">Nenhum automóvel cadastrado.</p>
          ) : (
            <div className="agente-automoveis-grid">
              {automoveis.map((automovel) => (
                <article className="agente-automovel-card" key={automovel.id}>
                  <div className="automovel-card-topo">
                    <span className="automovel-etiqueta">
                      {automovel.ano}
                    </span>
                    <span className="automovel-matricula">
                      {automovel.matricula}
                    </span>
                  </div>

                  <h3>{automovel.marca} {automovel.modelo}</h3>
                  <p><strong>Placa:</strong> {automovel.placa}</p>

                  <div className="automovel-acoes">
                    <button
                      className="botao-secundario"
                      type="button"
                      onClick={() => iniciarEdicao(automovel)}
                    >
                      Editar
                    </button>

                    <button
                      className="botao-perigo"
                      type="button"
                      onClick={() => excluirAutomovel(automovel.id)}
                    >
                      Excluir
                    </button>
                  </div>

                  {automovelEdicao === automovel.id && (
                    <form
                      className="agente-form agente-form-edicao"
                      onSubmit={salvarEdicao}
                    >
                      <h4>Editar automóvel</h4>

                      <div className="agente-campo">
                        <label>Ano</label>
                        <input
                          type="number"
                          min="1900"
                          value={anoEdicao}
                          onChange={(event) =>
                            setAnoEdicao(event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="agente-campo">
                        <label>Marca</label>
                        <input
                          type="text"
                          value={marcaEdicao}
                          onChange={(event) =>
                            setMarcaEdicao(event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="agente-campo">
                        <label>Modelo</label>
                        <input
                          type="text"
                          value={modeloEdicao}
                          onChange={(event) =>
                            setModeloEdicao(event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="automovel-acoes">
                        <button className="botao-principal" type="submit">
                          Salvar alterações
                        </button>

                        <button
                          className="botao-secundario"
                          type="button"
                          onClick={cancelarEdicao}
                        >
                          Voltar
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="agente-section">
          <div className="agente-section-header">
            <h2>Solicitações pendentes</h2>
            <p>Solicitações que aguardam análise financeira.</p>
          </div>

          {pendentes.length === 0 ? (
            <p className="agente-vazio">Não existem solicitações pendentes.</p>
          ) : (
            <div className="agente-solicitacoes-grid">
              {pendentes.map((solicitacao) =>
                renderSolicitacao(solicitacao, true)
              )}
            </div>
          )}
        </section>

        <section className="agente-section">
          <div className="agente-section-header">
            <h2>Solicitações aprovadas</h2>
            <p>Solicitações liberadas para contratação.</p>
          </div>

          {aprovadas.length === 0 ? (
            <p className="agente-vazio">Não existem solicitações aprovadas.</p>
          ) : (
            <div className="agente-solicitacoes-grid">
              {aprovadas.map((solicitacao) =>
                renderSolicitacao(solicitacao)
              )}
            </div>
          )}
        </section>

        <section className="agente-section">
          <div className="agente-section-header">
            <h2>Solicitações recusadas</h2>
            <p>Solicitações que não foram aprovadas.</p>
          </div>

          {recusadas.length === 0 ? (
            <p className="agente-vazio">Não existem solicitações recusadas.</p>
          ) : (
            <div className="agente-solicitacoes-grid">
              {recusadas.map((solicitacao) =>
                renderSolicitacao(solicitacao)
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Agente;
