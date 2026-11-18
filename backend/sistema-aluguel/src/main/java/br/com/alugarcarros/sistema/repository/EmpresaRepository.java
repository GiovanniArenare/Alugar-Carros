package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    boolean existsByCnpj(String cnpj);
}
