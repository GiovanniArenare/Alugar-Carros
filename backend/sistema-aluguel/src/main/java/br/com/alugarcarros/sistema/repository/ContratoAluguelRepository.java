
package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.ContratoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContratoAluguelRepository
        extends JpaRepository<ContratoAluguel, Long> {

    Optional<ContratoAluguel> findBySolicitacaoId(Long solicitacaoId);

    boolean existsBySolicitacaoId(Long solicitacaoId);
}
