import { useState } from "react";

export default function useNotificacoes() {
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function notificarSucesso(texto) {
    setErro("");
    setMensagem(texto);
  }

  function notificarErro(texto) {
    setMensagem("");
    setErro(texto);
  }

  return {
    erro,
    mensagem,
    notificarSucesso,
    notificarErro,
    limparErro: () => setErro(""),
    limparMensagem: () => setMensagem("")
  };
}
