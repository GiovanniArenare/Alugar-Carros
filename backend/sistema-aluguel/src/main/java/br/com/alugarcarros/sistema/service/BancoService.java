package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.BancoRequest;
import br.com.alugarcarros.sistema.model.Banco;
import br.com.alugarcarros.sistema.repository.BancoRepository;
import br.com.alugarcarros.sistema.util.Validadores;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BancoService {

    private final BancoRepository bancoRepository;

    public BancoService(BancoRepository bancoRepository) {
        this.bancoRepository = bancoRepository;
    }

    public Banco cadastrar(BancoRequest dados) {

        if (dados.nome() == null || dados.nome().isBlank()) {
            throw new IllegalArgumentException("O nome do banco e obrigatorio.");
        }

        if (dados.codigo() == null || dados.codigo().isBlank()) {
            throw new IllegalArgumentException("O codigo do banco e obrigatorio.");
        }

        String cnpj = Validadores.somenteDigitos(dados.cnpj());

        if (!Validadores.cnpjValido(cnpj)) {
            throw new IllegalArgumentException("O CNPJ informado e invalido.");
        }

        String codigo = dados.codigo().trim();

        if (bancoRepository.existsByCnpj(cnpj)) {
            throw new IllegalArgumentException("Este CNPJ ja esta cadastrado.");
        }

        if (bancoRepository.existsByCodigo(codigo)) {
            throw new IllegalArgumentException("Este codigo de banco ja existe.");
        }

        Banco banco = new Banco();
        banco.setNome(dados.nome().trim());
        banco.setCodigo(codigo);
        banco.setCnpj(cnpj);

        return bancoRepository.save(banco);
    }

    public List<Banco> listar() {
        return bancoRepository.findAll();
    }
}
