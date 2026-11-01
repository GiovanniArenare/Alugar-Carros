
package br.com.alugarcarros.sistema.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes_aluguel")
public class SolicitacaoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacao status;

    @Column(length = 1000)
    private String parecerFinanceiro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_id")
    private Usuario agenteAvaliador;

    private LocalDateTime dataCriacao;

    private LocalDateTime dataAvaliacao;

    public SolicitacaoAluguel() {
    }

    @PrePersist
    public void prePersist() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }

        if (status == null) {
            status = StatusSolicitacao.PENDENTE;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Automovel getAutomovel() {
        return automovel;
    }

    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        this.status = status;
    }

    public String getParecerFinanceiro() {
        return parecerFinanceiro;
    }

    public void setParecerFinanceiro(String parecerFinanceiro) {
        this.parecerFinanceiro = parecerFinanceiro;
    }

    public Usuario getAgenteAvaliador() {
        return agenteAvaliador;
    }

    public void setAgenteAvaliador(Usuario agenteAvaliador) {
        this.agenteAvaliador = agenteAvaliador;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}
