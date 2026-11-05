
import { useEffect, useState } from "react";
import "./AutomovelModal.css";

function AutomovelModal({ automovel, onFechar, onSalvar }) {
  const [matricula, setMatricula] = useState("");
  const [ano, setAno] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");

  const editando = Boolean(automovel);

  useEffect(() => {
    if (automovel) {
      setMatricula(automovel.matricula || "");
      setAno(String(automovel.ano || ""));
      setMarca(automovel.marca || "");
      setModelo(automovel.modelo || "");
      setPlaca(automovel.placa || "");
    }
  }, [automovel]);

  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === "Escape") {
        onFechar();
      }
    }

    window.addEventListener("keydown", fecharComEsc);

    return () => {
      window.removeEventListener("keydown", fecharComEsc);
    };
  }, [onFechar]);

  function enviarFormulario(event) {
    event.preventDefault();

    onSalvar({
      matricula,
      ano: Number(ano),
      marca,
      modelo,
      placa
    });
  }

  return (
    <div
      className="automovel-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onFechar();
        }
      }}
    >
      <section
        className="automovel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="automovel-modal-titulo"
      >
        <header className="automovel-modal-header">
          <div>
            <span className="automovel-modal-etiqueta">ALUGACAR</span>

            <h2 id="automovel-modal-titulo">
              {editando ? "Editar automóvel" : "Cadastrar automóvel"}
            </h2>

            <p>
              {editando
                ? "Atualize as informações do veículo."
                : "Preencha os dados para adicionar um veículo."}
            </p>
          </div>

          <button
            type="button"
            className="automovel-modal-fechar"
            onClick={onFechar}
            aria-label="Fechar janela"
          >
            ×
          </button>
        </header>

        <form className="automovel-modal-form" onSubmit={enviarFormulario}>
          <div className="automovel-modal-grid">
            <div className="agente-campo">
              <label htmlFor="modal-matricula">Matrícula</label>
              <input
                id="modal-matricula"
                type="text"
                value={matricula}
                onChange={(event) => setMatricula(event.target.value)}
                disabled={editando}
                required
              />
            </div>

            <div className="agente-campo">
              <label htmlFor="modal-ano">Ano</label>
              <input
                id="modal-ano"
                type="number"
                min="1900"
                value={ano}
                onChange={(event) => setAno(event.target.value)}
                required
              />
            </div>

            <div className="agente-campo">
              <label htmlFor="modal-marca">Marca</label>
              <input
                id="modal-marca"
                type="text"
                value={marca}
                onChange={(event) => setMarca(event.target.value)}
                required
              />
            </div>

            <div className="agente-campo">
              <label htmlFor="modal-modelo">Modelo</label>
              <input
                id="modal-modelo"
                type="text"
                value={modelo}
                onChange={(event) => setModelo(event.target.value)}
                required
              />
            </div>

            <div className="agente-campo automovel-modal-campo-completo">
              <label htmlFor="modal-placa">Placa</label>
              <input
                id="modal-placa"
                type="text"
                value={placa}
                onChange={(event) => setPlaca(event.target.value)}
                disabled={editando}
                required
              />
            </div>
          </div>

          <footer className="automovel-modal-acoes">
            <button
              className="botao-secundario"
              type="button"
              onClick={onFechar}
            >
              Cancelar
            </button>

            <button className="botao-principal" type="submit">
              {editando ? "Salvar alterações" : "Cadastrar automóvel"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default AutomovelModal;
