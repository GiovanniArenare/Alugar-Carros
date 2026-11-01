
package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.model.Automovel;
import br.com.alugarcarros.sistema.repository.AutomovelRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelService(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    public Automovel cadastrar(Automovel automovel) {

        if (automovel.getMatricula() == null || automovel.getMatricula().isBlank()) {
            throw new IllegalArgumentException("A matricula e obrigatoria.");
        }

        if (automovel.getAno() == null || automovel.getAno() < 1900) {
            throw new IllegalArgumentException("Informe um ano valido.");
        }

        if (automovel.getMarca() == null || automovel.getMarca().isBlank()) {
            throw new IllegalArgumentException("A marca e obrigatoria.");
        }

        if (automovel.getModelo() == null || automovel.getModelo().isBlank()) {
            throw new IllegalArgumentException("O modelo e obrigatorio.");
        }

        if (automovel.getPlaca() == null || automovel.getPlaca().isBlank()) {
            throw new IllegalArgumentException("A placa e obrigatoria.");
        }

        if (automovel.getProprietario() == null ||
            automovel.getProprietario().getId() == null) {
            throw new IllegalArgumentException("O proprietario e obrigatorio.");
        }

        automovel.setMatricula(automovel.getMatricula().trim());
        automovel.setPlaca(automovel.getPlaca().trim().toUpperCase());

        if (automovelRepository.existsByMatricula(automovel.getMatricula())) {
            throw new IllegalArgumentException("Esta matricula ja esta cadastrada.");
        }

        if (automovelRepository.existsByPlaca(automovel.getPlaca())) {
            throw new IllegalArgumentException("Esta placa ja esta cadastrada.");
        }

        return automovelRepository.save(automovel);
    }

    public List<Automovel> listarTodos() {
        return automovelRepository.findAll();
    }

    public Automovel buscarPorId(Long id) {
        return automovelRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Automovel nao encontrado."));
    }

    public List<Automovel> listarPorProprietario(Long proprietarioId) {
        return automovelRepository.findByProprietarioId(proprietarioId);
    }

    public Automovel atualizar(Long id, Automovel dados) {
        Automovel automovel = buscarPorId(id);

        automovel.setAno(dados.getAno());
        automovel.setMarca(dados.getMarca());
        automovel.setModelo(dados.getModelo());

        return automovelRepository.save(automovel);
    }

    public void excluir(Long id) {
        Automovel automovel = buscarPorId(id);
        automovelRepository.delete(automovel);
    }
}
