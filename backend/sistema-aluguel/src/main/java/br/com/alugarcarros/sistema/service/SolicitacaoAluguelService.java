
package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.SolicitacaoAluguelRequest;
import br.com.alugarcarros.sistema.dto.AvaliacaoSolicitacaoRequest;
import br.com.alugarcarros.sistema.model.*;
import br.com.alugarcarros.sistema.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoAluguelService {

    private final SolicitacaoAluguelRepository solicitacaoRepository;
    private final AutomovelRepository automovelRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitacaoAluguelService(
        SolicitacaoAluguelRepository solicitacaoRepository,
        AutomovelRepository automovelRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.automovelRepository = automovelRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public SolicitacaoAluguel criar(
        SolicitacaoAluguelRequest dados,
        String emailCliente
    ) {
        if (dados.getAutomovelId() == null) {
            throw new IllegalArgumentException("Informe o automovel.");
        }

        if (dados.getDataInicio() == null || dados.getDataFim() == null) {
            throw new IllegalArgumentException("Informe as datas do aluguel.");
        }

        if (dados.getDataInicio().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A data de inicio nao pode estar no passado.");
        }

        if (!dados.getDataFim().isAfter(dados.getDataInicio())) {
            throw new IllegalArgumentException("A data final deve ser posterior a data inicial.");
        }

        Usuario cliente = usuarioRepository.findByEmail(emailCliente)
            .orElseThrow(() -> new IllegalArgumentException("Cliente nao encontrado."));

        if (!"CLIENTE".equals(cliente.getTipo())) {
            throw new IllegalArgumentException("Apenas clientes podem solicitar alugueis.");
        }

        Automovel automovel = automovelRepository.findById(dados.getAutomovelId())
            .orElseThrow(() -> new IllegalArgumentException("Automovel nao encontrado."));

        SolicitacaoAluguel solicitacao = new SolicitacaoAluguel();
        solicitacao.setCliente(cliente);
        solicitacao.setAutomovel(automovel);
        solicitacao.setDataInicio(dados.getDataInicio());
        solicitacao.setDataFim(dados.getDataFim());
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        return solicitacaoRepository.save(solicitacao);
    }

    public SolicitacaoAluguel atualizar(
        Long solicitacaoId,
        SolicitacaoAluguelRequest dados,
        String emailCliente
    ) {
        Usuario cliente = usuarioRepository.findByEmail(emailCliente)
            .orElseThrow(() -> new IllegalArgumentException("Cliente nao encontrado."));

        if (!"CLIENTE".equals(cliente.getTipo())) {
            throw new IllegalArgumentException("Apenas clientes podem editar solicitacoes.");
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository.findById(solicitacaoId)
            .orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

        if (!solicitacao.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("Voce nao pode editar esta solicitacao.");
        }

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException(
                "Apenas solicitacoes pendentes podem ser editadas."
            );
        }

        if (dados.getAutomovelId() == null) {
            throw new IllegalArgumentException("Informe o automovel.");
        }

        if (dados.getDataInicio() == null || dados.getDataFim() == null) {
            throw new IllegalArgumentException("Informe as datas do aluguel.");
        }

        if (dados.getDataInicio().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A data de inicio nao pode estar no passado.");
        }

        if (!dados.getDataFim().isAfter(dados.getDataInicio())) {
            throw new IllegalArgumentException("A data final deve ser posterior a data inicial.");
        }

        Automovel automovel = automovelRepository.findById(dados.getAutomovelId())
            .orElseThrow(() -> new IllegalArgumentException("Automovel nao encontrado."));

        solicitacao.setAutomovel(automovel);
        solicitacao.setDataInicio(dados.getDataInicio());
        solicitacao.setDataFim(dados.getDataFim());

        return solicitacaoRepository.save(solicitacao);
    }

    public void cancelar(Long solicitacaoId, String emailCliente) {
        Usuario cliente = usuarioRepository.findByEmail(emailCliente)
            .orElseThrow(() -> new IllegalArgumentException("Cliente nao encontrado."));

        if (!"CLIENTE".equals(cliente.getTipo())) {
            throw new IllegalArgumentException("Apenas clientes podem cancelar solicitacoes.");
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository.findById(solicitacaoId)
            .orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

        if (!solicitacao.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("Voce nao pode cancelar esta solicitacao.");
        }

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException(
                "Apenas solicitacoes pendentes podem ser canceladas."
            );
        }

        solicitacao.setStatus(StatusSolicitacao.CANCELADA);
        solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAluguel> listarDoCliente(Long clienteId) {
        return solicitacaoRepository.findByClienteId(clienteId);
    }

    public List<SolicitacaoAluguel> listarPorStatus(StatusSolicitacao status) {
        return solicitacaoRepository.findByStatus(status);
    }

    public SolicitacaoAluguel avaliar(
        Long solicitacaoId,
        AvaliacaoSolicitacaoRequest dados,
        String emailAgente
    ) {
        Usuario agente = usuarioRepository.findByEmail(emailAgente)
            .orElseThrow(() -> new IllegalArgumentException("Agente nao encontrado."));

        if (!"AGENTE".equals(agente.getTipo())) {
            throw new IllegalArgumentException("Apenas agentes podem avaliar solicitacoes.");
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository.findById(solicitacaoId)
            .orElseThrow(() -> new IllegalArgumentException("Solicitacao nao encontrada."));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE
                && solicitacao.getStatus() != StatusSolicitacao.EM_ANALISE) {
            throw new IllegalArgumentException("Esta solicitacao ja foi avaliada.");
        }

        if (dados.getStatus() == null ||
                (!dados.getStatus().equals("APROVADA") &&
                 !dados.getStatus().equals("RECUSADA"))) {
            throw new IllegalArgumentException("Informe APROVADA ou RECUSADA.");
        }

        if (dados.getParecerFinanceiro() == null ||
                dados.getParecerFinanceiro().isBlank()) {
            throw new IllegalArgumentException("Informe o parecer financeiro.");
        }

        solicitacao.setStatus(
            StatusSolicitacao.valueOf(dados.getStatus())
        );

        solicitacao.setParecerFinanceiro(dados.getParecerFinanceiro());
        solicitacao.setAgenteAvaliador(agente);
        solicitacao.setDataAvaliacao(LocalDateTime.now());

        return solicitacaoRepository.save(solicitacao);
    }
}
