package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.ContratoCreditoRequest;
import br.com.alugarcarros.sistema.model.*;
import br.com.alugarcarros.sistema.repository.*;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class ContratoCreditoService {

    private static final int MAX_PARCELAS = 120;

    private final ContratoCreditoRepository creditoRepository;
    private final ContratoAluguelRepository contratoRepository;
    private final BancoRepository bancoRepository;

    public ContratoCreditoService(
        ContratoCreditoRepository creditoRepository,
        ContratoAluguelRepository contratoRepository,
        BancoRepository bancoRepository
    ) {
        this.creditoRepository = creditoRepository;
        this.contratoRepository = contratoRepository;
        this.bancoRepository = bancoRepository;
    }

    public ContratoCredito criar(ContratoCreditoRequest dados, Usuario agente) {

        if (agente.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                "Apenas agentes podem registrar contratos de credito."
            );
        }

        if (dados.contratoId() == null) {
            throw new IllegalArgumentException("Informe o contrato de aluguel.");
        }

        if (dados.bancoId() == null) {
            throw new IllegalArgumentException("Informe o banco.");
        }

        if (dados.valorFinanciado() == null
                || dados.valorFinanciado().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                "O valor financiado deve ser maior que zero."
            );
        }

        if (dados.taxaJurosMensal() == null
                || dados.taxaJurosMensal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                "A taxa de juros nao pode ser negativa."
            );
        }

        if (dados.numeroParcelas() == null
                || dados.numeroParcelas() < 1
                || dados.numeroParcelas() > MAX_PARCELAS) {
            throw new IllegalArgumentException(
                "O numero de parcelas deve estar entre 1 e " + MAX_PARCELAS + "."
            );
        }

        ContratoAluguel contrato = contratoRepository
            .findById(dados.contratoId())
            .orElseThrow(() ->
                new IllegalArgumentException("Contrato de aluguel nao encontrado.")
            );

        if (creditoRepository.existsByContratoAluguelId(contrato.getId())) {
            throw new IllegalArgumentException(
                "Este contrato de aluguel ja possui contrato de credito."
            );
        }

        Banco banco = bancoRepository.findById(dados.bancoId())
            .orElseThrow(() ->
                new IllegalArgumentException("Banco nao encontrado.")
            );

        ContratoCredito credito = new ContratoCredito();
        credito.setContratoAluguel(contrato);
        credito.setBanco(banco);
        credito.setAgenteResponsavel(agente);
        credito.setValorFinanciado(dados.valorFinanciado());
        credito.setTaxaJurosMensal(dados.taxaJurosMensal());
        credito.setNumeroParcelas(dados.numeroParcelas());
        credito.setValorParcela(
            calcularParcela(
                dados.valorFinanciado(),
                dados.taxaJurosMensal(),
                dados.numeroParcelas()
            )
        );
        credito.setStatus(StatusContrato.AGUARDANDO_ASSINATURA);

        return creditoRepository.save(credito);
    }

    public ContratoCredito buscarPorContratoAluguel(Long contratoId) {
        return creditoRepository.findByContratoAluguelId(contratoId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Contrato de credito nao encontrado."
                )
            );
    }

    /**
     * Parcela fixa pela Tabela Price: PMT = PV * i / (1 - (1 + i)^-n).
     * Sem juros, divide o valor igualmente.
     */
    static BigDecimal calcularParcela(
        BigDecimal valor,
        BigDecimal taxaPercentual,
        int parcelas
    ) {
        if (taxaPercentual.signum() == 0) {
            return valor.divide(
                BigDecimal.valueOf(parcelas), 2, RoundingMode.HALF_UP
            );
        }

        MathContext mc = MathContext.DECIMAL64;

        BigDecimal i = taxaPercentual.divide(BigDecimal.valueOf(100), mc);
        BigDecimal umMaisI = BigDecimal.ONE.add(i);
        BigDecimal fator = umMaisI.pow(parcelas, mc);

        // PMT = PV * i * (1+i)^n / ((1+i)^n - 1)
        BigDecimal numerador = valor.multiply(i, mc).multiply(fator, mc);
        BigDecimal denominador = fator.subtract(BigDecimal.ONE);

        return numerador.divide(denominador, 2, RoundingMode.HALF_UP);
    }
}
