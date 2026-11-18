import { formatarCEP } from "../utils/formatadores";

function EnderecoFields({ endereco, onChange }) {
  function atualizar(campo, valor) {
    onChange({ ...endereco, [campo]: valor });
  }

  return (
    <fieldset className="form-secao">
      <legend>Endereço</legend>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cep">CEP</label>
          <input
            id="cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            maxLength={9}
            value={endereco.cep}
            onChange={(e) => atualizar("cep", formatarCEP(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="uf">UF</label>
          <input
            id="uf"
            type="text"
            placeholder="MG"
            maxLength={2}
            value={endereco.uf}
            onChange={(e) => atualizar("uf", e.target.value.toUpperCase())}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="logradouro">Logradouro</label>
        <input
          id="logradouro"
          type="text"
          placeholder="Rua, avenida..."
          value={endereco.logradouro}
          onChange={(e) => atualizar("logradouro", e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="numero">Número</label>
          <input
            id="numero"
            type="text"
            value={endereco.numero}
            onChange={(e) => atualizar("numero", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="complemento">Complemento</label>
          <input
            id="complemento"
            type="text"
            placeholder="Opcional"
            value={endereco.complemento}
            onChange={(e) => atualizar("complemento", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input
            id="bairro"
            type="text"
            value={endereco.bairro}
            onChange={(e) => atualizar("bairro", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            id="cidade"
            type="text"
            value={endereco.cidade}
            onChange={(e) => atualizar("cidade", e.target.value)}
            required
          />
        </div>
      </div>
    </fieldset>
  );
}

export default EnderecoFields;
