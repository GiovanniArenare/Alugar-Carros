import { useState } from "react";
import Navbar from "../components/Navbar";
import Notificacao from "../components/Notificacao";
import AutomovelModal from "../components/AutomovelModal";
import CreditoModal from "../components/CreditoModal";
import ResumoAgente from "../components/agente/ResumoAgente";
import FrotaAgente from "../components/agente/FrotaAgente";
import SolicitacoesAgente from "../components/agente/SolicitacoesAgente";
import CadastrosAgente from "../components/agente/CadastrosAgente";
import useNotificacoes from "../hooks/useNotificacoes";
import useAgente from "../hooks/useAgente";
import "../components/Notificacao.css";
import "./Agente.css";

function Agente() {
  const notificacoes = useNotificacoes();
  const agente = useAgente(notificacoes);

  // undefined = modal fechado | null = novo automóvel | objeto = edição
  const [modalAutomovel, setModalAutomovel] = useState(undefined);
  const [solicitacaoCredito, setSolicitacaoCredito] = useState(null);

  async function salvarAutomovel(dados) {
    const sucesso = await agente.salvarAutomovel(dados, modalAutomovel);

    if (sucesso) setModalAutomovel(undefined);
  }

  function excluirAutomovel(id) {
    if (!window.confirm(`Tem certeza que deseja excluir o automóvel ${id}?`)) {
      return;
    }

    agente.excluirAutomovel(id);
  }

  if (agente.carregando) {
    return (
      <main className="agente-page">
        <div className="agente-carregando">
          <span className="agente-loading-icon"></span>
          <p>Carregando painel do agente...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="agente-page">
      <Navbar usuario={agente.usuario} tipo="AGENTE" />

      <div className="agente-container" id="inicio">
        {notificacoes.erro && (
          <Notificacao
            tipo="erro"
            mensagem={notificacoes.erro}
            onFechar={notificacoes.limparErro}
          />
        )}

        {notificacoes.mensagem && (
          <Notificacao
            tipo="sucesso"
            mensagem={notificacoes.mensagem}
            onFechar={notificacoes.limparMensagem}
          />
        )}

        <ResumoAgente
          automoveis={agente.automoveis.length}
          pendentes={agente.pendentes.length}
          aprovadas={agente.aprovadas.length}
          recusadas={agente.recusadas.length}
        />

        <FrotaAgente
          automoveis={agente.automoveis}
          onNovo={() => setModalAutomovel(null)}
          onEditar={setModalAutomovel}
          onExcluir={excluirAutomovel}
        />

        <SolicitacoesAgente
          pendentes={agente.pendentes}
          aprovadas={agente.aprovadas}
          recusadas={agente.recusadas}
          onAvaliar={agente.avaliarSolicitacao}
          onRegistrarCredito={setSolicitacaoCredito}
        />

        <CadastrosAgente
          bancos={agente.bancos}
          empresas={agente.empresas}
          onCadastrarBanco={agente.cadastrarBanco}
          onCadastrarEmpresa={agente.cadastrarEmpresa}
        />

        {modalAutomovel !== undefined && (
          <AutomovelModal
            automovel={modalAutomovel}
            onFechar={() => setModalAutomovel(undefined)}
            onSalvar={salvarAutomovel}
          />
        )}

        {solicitacaoCredito && (
          <CreditoModal
            solicitacao={solicitacaoCredito}
            bancos={agente.bancos}
            onFechar={() => setSolicitacaoCredito(null)}
            onRegistrado={() =>
              notificacoes.notificarSucesso(
                "Contrato de crédito registrado com sucesso!"
              )
            }
          />
        )}

        <footer className="agente-footer">
          <span>ALUGACAR</span>
          <p>Painel de gerenciamento de operações</p>
        </footer>
      </div>
    </main>
  );
}

export default Agente;
