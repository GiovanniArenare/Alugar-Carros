package br.com.alugarcarros.sistema.dto;

import java.math.BigDecimal;

public record ContratoCreditoRequest(
    Long contratoId,
    Long bancoId,
    BigDecimal valorFinanciado,
    BigDecimal taxaJurosMensal,
    Integer numeroParcelas
) {
}
