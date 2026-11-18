package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.EmpresaRequest;
import br.com.alugarcarros.sistema.model.Empresa;
import br.com.alugarcarros.sistema.service.EmpresaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // Apenas agentes cadastram (regra no SecurityConfig).
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody EmpresaRequest dados) {
        try {
            Empresa empresa = empresaService.cadastrar(dados);

            return ResponseEntity.status(HttpStatus.CREATED).body(resposta(empresa));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar() {
        return ResponseEntity.ok(
            empresaService.listar().stream().map(this::resposta).toList()
        );
    }

    private Map<String, Object> resposta(Empresa empresa) {
        return Map.of(
            "id", empresa.getId(),
            "razaoSocial", empresa.getRazaoSocial(),
            "cnpj", empresa.getCnpj()
        );
    }
}
