package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.ContratoAluguelRequest;
import br.com.alugarcarros.sistema.model.*;
import br.com.alugarcarros.sistema.repository.*;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ContratoAluguelService {

    private final ContratoAluguelRepository contratoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;

    public ContratoAluguelService(
        ContratoAluguelRepository contratoRepository,
        SolicitacaoAluguelRepository solicitacaoRepository,
        ClienteRepository clienteRepository,
        EmpresaRepository empresaRepository
    ) {
        this.contratoRepository = contratoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
    }

    public ContratoAluguel criar(
        ContratoAluguelRequest dados,
        Usuario solicitante
    ) {

        if (dados.solicitacaoId() == null) {
            throw new IllegalArgumentException("Informe a solicitacao.");
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository
            .findById(dados.solicitacaoId())
            .orElseThrow(() ->
                new IllegalArgumentException("Solicitacao nao encontrada.")
            );

        if (!solicitacao.getCliente().getId().equals(solicitante.getId())) {
            throw new IllegalArgumentException(
                "Voce nao pode gerar contrato para esta solicitacao."
            );
        }

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

        // Dados do contratante vem do cadastro do cliente.
        Cliente cliente = buscarCliente(solicitante);

        if (dados.valorTotal() != null
                && dados.valorTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                "O valor total deve ser maior que zero."
            );
        }

        ContratoAluguel contrato = new ContratoAluguel();

        contrato.setSolicitacao(solicitacao);
        contrato.setNomeContratante(solicitante.getNome());
        contrato.setProfissao(cliente.getProfissao());
        contrato.setRendaMensal(cliente.getRendaTotal());
        contrato.setValorTotal(dados.valorTotal());
        contrato.setStatus(StatusContrato.AGUARDANDO_ASSINATURA);

        if (dados.empresaId() != null) {
            Empresa empresa = empresaRepository.findById(dados.empresaId())
                .orElseThrow(() ->
                    new IllegalArgumentException("Empresa nao encontrada.")
                );

            contrato.setEmpresa(empresa);
        }

        return contratoRepository.save(contrato);
    }

    public Cliente buscarCliente(Usuario usuario) {
        return clienteRepository.findByUsuarioId(usuario.getId())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Cadastro do cliente incompleto. "
                    + "Crie uma nova conta com RG, endereco e rendimentos."
                )
            );
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
