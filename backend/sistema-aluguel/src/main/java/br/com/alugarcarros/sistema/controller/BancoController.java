package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.BancoRequest;
import br.com.alugarcarros.sistema.model.Banco;
import br.com.alugarcarros.sistema.service.BancoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bancos")
public class BancoController {

    private final BancoService bancoService;

    public BancoController(BancoService bancoService) {
        this.bancoService = bancoService;
    }

    // Apenas agentes cadastram (regra no SecurityConfig).
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody BancoRequest dados) {
        try {
            Banco banco = bancoService.cadastrar(dados);

            return ResponseEntity.status(HttpStatus.CREATED).body(resposta(banco));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar() {
        return ResponseEntity.ok(
            bancoService.listar().stream().map(this::resposta).toList()
        );
    }

    private Map<String, Object> resposta(Banco banco) {
        return Map.of(
            "id", banco.getId(),
            "nome", banco.getNome(),
            "codigo", banco.getCodigo(),
            "cnpj", banco.getCnpj()
        );
    }
}
