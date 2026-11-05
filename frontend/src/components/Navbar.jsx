
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fazerLogout } from "../services/api";
import "./Navbar.css";

function Navbar({ usuario, tipo }) {
  const navigate = useNavigate();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    if (saindo) return;

    setSaindo(true);

    try {
      await fazerLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      window.alert(error.message || "Não foi possível sair da conta.");
      setSaindo(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a className="navbar-logo" href="#">
          <span className="navbar-logo-icone">A</span>
          <span>ALUGA<span>CAR</span></span>
        </a>

        <div className="navbar-conta">
          <div className="navbar-usuario">
            <span className="navbar-avatar">
              {(usuario?.email || "U").charAt(0).toUpperCase()}
            </span>

            <div className="navbar-usuario-info">
              <strong>{usuario?.email || "Usuário"}</strong>
              <span>{tipo === "AGENTE" ? "Agente" : "Cliente"}</span>
            </div>
          </div>

          <button
            className="navbar-sair"
            type="button"
            onClick={sair}
            disabled={saindo}
          >
            {saindo ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
