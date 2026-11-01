
package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.ContratoAluguelRequest;
import br.com.alugarcarros.sistema.model.ContratoAluguel;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.service.ContratoAluguelService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contratos")
public class ContratoAluguelController {

    private final ContratoAluguelService contratoService;
    private final UsuarioRepository usuarioRepository;

    public ContratoAluguelController(
        ContratoAluguelService contratoService,
        UsuarioRepository usuarioRepository
    ) {
        this.contratoService = contratoService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(
        @RequestBody ContratoAluguelRequest dados,
        Authentication autenticacao
    ) {
        try {
            Usuario usuario = usuarioRepository
                .findByEmail(autenticacao.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("Usuario nao encontrado.")
                );

            if (!"CLIENTE".equals(usuario.getTipo())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Apenas clientes podem criar contratos.")
                );
            }

            ContratoAluguel contrato = contratoService.criar(dados);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                montarResposta(contrato)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping("/solicitacao/{id}")
    public ResponseEntity<?> buscarPorSolicitacao(
        @PathVariable Long id,
        Authentication autenticacao
    ) {
        try {
            Usuario usuario = usuarioRepository
                .findByEmail(autenticacao.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("Usuario nao encontrado.")
                );

            ContratoAluguel contrato =
                contratoService.buscarPorSolicitacao(id);

            if ("CLIENTE".equals(usuario.getTipo()) &&
                    !contrato.getSolicitacao().getCliente().getId()
                        .equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Voce nao pode consultar este contrato.")
                );
            }

            if (!"CLIENTE".equals(usuario.getTipo()) &&
                    !"AGENTE".equals(usuario.getTipo())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Acesso nao autorizado.")
                );
            }

            return ResponseEntity.ok(montarResposta(contrato));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    private Map<String, Object> montarResposta(ContratoAluguel contrato) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", contrato.getId());
        resposta.put("solicitacaoId", contrato.getSolicitacao().getId());
        resposta.put("nomeContratante", contrato.getNomeContratante());
        resposta.put("profissao", contrato.getProfissao());
        resposta.put("rendaMensal", contrato.getRendaMensal());
        resposta.put("dataCriacao", contrato.getDataCriacao());
        resposta.put("status", contrato.getStatus());

        return resposta;
    }
}
