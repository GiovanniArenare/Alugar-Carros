import "./AutomoveisCliente.css";
function AutomoveisCliente({ automoveis }) {
  return (
    <section className="cliente-section" id="automoveis">
      <div className="cliente-section-header">
        <span className="cliente-etiqueta">NOSSA FROTA</span>
        <h2>Automóveis disponíveis</h2>
        <p>Confira os veículos cadastrados no sistema.</p>
      </div>

      {automoveis.length === 0 ? (
        <p>Nenhum automóvel cadastrado no momento.</p>
      ) : (
        <div className="automoveis-grid">
          {automoveis.map((automovel) => (
            <article className="automovel-card" key={automovel.id}>
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
  );
}

export default AutomoveisCliente;
