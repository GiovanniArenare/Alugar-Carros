
package br.com.alugarcarros.sistema.dto;

import java.math.BigDecimal;

public class ContratoAluguelRequest {

    private Long solicitacaoId;
    private String nomeContratante;
    private String profissao;
    private BigDecimal rendaMensal;

    public Long getSolicitacaoId() {
        return solicitacaoId;
    }

    public void setSolicitacaoId(Long solicitacaoId) {
        this.solicitacaoId = solicitacaoId;
    }

    public String getNomeContratante() {
        return nomeContratante;
    }

    public void setNomeContratante(String nomeContratante) {
        this.nomeContratante = nomeContratante;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public BigDecimal getRendaMensal() {
        return rendaMensal;
    }

    public void setRendaMensal(BigDecimal rendaMensal) {
        this.rendaMensal = rendaMensal;
    }
}
