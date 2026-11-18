package br.com.alugarcarros.sistema.dto;

import java.util.List;

public record CadastroClienteRequest(
    String nome,
    String email,
    String senha,
    String cpf,
    String rg,
    String profissao,
    EnderecoRequest endereco,
    List<RendimentoRequest> rendimentos
) {
}
