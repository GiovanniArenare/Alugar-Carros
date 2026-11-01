
package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.SolicitacaoAluguelRequest;
import br.com.alugarcarros.sistema.dto.AvaliacaoSolicitacaoRequest;
import br.com.alugarcarros.sistema.model.SolicitacaoAluguel;
import br.com.alugarcarros.sistema.model.StatusSolicitacao;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.service.SolicitacaoAluguelService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoAluguelController {

    private final SolicitacaoAluguelService solicitacaoService;
    private final UsuarioRepository usuarioRepository;

    public SolicitacaoAluguelController(
        SolicitacaoAluguelService solicitacaoService,
        UsuarioRepository usuarioRepository
    ) {
        this.solicitacaoService = solicitacaoService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(
        @RequestBody SolicitacaoAluguelRequest dados,
        Authentication autenticacao
    ) {
        try {
            SolicitacaoAluguel solicitacao = solicitacaoService.criar(
                dados,
                autenticacao.getName()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(
                montarResposta(solicitacao)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
        @PathVariable Long id,
        @RequestBody SolicitacaoAluguelRequest dados,
        Authentication autenticacao
    ) {
        try {
            SolicitacaoAluguel solicitacao = solicitacaoService.atualizar(
                id,
                dados,
                autenticacao.getName()
            );

            return ResponseEntity.ok(montarResposta(solicitacao));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(
        @PathVariable Long id,
        Authentication autenticacao
    ) {
        try {
            solicitacaoService.cancelar(id, autenticacao.getName());

            return ResponseEntity.ok(
                Map.of("mensagem", "Solicitacao cancelada com sucesso!")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping("/minhas")
    public ResponseEntity<?> listarMinhas(Authentication autenticacao) {
        Usuario cliente = usuarioRepository.findByEmail(autenticacao.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        if (!"CLIENTE".equals(cliente.getTipo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("erro", "Apenas clientes podem consultar suas solicitacoes.")
            );
        }

        List<Map<String, Object>> resposta = solicitacaoService
            .listarDoCliente(cliente.getId())
            .stream()
            .map(this::montarResposta)
            .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<?> listarPendentes(Authentication autenticacao) {
        Usuario agente = usuarioRepository.findByEmail(autenticacao.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        if (!"AGENTE".equals(agente.getTipo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("erro", "Apenas agentes podem consultar solicitacoes pendentes.")
            );
        }

        List<Map<String, Object>> resposta = solicitacaoService
            .listarPorStatus(StatusSolicitacao.PENDENTE)
            .stream()
            .map(this::montarResposta)
            .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/aprovadas")
    public ResponseEntity<?> listarAprovadas(Authentication autenticacao) {
        Usuario agente = usuarioRepository.findByEmail(autenticacao.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        if (!"AGENTE".equals(agente.getTipo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("erro", "Apenas agentes podem consultar solicitacoes aprovadas.")
            );
        }

        List<Map<String, Object>> resposta = solicitacaoService
            .listarPorStatus(StatusSolicitacao.APROVADA)
            .stream()
            .map(this::montarResposta)
            .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/recusadas")
    public ResponseEntity<?> listarRecusadas(Authentication autenticacao) {
        Usuario agente = usuarioRepository.findByEmail(autenticacao.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));

        if (!"AGENTE".equals(agente.getTipo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                Map.of("erro", "Apenas agentes podem consultar solicitacoes recusadas.")
            );
        }

        List<Map<String, Object>> resposta = solicitacaoService
            .listarPorStatus(StatusSolicitacao.RECUSADA)
            .stream()
            .map(this::montarResposta)
            .toList();

        return ResponseEntity.ok(resposta);
    }

    @PutMapping("/{id}/avaliacao")
    public ResponseEntity<?> avaliar(
        @PathVariable Long id,
        @RequestBody AvaliacaoSolicitacaoRequest dados,
        Authentication autenticacao
    ) {
        try {
            SolicitacaoAluguel solicitacao = solicitacaoService.avaliar(
                id,
                dados,
                autenticacao.getName()
            );

            return ResponseEntity.ok(montarResposta(solicitacao));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    private Map<String, Object> montarResposta(SolicitacaoAluguel solicitacao) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", solicitacao.getId());
        resposta.put("clienteId", solicitacao.getCliente().getId());
        resposta.put("automovelId", solicitacao.getAutomovel().getId());
        resposta.put("marca", solicitacao.getAutomovel().getMarca());
        resposta.put("modelo", solicitacao.getAutomovel().getModelo());
        resposta.put("placa", solicitacao.getAutomovel().getPlaca());
        resposta.put("dataInicio", solicitacao.getDataInicio());
        resposta.put("dataFim", solicitacao.getDataFim());
        resposta.put("status", solicitacao.getStatus());
        resposta.put("parecerFinanceiro", solicitacao.getParecerFinanceiro());
        resposta.put("dataCriacao", solicitacao.getDataCriacao());
        resposta.put("agenteAvaliadorId",
            solicitacao.getAgenteAvaliador() != null
                ? solicitacao.getAgenteAvaliador().getId()
                : null
        );
        resposta.put("dataAvaliacao", solicitacao.getDataAvaliacao());

        return resposta;
    }
}
