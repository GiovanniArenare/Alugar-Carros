import { useEffect, useState } from "react";
import {
  buscarContratoPorSolicitacao,
  buscarCredito,
  criarCredito
} from "../services/agenteApi";
import { formatarMoeda } from "../utils/formatadores";
import "./AutomovelModal.css";

function CreditoModal({ solicitacao, bancos, onFechar, onRegistrado }) {
  const [carregando, setCarregando] = useState(true);
  const [contrato, setContrato] = useState(null);
  const [credito, setCredito] = useState(null);
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [bancoId, setBancoId] = useState("");
  const [valorFinanciado, setValorFinanciado] = useState("");
  const [taxaJurosMensal, setTaxaJurosMensal] = useState("");
  const [numeroParcelas, setNumeroParcelas] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const contratoEncontrado = await buscarContratoPorSolicitacao(
          solicitacao.id
        );

        const creditoExistente = await buscarCredito(contratoEncontrado.id);

        if (!ativo) return;

        setContrato(contratoEncontrado);
        setCredito(creditoExistente);
      } catch (error) {
        if (!ativo) return;

        setAviso(
          error.status === 404
            ? "O cliente ainda não gerou o contrato de aluguel desta solicitação."
            : error.message
        );
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [solicitacao.id]);

  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === "Escape") onFechar();
    }

    window.addEventListener("keydown", fecharComEsc);

    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  async function enviar(event) {
    event.preventDefault();
    setAviso("");
    setEnviando(true);

    try {
      const criado = await criarCredito({
        contratoId: contrato.id,
        bancoId: Number(bancoId),
        valorFinanciado: Number(valorFinanciado),
        taxaJurosMensal: Number(taxaJurosMensal),
        numeroParcelas: Number(numeroParcelas)
      });

      setCredito(criado);
      onRegistrado();
    } catch (error) {
      setAviso(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="automovel-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <section
        className="automovel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credito-modal-titulo"
      >
        <header className="automovel-modal-header">
          <div>
            <span className="automovel-modal-etiqueta">CRÉDITO</span>
            <h2 id="credito-modal-titulo">
              Contrato de crédito — Solicitação #{solicitacao.id}
            </h2>
            <p>Financiamento do aluguel concedido por um banco parceiro.</p>
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

        {carregando && <p>Carregando...</p>}

        {!carregando && aviso && (
          <p className="erro-mensagem" role="alert">
            {aviso}
          </p>
        )}

        {!carregando && credito && (
          <div className="agente-credito-resumo">
            <p>
              <strong>Banco:</strong> {credito.bancoNome}
            </p>
            <p>
              <strong>Valor financiado:</strong>{" "}
              {formatarMoeda(credito.valorFinanciado)}
            </p>
            <p>
              <strong>Juros:</strong> {credito.taxaJurosMensal}% ao mês
            </p>
            <p>
              <strong>Parcelas:</strong> {credito.numeroParcelas} x{" "}
              {formatarMoeda(credito.valorParcela)}
            </p>
            <p>
              <strong>Status:</strong> {credito.status}
            </p>
          </div>
        )}

        {!carregando && contrato && !credito && (
          <form className="automovel-modal-form" onSubmit={enviar}>
            <div className="automovel-modal-grid">
              <div className="agente-campo automovel-modal-campo-completo">
                <label htmlFor="credito-banco">Banco</label>
                <select
                  id="credito-banco"
                  value={bancoId}
                  onChange={(e) => setBancoId(e.target.value)}
                  required
                >
                  <option value="">Selecione um banco</option>
                  {bancos.map((banco) => (
                    <option key={banco.id} value={banco.id}>
                      {banco.nome} ({banco.codigo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="agente-campo">
                <label htmlFor="credito-valor">Valor financiado (R$)</label>
                <input
                  id="credito-valor"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={valorFinanciado}
                  onChange={(e) => setValorFinanciado(e.target.value)}
                  required
                />
              </div>

              <div className="agente-campo">
                <label htmlFor="credito-taxa">Juros (% ao mês)</label>
                <input
                  id="credito-taxa"
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxaJurosMensal}
                  onChange={(e) => setTaxaJurosMensal(e.target.value)}
                  required
                />
              </div>

              <div className="agente-campo automovel-modal-campo-completo">
                <label htmlFor="credito-parcelas">Número de parcelas</label>
                <input
                  id="credito-parcelas"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  value={numeroParcelas}
                  onChange={(e) => setNumeroParcelas(e.target.value)}
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

              <button
                className="botao-principal"
                type="submit"
                disabled={enviando || bancos.length === 0}
              >
                {enviando ? "Registrando..." : "Registrar crédito"}
              </button>
            </footer>

            {bancos.length === 0 && (
              <p className="erro-mensagem">
                Cadastre um banco na seção &quot;Bancos e empresas&quot; antes
                de registrar o crédito.
              </p>
            )}
          </form>
        )}
      </section>
    </div>
  );
}

export default CreditoModal;
