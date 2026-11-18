package br.com.alugarcarros.sistema.controller;

import br.com.alugarcarros.sistema.dto.ContratoAluguelRequest;
import br.com.alugarcarros.sistema.model.Cliente;
import br.com.alugarcarros.sistema.model.ContratoAluguel;
import br.com.alugarcarros.sistema.model.ContratoCredito;
import br.com.alugarcarros.sistema.model.TipoUsuario;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.ContratoCreditoRepository;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.service.ContratoAluguelService;
import br.com.alugarcarros.sistema.service.ContratoPdfService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contratos")
public class ContratoAluguelController {

    private final ContratoAluguelService contratoService;
    private final ContratoPdfService contratoPdfService;
    private final UsuarioRepository usuarioRepository;
    private final ContratoCreditoRepository creditoRepository;

    public ContratoAluguelController(
        ContratoAluguelService contratoService,
        ContratoPdfService contratoPdfService,
        UsuarioRepository usuarioRepository,
        ContratoCreditoRepository creditoRepository
    ) {
        this.contratoService = contratoService;
        this.contratoPdfService = contratoPdfService;
        this.usuarioRepository = usuarioRepository;
        this.creditoRepository = creditoRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(
        @RequestBody ContratoAluguelRequest dados,
        Authentication autenticacao
    ) {
        try {
            Usuario usuario = buscarUsuario(autenticacao);

            if (usuario.getTipo() != TipoUsuario.CLIENTE) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Apenas clientes podem criar contratos.")
                );
            }

            ContratoAluguel contrato = contratoService.criar(dados, usuario);

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
            Usuario usuario = buscarUsuario(autenticacao);

            ContratoAluguel contrato =
                contratoService.buscarPorSolicitacao(id);

            if (!podeAcessar(usuario, contrato)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Voce nao pode consultar este contrato.")
                );
            }

            return ResponseEntity.ok(montarResposta(contrato));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> baixarPdf(
        @PathVariable Long id,
        Authentication autenticacao
    ) {
        try {
            Usuario usuario = buscarUsuario(autenticacao);

            ContratoAluguel contrato = contratoService.buscarPorId(id);

            if (!podeAcessar(usuario, contrato)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("erro", "Voce nao pode baixar este contrato.")
                );
            }

            Cliente cliente = contratoService.buscarCliente(
                contrato.getSolicitacao().getCliente()
            );

            ContratoCredito credito = creditoRepository
                .findByContratoAluguelId(contrato.getId())
                .orElse(null);

            byte[] pdf = contratoPdfService.gerarPdf(contrato, cliente, credito);

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=contrato-" + id + ".pdf"
                )
                .body(pdf);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("erro", e.getMessage())
            );
        }
    }

    private Usuario buscarUsuario(Authentication autenticacao) {
        return usuarioRepository
            .findByEmail(autenticacao.getName())
            .orElseThrow(() ->
                new IllegalArgumentException("Usuario nao encontrado.")
            );
    }

    // Agentes veem qualquer contrato; clientes apenas os proprios.
    private boolean podeAcessar(Usuario usuario, ContratoAluguel contrato) {
        if (usuario.getTipo() == TipoUsuario.AGENTE) {
            return true;
        }

        return usuario.getTipo() == TipoUsuario.CLIENTE
            && contrato.getSolicitacao().getCliente().getId()
                .equals(usuario.getId());
    }

    private Map<String, Object> montarResposta(ContratoAluguel contrato) {
        Map<String, Object> resposta = new HashMap<>();

        resposta.put("id", contrato.getId());
        resposta.put("solicitacaoId", contrato.getSolicitacao().getId());
        resposta.put("nomeContratante", contrato.getNomeContratante());
        resposta.put("profissao", contrato.getProfissao());
        resposta.put("rendaMensal", contrato.getRendaMensal());
        resposta.put("valorTotal", contrato.getValorTotal());
        resposta.put(
            "empresa",
            contrato.getEmpresa() == null
                ? null
                : contrato.getEmpresa().getRazaoSocial()
        );
        resposta.put("dataCriacao", contrato.getDataCriacao());
        resposta.put("status", contrato.getStatus());

        return resposta;
    }
}
