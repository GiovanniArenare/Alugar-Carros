
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Cliente from "./pages/Cliente";
import Agente from "./pages/Agente";

import SideRays from "./components/SideRays";
import { buscarUsuarioAtual } from "./services/api";

function RotaProtegida({ tipoPermitido, children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarAutenticacao() {
      try {
        const dados = await buscarUsuarioAtual();
        setUsuario(dados);
      } catch {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }

    verificarAutenticacao();
  }, []);

  if (carregando) {
    return <p>Verificando autenticação...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.tipo !== tipoPermitido) {
    if (usuario.tipo === "AGENTE") {
      return <Navigate to="/agente" replace />;
    }

    if (usuario.tipo === "CLIENTE") {
      return <Navigate to="/cliente" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-background">
          <SideRays
            rayColor1="#ffd000"
            rayColor2="#ffd000"
            origin="top-right"
            speed={2.5}
            intensity={2}
            spread={2}
            density={5}
            followMouse={false}
            blend={0.5}
            sharpness={0.5}
            tilt={0}
            falloff={1.6}
            glow={1}
            saturation={1}
            dust={0}
            mouseInfluence={0.5}
            intro={false}
            lightMode={false}
            opacity={1}
          />
        </div>

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/cadastro" element={<Cadastro />} />

            <Route
              path="/cliente"
              element={
                <RotaProtegida tipoPermitido="CLIENTE">
                  <Cliente />
                </RotaProtegida>
              }
            />

            <Route
              path="/agente"
              element={
                <RotaProtegida tipoPermitido="AGENTE">
                  <Agente />
                </RotaProtegida>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
