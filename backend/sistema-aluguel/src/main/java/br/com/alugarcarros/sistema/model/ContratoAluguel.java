
package br.com.alugarcarros.sistema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contratos_aluguel")
public class ContratoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false, unique = true)
    private SolicitacaoAluguel solicitacao;

    @Column(nullable = false, length = 150)
    private String nomeContratante;

    @Column(length = 100)
    private String profissao;

    private BigDecimal rendaMensal;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusContrato status;

    public ContratoAluguel() {
    }

    @PrePersist
    public void prePersist() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }

        if (status == null) {
            status = StatusContrato.AGUARDANDO_ASSINATURA;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SolicitacaoAluguel getSolicitacao() { return solicitacao; }
    public void setSolicitacao(SolicitacaoAluguel solicitacao) { this.solicitacao = solicitacao; }

    public String getNomeContratante() { return nomeContratante; }
    public void setNomeContratante(String nomeContratante) { this.nomeContratante = nomeContratante; }

    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }

    public BigDecimal getRendaMensal() { return rendaMensal; }
    public void setRendaMensal(BigDecimal rendaMensal) { this.rendaMensal = rendaMensal; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public StatusContrato getStatus() { return status; }
    public void setStatus(StatusContrato status) { this.status = status; }
}
