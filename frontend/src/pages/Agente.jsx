import { useEffect, useState } from "react";
import { buscarUsuarioAtual, API_URL } from "../services/api";
import Navbar from "../components/Navbar";
import Notificacao from "../components/Notificacao";
import CardSolicitacao from "../components/CardSolicitacao";
import AutomovelModal from "../components/AutomovelModal";
import "../components/Notificacao.css";
import "./Agente.css";

function Agente() {
  const [usuario, setUsuario] = useState(null);
  const [pendentes, setPendentes] = useState([]);
  const [aprovadas, setAprovadas] = useState([]);
  const [recusadas, setRecusadas] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);

  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [pareceres, setPareceres] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [modalAutomovel, setModalAutomovel] = useState(undefined);

  // Paginação dos automóveis
  const [paginaAutomoveis, setPaginaAutomoveis] = useState(1);
  const AUTOMOVEIS_POR_PAGINA = 6;

  const totalPaginasAutomoveis = Math.ceil(
    automoveis.length / AUTOMOVEIS_POR_PAGINA
  );

  const indiceInicial =
    (paginaAutomoveis - 1) * AUTOMOVEIS_POR_PAGINA;

  const automoveisPaginados = automoveis.slice(
    indiceInicial,
    indiceInicial + AUTOMOVEIS_POR_PAGINA
  );

  function notificarSucesso(texto) {
    setErro("");
    setMensagem(texto);
  }

  function notificarErro(texto) {
    setMensagem("");
    setErro(texto);
  }

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

    // Evita permanecer em uma página que deixou de existir.
    const ultimaPagina = Math.max(
      1,
      Math.ceil(dados.length / AUTOMOVEIS_POR_PAGINA)
    );

    setPaginaAutomoveis((paginaAtual) =>
      Math.min(paginaAtual, ultimaPagina)
    );
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
        notificarErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  async function salvarAutomovel(dados) {
    setErro("");
    setMensagem("");

    const editando = Boolean(modalAutomovel);

    try {
      const url = editando
        ? `${API_URL}/automoveis/${modalAutomovel.id}`
        : `${API_URL}/automoveis`;

      const resposta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(
          editando
            ? {
                ano: dados.ano,
                marca: dados.marca,
                modelo: dados.modelo
              }
            : dados
        )
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
          `Erro ao ${editando ? "editar" : "cadastrar"} automóvel.`
        );
      }

      setModalAutomovel(undefined);

      // Ao cadastrar, volta para a primeira página.
      if (!editando) {
        setPaginaAutomoveis(1);
      }

      await carregarAutomoveis();

      notificarSucesso(
        editando
          ? "Automóvel atualizado com sucesso!"
          : "Automóvel cadastrado com sucesso!"
      );
    } catch (error) {
      notificarErro(error.message);
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

      await carregarAutomoveis();
      notificarSucesso("Automóvel excluído com sucesso!");
    } catch (error) {
      notificarErro(error.message);
    }
  }

  async function avaliarSolicitacao(id, status) {
    setErro("");
    setMensagem("");

    const parecer = pareceres[id];

    if (!parecer || !parecer.trim()) {
      notificarErro("Informe o parecer financeiro antes de avaliar.");
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

      setPareceres((anteriores) => ({
        ...anteriores,
        [id]: ""
      }));

      await carregarSolicitacoes();

      notificarSucesso(
        `Solicitação ${id} ${
          status === "APROVADA" ? "aprovada" : "recusada"
        } com sucesso!`
      );
    } catch (error) {
      notificarErro(error.message);
    }
  }

  const abas = [
    {
      id: "pendentes",
      titulo: "Pendentes",
      quantidade: pendentes.length,
      descricao: "Solicitações que aguardam análise financeira.",
      dados: pendentes
    },
    {
      id: "aprovadas",
      titulo: "Aprovadas",
      quantidade: aprovadas.length,
      descricao: "Solicitações liberadas para contratação.",
      dados: aprovadas
    },
    {
      id: "recusadas",
      titulo: "Recusadas",
      quantidade: recusadas.length,
      descricao: "Solicitações que não foram aprovadas.",
      dados: recusadas
    }
  ];

  const abaSelecionada = abas.find((aba) => aba.id === abaAtiva);

  if (carregando) {
    return (
      <main className="agente-page">
        <div className="agente-carregando">
          <span className="agente-loading-icon"></span>
          <p>Carregando painel do agente...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="agente-page">
      <Navbar usuario={usuario} tipo="AGENTE" />

      <div className="agente-container" id="inicio">

        {erro && (
          <Notificacao
            tipo="erro"
            mensagem={erro}
            onFechar={() => setErro("")}
          />
        )}

        {mensagem && (
          <Notificacao
            tipo="sucesso"
            mensagem={mensagem}
            onFechar={() => setMensagem("")}
          />
        )}

        <section className="agente-resumo">
          <article className="agente-resumo-card">
            <div className="agente-resumo-icone">🚗</div>
            <div>
              <span>Automóveis</span>
              <strong>{automoveis.length}</strong>
              <small>Veículos cadastrados</small>
            </div>
          </article>

          <article className="agente-resumo-card">
            <div className="agente-resumo-icone pendente">◷</div>
            <div>
              <span>Pendentes</span>
              <strong>{pendentes.length}</strong>
              <small>Aguardando avaliação</small>
            </div>
          </article>

          <article className="agente-resumo-card">
            <div className="agente-resumo-icone aprovada">✓</div>
            <div>
              <span>Aprovadas</span>
              <strong>{aprovadas.length}</strong>
              <small>Liberadas para contratação</small>
            </div>
          </article>

          <article className="agente-resumo-card">
            <div className="agente-resumo-icone recusada">×</div>
            <div>
              <span>Recusadas</span>
              <strong>{recusadas.length}</strong>
              <small>Solicitações recusadas</small>
            </div>
          </article>
        </section>

        <section className="agente-section" id="automoveis">
          <div className="agente-section-topo">
            <div className="agente-section-header">
              <span className="agente-section-etiqueta">FROTA</span>
              <h2>Automóveis cadastrados</h2>
              <p>
                Visualize e gerencie os veículos disponíveis no sistema.
              </p>
            </div>

            <button
              className="botao-principal"
              type="button"
              onClick={() => setModalAutomovel(null)}
            >
              <span>+</span> Cadastrar automóvel
            </button>
          </div>

          {automoveis.length === 0 ? (
            <div className="agente-vazio">
              <span>🚗</span>
              <h3>Nenhum automóvel cadastrado</h3>
              <p>
                Cadastre o primeiro veículo para começar a gerenciar a frota.
              </p>
            </div>
          ) : (
            <>
              <div className="agente-automoveis-grid">
                {automoveisPaginados.map((automovel) => (
                  <article
                    className="agente-automovel-card"
                    key={automovel.id}
                  >
                    <div className="automovel-card-topo">
                      <span className="automovel-etiqueta">
                        {automovel.ano}
                      </span>
                      <span className="automovel-matricula">
                        #{automovel.matricula}
                      </span>
                    </div>

                    <div className="automovel-card-info">
                      <span className="automovel-card-label">VEÍCULO</span>
                      <h3>
                        {automovel.marca} {automovel.modelo}
                      </h3>
                      <p>
                        <strong>Placa:</strong> {automovel.placa}
                      </p>
                    </div>

                    <div className="automovel-acoes">
                      <button
                        className="botao-secundario"
                        type="button"
                        onClick={() => setModalAutomovel(automovel)}
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
                  </article>
                ))}
              </div>

              {totalPaginasAutomoveis > 1 && (
                <div className="automoveis-paginacao">
                  <button
                    type="button"
                    className="paginacao-botao"
                    disabled={paginaAutomoveis === 1}
                    onClick={() =>
                      setPaginaAutomoveis((pagina) => pagina - 1)
                    }
                  >
                    ← Anterior
                  </button>

                  <span>
                    Página <strong>{paginaAutomoveis}</strong> de{" "}
                    <strong>{totalPaginasAutomoveis}</strong>
                  </span>

                  <button
                    type="button"
                    className="paginacao-botao"
                    disabled={paginaAutomoveis === totalPaginasAutomoveis}
                    onClick={() =>
                      setPaginaAutomoveis((pagina) => pagina + 1)
                    }
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="agente-section" id="solicitacoes">
          <div className="agente-section-header">
            <span className="agente-section-etiqueta">ANÁLISE</span>
            <h2>Solicitações de aluguel</h2>
            <p>
              Analise os pedidos dos clientes e acompanhe o andamento
              das avaliações.
            </p>
          </div>

          <div
            className="agente-abas"
            role="tablist"
            aria-label="Status das solicitações"
          >
            {abas.map((aba) => (
              <button
                key={aba.id}
                id={`aba-${aba.id}`}
                type="button"
                role="tab"
                aria-selected={abaAtiva === aba.id}
                aria-controls="painel-solicitacoes"
                className={`agente-aba ${
                  abaAtiva === aba.id ? "agente-aba-ativa" : ""
                }`}
                onClick={() => setAbaAtiva(aba.id)}
              >
                <span>{aba.titulo}</span>
                <span className="agente-aba-contador">
                  {aba.quantidade}
                </span>
              </button>
            ))}
          </div>

          <div
            id="painel-solicitacoes"
            className="agente-painel-abas"
            role="tabpanel"
            aria-labelledby={`aba-${abaAtiva}`}
          >
            <div className="agente-painel-descricao">
              <h3>{abaSelecionada.titulo}</h3>
              <p>{abaSelecionada.descricao}</p>
            </div>

            {abaSelecionada.dados.length === 0 ? (
              <div className="agente-vazio">
                <span>📋</span>
                <h3>Nenhuma solicitação encontrada</h3>
                <p>
                  Não existem solicitações nesta categoria no momento.
                </p>
              </div>
            ) : (
              <div className="agente-solicitacoes-grid">
                {abaSelecionada.dados.map((solicitacao) => (
                  <CardSolicitacao
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    mostrarAvaliacao={abaAtiva === "pendentes"}
                    parecer={pareceres[solicitacao.id]}
                    onParecerChange={(id, valor) =>
                      setPareceres((anteriores) => ({
                        ...anteriores,
                        [id]: valor
                      }))
                    }
                    onAvaliar={avaliarSolicitacao}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {modalAutomovel !== undefined && (
          <AutomovelModal
            automovel={modalAutomovel}
            onFechar={() => setModalAutomovel(undefined)}
            onSalvar={salvarAutomovel}
          />
        )}

        <footer className="agente-footer">
          <span>ALUGACAR</span>
          <p>Painel de gerenciamento de operações</p>
        </footer>
      </div>
    </main>
  );
}

export default Agente;