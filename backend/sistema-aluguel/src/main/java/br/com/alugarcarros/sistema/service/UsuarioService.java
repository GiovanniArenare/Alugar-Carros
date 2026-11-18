package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.dto.CadastroAgenteRequest;
import br.com.alugarcarros.sistema.dto.CadastroClienteRequest;
import br.com.alugarcarros.sistema.dto.EnderecoRequest;
import br.com.alugarcarros.sistema.dto.RendimentoRequest;
import br.com.alugarcarros.sistema.model.Cliente;
import br.com.alugarcarros.sistema.model.Endereco;
import br.com.alugarcarros.sistema.model.Rendimento;
import br.com.alugarcarros.sistema.model.TipoUsuario;
import br.com.alugarcarros.sistema.model.Usuario;
import br.com.alugarcarros.sistema.repository.ClienteRepository;
import br.com.alugarcarros.sistema.repository.UsuarioRepository;
import br.com.alugarcarros.sistema.util.Validadores;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        ClienteRepository clienteRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public Usuario cadastrarCliente(CadastroClienteRequest dados) {

        Usuario usuario = criarUsuario(
            dados.nome(), dados.email(), dados.senha(), TipoUsuario.CLIENTE
        );

        String cpf = Validadores.somenteDigitos(dados.cpf());

        if (cpf.isBlank()) {
            throw new IllegalArgumentException("O CPF e obrigatorio.");
        }

        if (!Validadores.cpfValido(cpf)) {
            throw new IllegalArgumentException("O CPF informado e invalido.");
        }

        if (clienteRepository.existsByCpf(cpf)) {
            throw new IllegalArgumentException("Este CPF ja esta cadastrado.");
        }

        String rg = dados.rg() == null
            ? ""
            : dados.rg().replaceAll("[^0-9A-Za-z]", "").toUpperCase();

        if (rg.length() < 5 || rg.length() > 14) {
            throw new IllegalArgumentException("Informe um RG valido.");
        }

        if (dados.profissao() == null || dados.profissao().isBlank()) {
            throw new IllegalArgumentException("A profissao e obrigatoria.");
        }

        Cliente cliente = new Cliente();
        cliente.setCpf(cpf);
        cliente.setRg(rg);
        cliente.setProfissao(dados.profissao().trim());
        cliente.setEndereco(montarEndereco(dados.endereco()));

        List<RendimentoRequest> rendimentos = dados.rendimentos();

        if (rendimentos == null || rendimentos.isEmpty()) {
            throw new IllegalArgumentException(
                "Informe ao menos um rendimento."
            );
        }

        if (rendimentos.size() > Cliente.MAX_RENDIMENTOS) {
            throw new IllegalArgumentException(
                "Sao permitidos no maximo " + Cliente.MAX_RENDIMENTOS
                + " rendimentos."
            );
        }

        for (RendimentoRequest item : rendimentos) {
            if (item == null
                    || item.entidadeEmpregadora() == null
                    || item.entidadeEmpregadora().isBlank()) {
                throw new IllegalArgumentException(
                    "Informe a entidade empregadora de cada rendimento."
                );
            }

            if (item.valor() == null
                    || item.valor().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException(
                    "O valor de cada rendimento deve ser maior que zero."
                );
            }

            cliente.adicionarRendimento(
                new Rendimento(item.entidadeEmpregadora().trim(), item.valor())
            );
        }

        Usuario salvo = usuarioRepository.save(usuario);
        cliente.setUsuario(salvo);
        clienteRepository.save(cliente);

        return salvo;
    }

    public Usuario cadastrarAgente(CadastroAgenteRequest dados) {
        Usuario usuario = criarUsuario(
            dados.nome(), dados.email(), dados.senha(), TipoUsuario.AGENTE
        );

        return usuarioRepository.save(usuario);
    }

    public Usuario autenticar(String email, String senha) {

        email = email.trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() ->
                new IllegalArgumentException("Email ou senha incorretos.")
            );

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new IllegalArgumentException("Email ou senha incorretos.");
        }

        return usuario;
    }

    private Usuario criarUsuario(
        String nome,
        String email,
        String senha,
        TipoUsuario tipo
    ) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome e obrigatorio.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("O email e obrigatorio.");
        }

        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException(
                "A senha deve possuir pelo menos 8 caracteres."
            );
        }

        String emailNormalizado = email.trim().toLowerCase();

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new IllegalArgumentException("Este email ja esta cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome.trim());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setTipo(tipo);

        return usuario;
    }

    private Endereco montarEndereco(EnderecoRequest dados) {

        if (dados == null) {
            throw new IllegalArgumentException("O endereco e obrigatorio.");
        }

        String cep = Validadores.somenteDigitos(dados.cep());

        if (cep.length() != 8) {
            throw new IllegalArgumentException("Informe um CEP valido.");
        }

        exigir(dados.logradouro(), "O logradouro e obrigatorio.");
        exigir(dados.numero(), "O numero do endereco e obrigatorio.");
        exigir(dados.bairro(), "O bairro e obrigatorio.");
        exigir(dados.cidade(), "A cidade e obrigatoria.");

        if (dados.uf() == null || !dados.uf().trim().matches("[A-Za-z]{2}")) {
            throw new IllegalArgumentException("Informe a UF com 2 letras.");
        }

        Endereco endereco = new Endereco();
        endereco.setCep(cep);
        endereco.setLogradouro(dados.logradouro().trim());
        endereco.setNumero(dados.numero().trim());
        endereco.setComplemento(
            dados.complemento() == null || dados.complemento().isBlank()
                ? null
                : dados.complemento().trim()
        );
        endereco.setBairro(dados.bairro().trim());
        endereco.setCidade(dados.cidade().trim());
        endereco.setUf(dados.uf().trim().toUpperCase());

        return endereco;
    }

    private void exigir(String valor, String mensagem) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(mensagem);
        }
    }
}
