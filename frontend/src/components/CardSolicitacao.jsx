import "./CardSolicitacao.css";
function CardSolicitacao({
  solicitacao,
  mostrarAvaliacao = false,
  parecer,
  onParecerChange,
  onAvaliar
}) {
  const statusTexto = {
    PENDENTE: "Pendente",
    APROVADA: "Aprovada",
    RECUSADA: "Recusada"
  };

  return (
    <article className="agente-solicitacao-card">
      <div className="solicitacao-card-header">
        <div>
          <span className="solicitacao-card-label">PEDIDO DE ALUGUEL</span>
          <h3>Solicitação #{solicitacao.id}</h3>
        </div>

        <span className={`status status-${solicitacao.status?.toLowerCase()}`}>
          <span className="status-indicador"></span>
          {statusTexto[solicitacao.status] || solicitacao.status}
        </span>
      </div>

      <div className="solicitacao-dados">
        <div className="solicitacao-dado">
          <span>CLIENTE</span>
          <strong>#{solicitacao.clienteId}</strong>
        </div>

        <div className="solicitacao-dado">
          <span>VEÍCULO</span>
          <strong>
            {solicitacao.marca} {solicitacao.modelo}
          </strong>
        </div>

        <div className="solicitacao-dado">
          <span>PLACA</span>
          <strong>{solicitacao.placa}</strong>
        </div>

        <div className="solicitacao-dado">
          <span>PERÍODO</span>
          <strong>
            {solicitacao.dataInicio} até {solicitacao.dataFim}
          </strong>
        </div>
      </div>

      {!mostrarAvaliacao && (
        <div className="solicitacao-parecer">
          <span>PARECER FINANCEIRO</span>
          <p>
            {solicitacao.parecerFinanceiro || "Não informado."}
          </p>
        </div>
      )}

      {mostrarAvaliacao && (
        <div className="avaliacao-form">
          <label htmlFor={`parecer-${solicitacao.id}`}>
            Parecer financeiro
          </label>

          <textarea
            id={`parecer-${solicitacao.id}`}
            rows="4"
            value={parecer || ""}
            onChange={(event) =>
              onParecerChange(solicitacao.id, event.target.value)
            }
            placeholder="Descreva o resultado da análise financeira..."
          />

          <div className="solicitacao-acoes">
            <button
              className="botao-principal"
              type="button"
              onClick={() => onAvaliar(solicitacao.id, "APROVADA")}
            >
              Aprovar solicitação
            </button>

            <button
              className="botao-perigo"
              type="button"
              onClick={() => onAvaliar(solicitacao.id, "RECUSADA")}
            >
              Recusar solicitação
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default CardSolicitacao;
