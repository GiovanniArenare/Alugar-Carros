package br.com.alugarcarros.sistema.dto;

public record EnderecoRequest(
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String uf
) {
}
