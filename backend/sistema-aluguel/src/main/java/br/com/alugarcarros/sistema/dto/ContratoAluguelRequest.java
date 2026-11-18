package br.com.alugarcarros.sistema.dto;

import java.math.BigDecimal;

/**
 * Os dados do contratante (nome, profissao, renda) sao obtidos do cadastro
 * do cliente. Empresa e valor total sao opcionais.
 */
public record ContratoAluguelRequest(
    Long solicitacaoId,
    Long empresaId,
    BigDecimal valorTotal
) {
}
