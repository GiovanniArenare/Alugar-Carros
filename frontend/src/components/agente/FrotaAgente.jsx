import { useState } from "react";

const AUTOMOVEIS_POR_PAGINA = 6;

function FrotaAgente({ automoveis, onNovo, onEditar, onExcluir }) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(
    1,
    Math.ceil(automoveis.length / AUTOMOVEIS_POR_PAGINA)
  );

  // Evita permanecer em uma página que deixou de existir.
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * AUTOMOVEIS_POR_PAGINA;
  const visiveis = automoveis.slice(inicio, inicio + AUTOMOVEIS_POR_PAGINA);

  return (
    <section className="agente-section" id="automoveis">
      <div className="agente-section-topo">
        <div className="agente-section-header">
          <span className="agente-section-etiqueta">FROTA</span>
          <h2>Automóveis cadastrados</h2>
          <p>Visualize e gerencie os veículos disponíveis no sistema.</p>
        </div>

        <button className="botao-principal" type="button" onClick={onNovo}>
          <span>+</span> Cadastrar automóvel
        </button>
      </div>

      {automoveis.length === 0 ? (
        <div className="agente-vazio">
          <span>🚗</span>
          <h3>Nenhum automóvel cadastrado</h3>
          <p>Cadastre o primeiro veículo para começar a gerenciar a frota.</p>
        </div>
      ) : (
        <>
          <div className="agente-automoveis-grid">
            {visiveis.map((automovel) => (
              <article className="agente-automovel-card" key={automovel.id}>
                <div className="automovel-card-topo">
                  <span className="automovel-etiqueta">{automovel.ano}</span>
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
                    onClick={() => onEditar(automovel)}
                  >
                    Editar
                  </button>

                  <button
                    className="botao-perigo"
                    type="button"
                    onClick={() => onExcluir(automovel.id)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="automoveis-paginacao">
              <button
                type="button"
                className="paginacao-botao"
                disabled={paginaAtual === 1}
                onClick={() => setPagina(paginaAtual - 1)}
              >
                ← Anterior
              </button>

              <span>
                Página <strong>{paginaAtual}</strong> de{" "}
                <strong>{totalPaginas}</strong>
              </span>

              <button
                type="button"
                className="paginacao-botao"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPagina(paginaAtual + 1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default FrotaAgente;
