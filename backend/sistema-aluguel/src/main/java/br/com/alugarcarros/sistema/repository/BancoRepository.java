package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.Banco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BancoRepository extends JpaRepository<Banco, Long> {

    boolean existsByCnpj(String cnpj);

    boolean existsByCodigo(String codigo);
}
