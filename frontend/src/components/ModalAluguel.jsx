
import { useEffect } from "react";
import "./ModalAluguel.css";

function ModalAluguel({
  aberto,
  onFechar,
  automoveis,
  automovelId,
  setAutomovelId,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onSubmit
}) {
  useEffect(() => {
    if (!aberto) return;

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        onFechar();
      }
    }

    document.addEventListener("keydown", fecharComEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fecharComEscape);
      document.body.style.overflow = "";
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="modal-aluguel-overlay"
      onClick={onFechar}
    >
      <div
        className="modal-aluguel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-aluguel-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-aluguel-header">
          <div>
            <span className="cliente-etiqueta">NOVA RESERVA</span>
            <h2 id="modal-aluguel-titulo">Solicitar aluguel</h2>
            <p>Preencha os dados para solicitar um automóvel.</p>
          </div>

          <button
            type="button"
            className="modal-aluguel-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {automoveis.length === 0 ? (
          <div className="modal-aluguel-vazio">
            <p>Não existem automóveis disponíveis no momento.</p>
          </div>
        ) : (
          <form className="cliente-form" onSubmit={onSubmit}>
            <label htmlFor="automovelId">
              Automóvel
            </label>

            <select
              id="automovelId"
              value={automovelId}
              onChange={(event) => setAutomovelId(event.target.value)}
              required
            >
              <option value="">Selecione um automóvel</option>

              {automoveis.map((automovel) => (
                <option key={automovel.id} value={automovel.id}>
                  {automovel.marca} {automovel.modelo} - {automovel.placa}
                </option>
              ))}
            </select>

            <label htmlFor="dataInicio">
              Data de início
            </label>

            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(event) => setDataInicio(event.target.value)}
              required
            />

            <label htmlFor="dataFim">
              Data de término
            </label>

            <input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(event) => setDataFim(event.target.value)}
              min={dataInicio || undefined}
              required
            />

            <div className="modal-aluguel-acoes">
              <button
                type="button"
                className="botao-secundario"
                onClick={onFechar}
              >
                Cancelar
              </button>

              <button type="submit">
                Enviar solicitação
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalAluguel;
