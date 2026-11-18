import { useState } from "react";
import CardSolicitacao from "../CardSolicitacao";

function SolicitacoesAgente({
  pendentes,
  aprovadas,
  recusadas,
  onAvaliar,
  onRegistrarCredito
}) {
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [pareceres, setPareceres] = useState({});

  const abas = [
    {
      id: "pendentes",
      titulo: "Pendentes",
      descricao: "Solicitações que aguardam análise financeira.",
      dados: pendentes
    },
    {
      id: "aprovadas",
      titulo: "Aprovadas",
      descricao: "Solicitações liberadas para contratação.",
      dados: aprovadas
    },
    {
      id: "recusadas",
      titulo: "Recusadas",
      descricao: "Solicitações que não foram aprovadas.",
      dados: recusadas
    }
  ];

  const abaSelecionada = abas.find((aba) => aba.id === abaAtiva);

  async function avaliar(id, status) {
    const sucesso = await onAvaliar(id, status, pareceres[id]);

    if (sucesso) {
      setPareceres((anteriores) => ({ ...anteriores, [id]: "" }));
    }
  }

  return (
    <section className="agente-section" id="solicitacoes">
      <div className="agente-section-header">
        <span className="agente-section-etiqueta">ANÁLISE</span>
        <h2>Solicitações de aluguel</h2>
        <p>
          Analise os pedidos dos clientes e acompanhe o andamento das
          avaliações.
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
            <span className="agente-aba-contador">{aba.dados.length}</span>
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
            <p>Não existem solicitações nesta categoria no momento.</p>
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
                onAvaliar={avaliar}
                onRegistrarCredito={onRegistrarCredito}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SolicitacoesAgente;
