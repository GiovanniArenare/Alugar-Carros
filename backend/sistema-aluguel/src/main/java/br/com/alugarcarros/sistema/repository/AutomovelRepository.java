
package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    Optional<Automovel> findByPlaca(String placa);

    Optional<Automovel> findByMatricula(String matricula);

    List<Automovel> findByProprietarioId(Long proprietarioId);

    boolean existsByPlaca(String placa);

    boolean existsByMatricula(String matricula);
}
