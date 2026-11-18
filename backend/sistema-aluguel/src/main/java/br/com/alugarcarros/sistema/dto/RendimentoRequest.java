package br.com.alugarcarros.sistema.dto;

import java.math.BigDecimal;

public record RendimentoRequest(
    String entidadeEmpregadora,
    BigDecimal valor
) {
}
