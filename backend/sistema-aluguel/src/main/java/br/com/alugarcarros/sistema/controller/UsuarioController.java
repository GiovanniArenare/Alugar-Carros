
package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.LoginRequest;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final String chaveAdministrativa;

    private final SecurityContextRepository securityContextRepository =
        new HttpSessionSecurityContextRepository();

    public UsuarioController(
        UsuarioService usuarioService,
        @Value("${APP_ADMIN_KEY:}") String chaveAdministrativa
    ) {
        this.usuarioService = usuarioService;
        this.chaveAdministrativa = chaveAdministrativa;
    }

    // Consulta o usuario autenticado na sessao atual
    @GetMapping("/me")
    public ResponseEntity<?> usuarioAtual(Authentication autenticacao) {

        String tipo = autenticacao.getAuthorities()
            .stream()
            .findFirst()
            .map(authority -> authority.getAuthority().replace("ROLE_", ""))
            .orElse("DESCONHECIDO");

        return ResponseEntity.ok(
            Map.of(
                "email", autenticacao.getName(),
                "tipo", tipo,
                "autenticado", true
            )
        );
    }

    // Cadastro de cliente
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {

        try {
            Usuario usuarioSalvo = usuarioService.cadastrarCliente(usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "mensagem", "Usuario cadastrado com sucesso!",
                    "id", usuarioSalvo.getId(),
                    "nome", usuarioSalvo.getNome(),
                    "email", usuarioSalvo.getEmail(),
                    "tipo", usuarioSalvo.getTipo()
                )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Cadastro de agente protegido por chave administrativa
    @PostMapping("/agente")
    public ResponseEntity<?> cadastrarAgente(
        @RequestBody Usuario usuario,
        @RequestHeader(
            value = "X-Codigo-Administrativo",
            required = false
        ) String codigo
    ) {

        if (chaveAdministrativa.isBlank() ||
            !chaveAdministrativa.equals(codigo)) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("erro", "Acesso nao autorizado.")
            );
        }

        try {
            Usuario usuarioSalvo = usuarioService.cadastrarAgente(usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "mensagem", "Agente cadastrado com sucesso!",
                    "id", usuarioSalvo.getId(),
                    "nome", usuarioSalvo.getNome(),
                    "email", usuarioSalvo.getEmail(),
                    "tipo", usuarioSalvo.getTipo()
                )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Login com criacao de sessao autenticada
    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginRequest dados,
        HttpServletRequest request,
        HttpServletResponse response
    ) {

        try {
            Usuario usuario = usuarioService.autenticar(
                dados.getEmail(),
                dados.getSenha()
            );

            var autenticacao =
                UsernamePasswordAuthenticationToken.authenticated(
                    usuario.getEmail(),
                    null,
                    List.of(
                        new SimpleGrantedAuthority(
                            "ROLE_" + usuario.getTipo()
                        )
                    )
                );

            SecurityContext contexto =
                SecurityContextHolder.createEmptyContext();

            contexto.setAuthentication(autenticacao);
            SecurityContextHolder.setContext(contexto);

            securityContextRepository.saveContext(
                contexto,
                request,
                response
            );

            return ResponseEntity.ok(
                Map.of(
                    "mensagem", "Login realizado com sucesso!",
                    "id", usuario.getId(),
                    "nome", usuario.getNome(),
                    "email", usuario.getEmail(),
                    "tipo", usuario.getTipo()
                )
            );

        } catch (IllegalArgumentException e) {
            SecurityContextHolder.clearContext();

            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        HttpSession sessao = request.getSession(false);

        if (sessao != null) {
            sessao.invalidate();
        }

        return ResponseEntity.ok(
            Map.of("mensagem", "Logout realizado com sucesso!")
        );
    }
}
