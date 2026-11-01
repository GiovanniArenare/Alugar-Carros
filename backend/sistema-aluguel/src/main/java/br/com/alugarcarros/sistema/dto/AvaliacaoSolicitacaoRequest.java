
package br.com.alugarcarros.sistema.dto;

public class AvaliacaoSolicitacaoRequest {

    private String status;
    private String parecerFinanceiro;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getParecerFinanceiro() {
        return parecerFinanceiro;
    }

    public void setParecerFinanceiro(String parecerFinanceiro) {
        this.parecerFinanceiro = parecerFinanceiro;
    }
}
