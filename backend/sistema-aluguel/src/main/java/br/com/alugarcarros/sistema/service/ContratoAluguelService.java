
package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.ContratoAluguelRequest;
import br.com.alugarcarros.sistema.model.*;
import br.com.alugarcarros.sistema.repository.*;

import org.springframework.stereotype.Service;

@Service
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;

    public ContratoAluguelService(
        ContratoAluguelRepository contratoRepository,
        SolicitacaoAluguelRepository solicitacaoRepository
    ) {
        this.contratoRepository = contratoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public ContratoAluguel criar(ContratoAluguelRequest dados) {

        if (dados.getSolicitacaoId() == null) {
            throw new IllegalArgumentException("Informe a solicitacao.");
        }

        if (dados.getNomeContratante() == null ||
                dados.getNomeContratante().isBlank()) {
            throw new IllegalArgumentException("Informe o nome do contratante.");
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository
            .findById(dados.getSolicitacaoId())
            .orElseThrow(() ->
                new IllegalArgumentException("Solicitacao nao encontrada.")
            );

        if (solicitacao.getStatus() != StatusSolicitacao.APROVADA) {
            throw new IllegalArgumentException(
                "A solicitacao precisa estar aprovada para gerar um contrato."
            );
        }

        if (contratoRepository.existsBySolicitacaoId(solicitacao.getId())) {
            throw new IllegalArgumentException(
                "Esta solicitacao ja possui um contrato."
            );
        }

        ContratoAluguel contrato = new ContratoAluguel();

        contrato.setSolicitacao(solicitacao);
        contrato.setNomeContratante(dados.getNomeContratante());
        contrato.setProfissao(dados.getProfissao());
        contrato.setRendaMensal(dados.getRendaMensal());
        contrato.setStatus(StatusContrato.AGUARDANDO_ASSINATURA);

        return contratoRepository.save(contrato);
    }

    public ContratoAluguel buscarPorSolicitacao(Long solicitacaoId) {
        return contratoRepository.findBySolicitacaoId(solicitacaoId)
            .orElseThrow(() ->
                new IllegalArgumentException("Contrato nao encontrado.")
            );
    }

    public ContratoAluguel buscarPorId(Long id) {
        return contratoRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException("Contrato nao encontrado.")
            );
    }
}
