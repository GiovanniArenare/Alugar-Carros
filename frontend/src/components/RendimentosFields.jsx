export const MAX_RENDIMENTOS = 3;

function RendimentosFields({ rendimentos, onChange }) {
  function atualizar(indice, campo, valor) {
    onChange(
      rendimentos.map((item, i) =>
        i === indice ? { ...item, [campo]: valor } : item
      )
    );
  }

  function adicionar() {
    if (rendimentos.length >= MAX_RENDIMENTOS) return;

    onChange([...rendimentos, { entidadeEmpregadora: "", valor: "" }]);
  }

  function remover(indice) {
    onChange(rendimentos.filter((_, i) => i !== indice));
  }

  return (
    <fieldset className="form-secao">
      <legend>
        Rendimentos ({rendimentos.length}/{MAX_RENDIMENTOS})
      </legend>

      {rendimentos.map((item, indice) => (
        <div className="form-row rendimento-linha" key={indice}>
          <div className="form-group">
            <label htmlFor={`empregador-${indice}`}>
              Entidade empregadora
            </label>
            <input
              id={`empregador-${indice}`}
              type="text"
              placeholder="Empresa ou fonte de renda"
              value={item.entidadeEmpregadora}
              onChange={(e) =>
                atualizar(indice, "entidadeEmpregadora", e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`valor-${indice}`}>Rendimento mensal (R$)</label>
            <input
              id={`valor-${indice}`}
              type="number"
              min="0.01"
              step="0.01"
              value={item.valor}
              onChange={(e) => atualizar(indice, "valor", e.target.value)}
              required
            />
          </div>

          {rendimentos.length > 1 && (
            <button
              type="button"
              className="botao-auxiliar botao-remover"
              onClick={() => remover(indice)}
              aria-label={`Remover rendimento ${indice + 1}`}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {rendimentos.length < MAX_RENDIMENTOS && (
        <button
          type="button"
          className="botao-auxiliar"
          onClick={adicionar}
        >
          + Adicionar rendimento
        </button>
      )}
    </fieldset>
  );
}

export default RendimentosFields;
