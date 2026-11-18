package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.EmpresaRequest;
import br.com.alugarcarros.sistema.model.Empresa;
import br.com.alugarcarros.sistema.repository.EmpresaRepository;
import br.com.alugarcarros.sistema.util.Validadores;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public Empresa cadastrar(EmpresaRequest dados) {

        if (dados.razaoSocial() == null || dados.razaoSocial().isBlank()) {
            throw new IllegalArgumentException("A razao social e obrigatoria.");
        }

        String cnpj = Validadores.somenteDigitos(dados.cnpj());

        if (!Validadores.cnpjValido(cnpj)) {
            throw new IllegalArgumentException("O CNPJ informado e invalido.");
        }

        if (empresaRepository.existsByCnpj(cnpj)) {
            throw new IllegalArgumentException("Este CNPJ ja esta cadastrado.");
        }

        Empresa empresa = new Empresa();
        empresa.setRazaoSocial(dados.razaoSocial().trim());
        empresa.setCnpj(cnpj);

        return empresaRepository.save(empresa);
    }

    public List<Empresa> listar() {
        return empresaRepository.findAll();
    }
}
