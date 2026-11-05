import "./FormularioAluguel.css";
function FormularioAluguel({
  automoveis,
  automovelId,
  setAutomovelId,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onSubmit
}) {
  return (
    <section className="cliente-section" id="solicitar">
      <div className="cliente-section-header">
        <span className="cliente-etiqueta">RESERVA</span>
        <h2>Solicitar aluguel</h2>
        <p>Preencha os dados para solicitar um automóvel.</p>
      </div>

      <form className="cliente-form" onSubmit={onSubmit}>
        <label htmlFor="automovelId">Automóvel:</label>

        <select
          id="automovelId"
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

        <label htmlFor="dataInicio">Data de início:</label>

        <input
          id="dataInicio"
          type="date"
          value={dataInicio}
          onChange={(event) => setDataInicio(event.target.value)}
          required
        />

        <label htmlFor="dataFim">Data de término:</label>

        <input
          id="dataFim"
          type="date"
          value={dataFim}
          onChange={(event) => setDataFim(event.target.value)}
          required
        />

        <button type="submit" disabled={automoveis.length === 0}>
          Solicitar aluguel
        </button>
      </form>
    </section>
  );
}

export default FormularioAluguel;
