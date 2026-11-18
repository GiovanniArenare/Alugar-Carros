function ResumoAgente({ automoveis, pendentes, aprovadas, recusadas }) {
  const cards = [
    { icone: "🚗", classe: "", titulo: "Automóveis", valor: automoveis, legenda: "Veículos cadastrados" },
    { icone: "◷", classe: "pendente", titulo: "Pendentes", valor: pendentes, legenda: "Aguardando avaliação" },
    { icone: "✓", classe: "aprovada", titulo: "Aprovadas", valor: aprovadas, legenda: "Liberadas para contratação" },
    { icone: "×", classe: "recusada", titulo: "Recusadas", valor: recusadas, legenda: "Solicitações recusadas" }
  ];

  return (
    <section className="agente-resumo">
      {cards.map((card) => (
        <article className="agente-resumo-card" key={card.titulo}>
          <div className={`agente-resumo-icone ${card.classe}`.trim()}>
            {card.icone}
          </div>
          <div>
            <span>{card.titulo}</span>
            <strong>{card.valor}</strong>
            <small>{card.legenda}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ResumoAgente;
