import "./SolicitacaoCliente.css";
function SolicitacaoCliente({
  solicitacao,
  automoveis,
  solicitacaoEdicao,
  automovelIdEdicao,
  setAutomovelIdEdicao,
  dataInicioEdicao,
  setDataInicioEdicao,
  dataFimEdicao,
  setDataFimEdicao,
  iniciarEdicao,
  cancelarEdicao,
  salvarEdicao,
  cancelarSolicitacao,
  contratos,
  consultarContrato,
  baixarContrato,
  solicitacaoContrato,
  setSolicitacaoContrato,
  empresas = [],
  empresaId,
  setEmpresaId,
  valorTotal,
  setValorTotal,
  gerarContrato
}) {
  return (
    <article className="solicitacao-card">
      <h3>
        {solicitacao.marca} {solicitacao.modelo}
      </h3>

      <p>Solicitação: {solicitacao.id}</p>
      <p>Início: {solicitacao.dataInicio}</p>
      <p>Término: {solicitacao.dataFim}</p>

      <p>
        Status:{" "}
        <span className={`status status-${solicitacao.status}`}>
          {solicitacao.status}
        </span>
      </p>

      {solicitacao.parecerFinanceiro && (
        <p>
          Parecer financeiro: {solicitacao.parecerFinanceiro}
        </p>
      )}


      {/* AÇÕES PARA SOLICITAÇÕES PENDENTES */}
      {solicitacao.status === "PENDENTE" && (
        <div className="solicitacao-acoes">
          <button
            type="button"
            className="botao-editar"
            onClick={() => iniciarEdicao(solicitacao)}
          >
            Editar solicitação
          </button>

          <button
            type="button"
            className="botao-perigo"
            onClick={() => cancelarSolicitacao(solicitacao.id)}
          >
            Cancelar solicitação
          </button>
        </div>
      )}


      {/* FORMULÁRIO DE EDIÇÃO */}
      {solicitacaoEdicao === solicitacao.id && (
        <form
          className="cliente-form cliente-subform"
          onSubmit={salvarEdicao}
        >
          <h4>Editar solicitação #{solicitacao.id}</h4>

          <label>Automóvel:</label>

          <select
            value={automovelIdEdicao}
            onChange={(event) =>
              setAutomovelIdEdicao(event.target.value)
            }
            required
          >
            <option value="">Selecione um automóvel</option>

            {automoveis.map((automovel) => (
              <option key={automovel.id} value={automovel.id}>
                {automovel.marca} {automovel.modelo}
              </option>
            ))}
          </select>

          <label>Data de início:</label>

          <input
            type="date"
            value={dataInicioEdicao}
            onChange={(event) =>
              setDataInicioEdicao(event.target.value)
            }
            required
          />

          <label>Data de término:</label>

          <input
            type="date"
            value={dataFimEdicao}
            onChange={(event) =>
              setDataFimEdicao(event.target.value)
            }
            required
          />

          <button type="submit">Salvar alterações</button>

          <button
            type="button"
            className="botao-secundario"
            onClick={cancelarEdicao}
          >
            Voltar
          </button>
        </form>
      )}

      {/* CONTRATO DE SOLICITAÇÕES APROVADAS */}
      {solicitacao.status === "APROVADA" && (
        <div className="solicitacao-acoes">
          {contratos[solicitacao.id] ? (
            <div className="cliente-subform">
              <h4>
                Contrato #{contratos[solicitacao.id].id}
              </h4>

              <p>
                Contratante:{" "}
                {contratos[solicitacao.id].nomeContratante}
              </p>

              <p>
                Profissão: {contratos[solicitacao.id].profissao}
              </p>

              {contratos[solicitacao.id].empresa && (
                <p>Empresa: {contratos[solicitacao.id].empresa}</p>
              )}

              <p>
                Status: {contratos[solicitacao.id].status}
              </p>

              <button
                type="button"
                onClick={() =>
                  baixarContrato(contratos[solicitacao.id].id)
                }
              >
                Baixar contrato PDF
              </button>
            </div>
          ) : (
            <>

              <button
                type="button"
                className="botao-consultar"
                onClick={() => consultarContrato(solicitacao.id)}
              >
                Consultar contrato
              </button>

              <button
                type="button"
                className="botao-gerar"
                onClick={() => setSolicitacaoContrato(solicitacao.id)}
              >
                Gerar contrato
              </button>

            </>
          )}
        </div>
      )}

      {/* FORMULÁRIO PARA GERAR CONTRATO */}
      {solicitacaoContrato === solicitacao.id && (
        <form
          className="cliente-form cliente-subform"
          onSubmit={(event) => {
            event.preventDefault();
            gerarContrato(solicitacao.id);
          }}
        >
          <h4>Dados do contrato</h4>

          <p>
            Seus dados (nome, CPF, RG, endereço, profissão e rendimentos)
            serão obtidos do seu cadastro.
          </p>

          <label htmlFor={`empresa-${solicitacao.id}`}>
            Empresa locadora (opcional):
          </label>

          <select
            id={`empresa-${solicitacao.id}`}
            value={empresaId}
            onChange={(event) => setEmpresaId(event.target.value)}
          >
            <option value="">Nenhuma</option>

            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.razaoSocial}
              </option>
            ))}
          </select>

          <label htmlFor={`valor-total-${solicitacao.id}`}>
            Valor total (opcional):
          </label>

          <input
            id={`valor-total-${solicitacao.id}`}
            type="number"
            min="0.01"
            step="0.01"
            value={valorTotal}
            onChange={(event) => setValorTotal(event.target.value)}
          />

          <button type="submit">Confirmar contrato</button>

          <button
            type="button"
            className="botao-secundario"
            onClick={() => setSolicitacaoContrato(null)}
          >
            Cancelar
          </button>
        </form>
      )}
    </article>
  );
}

export default SolicitacaoCliente;
