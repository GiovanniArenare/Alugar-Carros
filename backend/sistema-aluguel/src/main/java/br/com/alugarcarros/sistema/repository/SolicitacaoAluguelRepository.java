
package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.SolicitacaoAluguel;
import br.com.alugarcarros.sistema.model.StatusSolicitacao;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacaoAluguelRepository
        extends JpaRepository<SolicitacaoAluguel, Long> {

    List<SolicitacaoAluguel> findByClienteId(Long clienteId);

    List<SolicitacaoAluguel> findByStatus(StatusSolicitacao status);
}
