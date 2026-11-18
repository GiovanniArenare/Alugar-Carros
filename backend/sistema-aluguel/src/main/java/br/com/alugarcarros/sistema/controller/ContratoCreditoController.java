package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.ContratoCreditoRequest;
import br.com.alugarcarros.sistema.model.ContratoCredito;
import br.com.alugarcarros.sistema.model.TipoUsuario;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.service.ContratoCreditoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contratos-credito")
public class ContratoCreditoController {

    private final ContratoCreditoService creditoService;
    private final UsuarioRepository usuarioRepository;

    public ContratoCreditoController(
        ContratoCreditoService creditoService,
        UsuarioRepository usuarioRepository
    ) {
        this.creditoService = creditoService;
        this.usuarioRepository = usuarioRepository;
    }

    // Apenas agentes registram credito (regra no SecurityConfig).
    @PostMapping
    public ResponseEntity<?> criar(
        @RequestBody ContratoCreditoRequest dados,
        Authentication autenticacao
    ) {
        try {
            Usuario agente = usuarioRepository
                .findByEmail(autenticacao.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("Usuario nao encontrado.")
                );

            ContratoCredito credito = creditoService.criar(dados, agente);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                montarResposta(credito)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<?> buscarPorContrato(
        @PathVariable Long contratoId,
        Authentication autenticacao
    ) {
        try {
            Usuario usuario = usuarioRepository
                .findByEmail(autenticacao.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("Usuario nao encontrado.")
                );

            ContratoCredito credito =
                creditoService.buscarPorContratoAluguel(contratoId);

            boolean donoDoContrato = credito.getContratoAluguel()
                .getSolicitacao().getCliente().getId()
                .equals(usuario.getId());

            if (usuario.getTipo() == TipoUsuario.CLIENTE && !donoDoContrato) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Voce nao pode consultar este contrato.")
                );
            }

            return ResponseEntity.ok(montarResposta(credito));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    private Map<String, Object> montarResposta(ContratoCredito credito) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", credito.getId());
        resposta.put("contratoId", credito.getContratoAluguel().getId());
        resposta.put("bancoId", credito.getBanco().getId());
        resposta.put("bancoNome", credito.getBanco().getNome());
        resposta.put("valorFinanciado", credito.getValorFinanciado());
        resposta.put("taxaJurosMensal", credito.getTaxaJurosMensal());
        resposta.put("numeroParcelas", credito.getNumeroParcelas());
        resposta.put("valorParcela", credito.getValorParcela());
        resposta.put("status", credito.getStatus());
        resposta.put("dataCriacao", credito.getDataCriacao());

        return resposta;
    }
}
