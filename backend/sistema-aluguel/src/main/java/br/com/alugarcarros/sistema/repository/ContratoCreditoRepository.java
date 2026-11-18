package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.ContratoCredito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContratoCreditoRepository
        extends JpaRepository<ContratoCredito, Long> {

    Optional<ContratoCredito> findByContratoAluguelId(Long contratoAluguelId);

    boolean existsByContratoAluguelId(Long contratoAluguelId);
}
