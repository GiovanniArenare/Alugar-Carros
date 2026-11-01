
package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.model.Automovel;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.service.AutomovelService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;
    private final UsuarioRepository usuarioRepository;

    public AutomovelController(
        AutomovelService automovelService,
        UsuarioRepository usuarioRepository
    ) {
        this.automovelService = automovelService;
        this.usuarioRepository = usuarioRepository;
    }

    // Cadastrar automovel
    @PostMapping
    public ResponseEntity<?> cadastrar(
        @RequestBody Automovel automovel,
        Authentication autenticacao
    ) {
        try {
            Usuario proprietario = usuarioRepository
                .findByEmail(autenticacao.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                    "Usuario nao encontrado."
                ));

            automovel.setProprietario(proprietario);

            Automovel salvo = automovelService.cadastrar(automovel);

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("mensagem", "Automovel cadastrado com sucesso!");
            resposta.put("id", salvo.getId());
            resposta.put("matricula", salvo.getMatricula());
            resposta.put("ano", salvo.getAno());
            resposta.put("marca", salvo.getMarca());
            resposta.put("modelo", salvo.getModelo());
            resposta.put("placa", salvo.getPlaca());

            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Listar todos os automoveis
    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(automovelService.listarTodos());
    }

    // Buscar automovel por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(automovelService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Atualizar automovel
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
        @PathVariable Long id,
        @RequestBody Automovel dados
    ) {
        try {
            return ResponseEntity.ok(automovelService.atualizar(id, dados));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    // Excluir automovel
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            automovelService.excluir(id);
            return ResponseEntity.ok(
                Map.of("mensagem", "Automovel excluido com sucesso!")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }
}
