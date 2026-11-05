
import "./NavegacaoCliente.css";

function NavegacaoCliente({ areaAtiva, onMudarArea }) {
  const areas = [
    {
      id: "automoveis",
      titulo: "Automóveis disponíveis",
      icone: "🚘"
    },
    {
      id: "solicitacoes",
      titulo: "Minhas solicitações",
      icone: "📋"
    }
  ];

  return (
    <nav className="cliente-navegacao">
      {areas.map((area) => (
        <button
          key={area.id}
          type="button"
          className={`cliente-nav-item ${
            areaAtiva === area.id ? "ativo" : ""
          }`}
          onClick={() => onMudarArea(area.id)}
        >
          <span>{area.icone}</span>
          {area.titulo}
        </button>
      ))}
    </nav>
  );
}

export default NavegacaoCliente;
