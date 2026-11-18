import { useState } from "react";
import { formatarCNPJ, somenteDigitos } from "../../utils/formatadores";

function CadastrosAgente({ bancos, empresas, onCadastrarBanco, onCadastrarEmpresa }) {
  const [banco, setBanco] = useState({ nome: "", codigo: "", cnpj: "" });
  const [empresa, setEmpresa] = useState({ razaoSocial: "", cnpj: "" });

  async function enviarBanco(event) {
    event.preventDefault();

    const sucesso = await onCadastrarBanco({
      ...banco,
      cnpj: somenteDigitos(banco.cnpj)
    });

    if (sucesso) setBanco({ nome: "", codigo: "", cnpj: "" });
  }

  async function enviarEmpresa(event) {
    event.preventDefault();

    const sucesso = await onCadastrarEmpresa({
      ...empresa,
      cnpj: somenteDigitos(empresa.cnpj)
    });

    if (sucesso) setEmpresa({ razaoSocial: "", cnpj: "" });
  }

  return (
    <section className="agente-section" id="parceiros">
      <div className="agente-section-header">
        <span className="agente-section-etiqueta">PARCEIROS</span>
        <h2>Bancos e empresas</h2>
        <p>
          Cadastre os bancos que concedem crédito e as empresas locadoras
          associadas aos contratos.
        </p>
      </div>

      <div className="agente-cadastros-grid">
        <article className="agente-cadastro-card">
          <h3>Bancos ({bancos.length})</h3>

          <form className="agente-cadastro-form" onSubmit={enviarBanco}>
            <input
              type="text"
              placeholder="Nome do banco"
              value={banco.nome}
              onChange={(e) => setBanco({ ...banco, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Código (ex.: 001)"
              maxLength={10}
              value={banco.codigo}
              onChange={(e) => setBanco({ ...banco, codigo: e.target.value })}
              required
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="CNPJ"
              maxLength={18}
              value={banco.cnpj}
              onChange={(e) =>
                setBanco({ ...banco, cnpj: formatarCNPJ(e.target.value) })
              }
              required
            />
            <button className="botao-principal" type="submit">
              Cadastrar banco
            </button>
          </form>

          <ul className="agente-lista-simples">
            {bancos.map((item) => (
              <li key={item.id}>
                <strong>{item.nome}</strong>
                <span>
                  Cód. {item.codigo} · {formatarCNPJ(item.cnpj)}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="agente-cadastro-card">
          <h3>Empresas ({empresas.length})</h3>

          <form className="agente-cadastro-form" onSubmit={enviarEmpresa}>
            <input
              type="text"
              placeholder="Razão social"
              value={empresa.razaoSocial}
              onChange={(e) =>
                setEmpresa({ ...empresa, razaoSocial: e.target.value })
              }
              required
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="CNPJ"
              maxLength={18}
              value={empresa.cnpj}
              onChange={(e) =>
                setEmpresa({ ...empresa, cnpj: formatarCNPJ(e.target.value) })
              }
              required
            />
            <button className="botao-principal" type="submit">
              Cadastrar empresa
            </button>
          </form>

          <ul className="agente-lista-simples">
            {empresas.map((item) => (
              <li key={item.id}>
                <strong>{item.razaoSocial}</strong>
                <span>{formatarCNPJ(item.cnpj)}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default CadastrosAgente;
