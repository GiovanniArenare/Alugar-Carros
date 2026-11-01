
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

    // Cadastro de cliente
    public Usuario cadastrarCliente(Usuario usuario) {
        return cadastrar(usuario, "CLIENTE");
    }

    // Cadastro de agente
    public Usuario cadastrarAgente(Usuario usuario) {
        return cadastrar(usuario, "AGENTE");
    }

    // Método compartilhado pelos dois tipos de cadastro
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

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setTipo(tipo);

        return usuarioRepository.save(usuario);
    }

    // Autenticação
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
