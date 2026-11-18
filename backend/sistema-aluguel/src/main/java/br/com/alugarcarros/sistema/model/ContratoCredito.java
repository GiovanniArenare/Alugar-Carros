package br.com.alugarcarros.sistema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Contrato de credito concedido por um banco para financiar um contrato
 * de aluguel.
 */
@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_aluguel_id", nullable = false, unique = true)
    private ContratoAluguel contratoAluguel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banco_id", nullable = false)
    private Banco banco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id", nullable = false)
    private Usuario agenteResponsavel;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valorFinanciado;

    // Taxa em percentual ao mes (ex.: 1.99 = 1,99% a.m.)
    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal taxaJurosMensal;

    @Column(nullable = false)
    private Integer numeroParcelas;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valorParcela;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusContrato status;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    public ContratoCredito() {
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

    public ContratoAluguel getContratoAluguel() { return contratoAluguel; }
    public void setContratoAluguel(ContratoAluguel contratoAluguel) {
        this.contratoAluguel = contratoAluguel;
    }

    public Banco getBanco() { return banco; }
    public void setBanco(Banco banco) { this.banco = banco; }

    public Usuario getAgenteResponsavel() { return agenteResponsavel; }
    public void setAgenteResponsavel(Usuario agenteResponsavel) {
        this.agenteResponsavel = agenteResponsavel;
    }

    public BigDecimal getValorFinanciado() { return valorFinanciado; }
    public void setValorFinanciado(BigDecimal valorFinanciado) {
        this.valorFinanciado = valorFinanciado;
    }

    public BigDecimal getTaxaJurosMensal() { return taxaJurosMensal; }
    public void setTaxaJurosMensal(BigDecimal taxaJurosMensal) {
        this.taxaJurosMensal = taxaJurosMensal;
    }

    public Integer getNumeroParcelas() { return numeroParcelas; }
    public void setNumeroParcelas(Integer numeroParcelas) {
        this.numeroParcelas = numeroParcelas;
    }

    public BigDecimal getValorParcela() { return valorParcela; }
    public void setValorParcela(BigDecimal valorParcela) {
        this.valorParcela = valorParcela;
    }

    public StatusContrato getStatus() { return status; }
    public void setStatus(StatusContrato status) { this.status = status; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
