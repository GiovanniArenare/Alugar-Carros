package br.com.alugarcarros.sistema.dto;

public record CadastroAgenteRequest(
    String nome,
    String email,
    String senha
) {
}
