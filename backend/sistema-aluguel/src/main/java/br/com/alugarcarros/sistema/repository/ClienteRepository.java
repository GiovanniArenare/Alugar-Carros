package br.com.alugarcarros.sistema.repository;

import br.com.alugarcarros.sistema.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByUsuarioId(Long usuarioId);

    boolean existsByCpf(String cpf);
}
