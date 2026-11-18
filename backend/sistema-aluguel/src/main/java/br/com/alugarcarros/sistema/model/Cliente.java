package br.com.alugarcarros.sistema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Dados pessoais e financeiros do cliente. A conta de acesso (nome, e-mail,
 * senha e tipo) fica em {@link Usuario}; aqui ficam os dados exigidos para
 * a analise financeira do aluguel.
 */
@Entity
@Table(name = "clientes")
public class Cliente {

    public static final int MAX_RENDIMENTOS = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, length = 100)
    private String profissao;

    @Embedded
    private Endereco endereco;

    @OneToMany(
        mappedBy = "cliente",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Rendimento> rendimentos = new ArrayList<>();

    public Cliente() {
    }

    public void adicionarRendimento(Rendimento rendimento) {
        if (rendimentos.size() >= MAX_RENDIMENTOS) {
            throw new IllegalArgumentException(
                "Sao permitidos no maximo " + MAX_RENDIMENTOS
                + " rendimentos por cliente."
            );
        }

        rendimento.setCliente(this);
        rendimentos.add(rendimento);
    }

    public BigDecimal getRendaTotal() {
        return rendimentos.stream()
            .map(Rendimento::getValor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }

    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public List<Rendimento> getRendimentos() { return rendimentos; }
}
