package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Usuario cadastrarCliente(Usuario usuario) {
        return cadastrar(usuario, "CLIENTE");
    }

    public Usuario cadastrarAgente(Usuario usuario) {
        return cadastrar(usuario, "AGENTE");
    }

    private Usuario cadastrar(Usuario usuario, String tipo) {

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome e obrigatorio.");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("O email e obrigatorio.");
        }

        if (usuario.getSenha() == null || usuario.getSenha().length() < 8) {
            throw new IllegalArgumentException(
                "A senha deve possuir pelo menos 8 caracteres."
            );
        }

        usuario.setEmail(usuario.getEmail().trim().toLowerCase());

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException(
                "Este email ja esta cadastrado."
            );
        }

        // CPF obrigatório para clientes
        if ("CLIENTE".equals(tipo)) {

            if (usuario.getCpf() == null || usuario.getCpf().isBlank()) {
                throw new IllegalArgumentException(
                    "O CPF e obrigatorio."
                );
            }

            String cpf = usuario.getCpf().replaceAll("\\D", "");

            if (!cpfValido(cpf)) {
                throw new IllegalArgumentException(
                    "O CPF informado e invalido."
                );
            }

            if (usuarioRepository.existsByCpf(cpf)) {
                throw new IllegalArgumentException(
                    "Este CPF ja esta cadastrado."
                );
            }

            usuario.setCpf(cpf);

        } else {
            // Agentes podem não possuir CPF cadastrado.
            if (usuario.getCpf() != null && !usuario.getCpf().isBlank()) {

                String cpf = usuario.getCpf().replaceAll("\\D", "");

                if (!cpfValido(cpf)) {
                    throw new IllegalArgumentException(
                        "O CPF informado e invalido."
                    );
                }

                if (usuarioRepository.existsByCpf(cpf)) {
                    throw new IllegalArgumentException(
                        "Este CPF ja esta cadastrado."
                    );
                }

                usuario.setCpf(cpf);
            } else {
                usuario.setCpf(null);
            }
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setTipo(tipo);

        return usuarioRepository.save(usuario);
    }

    private boolean cpfValido(String cpf) {

        if (cpf == null || !cpf.matches("\\d{11}")) {
            return false;
        }

        // Rejeita CPFs com todos os números iguais.
        if (cpf.chars().distinct().count() == 1) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }

        int resto = soma % 11;
        int primeiroDigito = resto < 2 ? 0 : 11 - resto;

        if (primeiroDigito != Character.getNumericValue(cpf.charAt(9))) {
            return false;
        }

        soma = 0;

        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }

        resto = soma % 11;
        int segundoDigito = resto < 2 ? 0 : 11 - resto;

        return segundoDigito == Character.getNumericValue(cpf.charAt(10));
    }

    public Usuario autenticar(String email, String senha) {

        email = email.trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() ->
                new IllegalArgumentException("Email ou senha incorretos.")
            );

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new IllegalArgumentException("Email ou senha incorretos.");
        }

        return usuario;
    }
}