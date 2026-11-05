import { useEffect } from "react";

function Notificacao({ tipo, mensagem, onFechar }) {
  useEffect(() => {
    if (!mensagem) return;

    const temporizador = window.setTimeout(() => {
      onFechar();
    }, 5000);

    return () => window.clearTimeout(temporizador);
  }, [mensagem]);

  if (!mensagem) return null;

  return (
    <div
      className={`agente-toast agente-toast-${tipo}`}
      role={tipo === "erro" ? "alert" : "status"}
      aria-live="polite"
    >
      <span className="agente-toast-icone">
        {tipo === "erro" ? "!" : "✓"}
      </span>

      <p>{mensagem}</p>

      <button
        type="button"
        className="agente-toast-fechar"
        onClick={onFechar}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

export default Notificacao;
