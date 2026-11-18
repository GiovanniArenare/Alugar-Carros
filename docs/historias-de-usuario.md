# Histórias de usuário — AlugaCar

Perfis: **Cliente** (quem aluga) e **Agente** (quem cadastra a frota, avalia
pedidos, mantém bancos/empresas e registra o crédito).

Prioridade: **A** = essencial · **M** = média.

## Cliente

| ID | História | Critérios de aceite | Prior. |
|---|---|---|---|
| HU01 | Como **cliente**, quero me cadastrar informando meus dados pessoais, para poder solicitar aluguéis. | Campos obrigatórios: nome, e-mail, senha (mín. 8), CPF válido, RG, profissão, endereço completo (CEP, logradouro, número, bairro, cidade, UF). CPF e e-mail não podem repetir. | A |
| HU02 | Como **cliente**, quero informar meus rendimentos e empregadores, para que o agente avalie minha capacidade financeira. | De 1 a **3** rendimentos; cada um com entidade empregadora e valor > 0. A renda total é a soma dos rendimentos. | A |
| HU03 | Como **cliente**, quero entrar e sair do sistema, para acessar minha área com segurança. | Login por e-mail e senha; sessão por cookie; cliente não acessa o painel do agente. | A |
| HU04 | Como **cliente**, quero ver os automóveis disponíveis, para escolher o que alugar. | Lista com marca, modelo, ano e placa. | A |
| HU05 | Como **cliente**, quero solicitar o aluguel de um automóvel por um período, para reservá-lo. | Data de início não pode estar no passado; data final posterior à inicial; solicitação nasce `PENDENTE`. | A |
| HU06 | Como **cliente**, quero editar ou cancelar uma solicitação pendente, para corrigir ou desistir do pedido. | Só é possível enquanto `PENDENTE`; só o dono altera. | A |
| HU07 | Como **cliente**, quero acompanhar o status e o parecer das minhas solicitações, para saber o resultado da análise. | Status: pendente, aprovada, recusada ou cancelada; parecer financeiro visível após a avaliação. | A |
| HU08 | Como **cliente**, quero gerar o contrato de uma solicitação aprovada, para formalizar o aluguel. | Só para `APROVADA` e só uma vez por solicitação; nome, profissão e renda vêm do meu cadastro; posso escolher a empresa locadora e informar o valor total (opcionais). | A |
| HU09 | Como **cliente**, quero baixar o contrato em PDF, para guardar uma cópia. | PDF com CPF, RG, endereço, rendimentos, veículo, período, empresa e, se houver, o crédito. | M |

## Agente

| ID | História | Critérios de aceite | Prior. |
|---|---|---|---|
| HU10 | Como **agente**, quero cadastrar, editar e excluir automóveis, para manter a frota atualizada. | Matrícula e placa únicas; ano ≥ 1900; listagem paginada. | A |
| HU11 | Como **agente**, quero avaliar solicitações pendentes com um parecer financeiro, para aprovar ou recusar o pedido. | Parecer obrigatório; status final `APROVADA` ou `RECUSADA`; registra agente e data. | A |
| HU12 | Como **agente**, quero consultar solicitações por status, para organizar meu trabalho. | Abas Pendentes / Aprovadas / Recusadas com contadores. | M |
| HU13 | Como **agente**, quero cadastrar bancos, para associá-los aos contratos de crédito. | Nome, código e CNPJ válido; código e CNPJ únicos. | A |
| HU14 | Como **agente**, quero cadastrar empresas locadoras, para vinculá-las aos contratos de aluguel. | Razão social e CNPJ válido e único. | M |
| HU15 | Como **agente**, quero registrar o contrato de crédito de um contrato de aluguel, para financiar o aluguel. | Banco, valor financiado > 0, juros ≥ 0 % a.m., 1–120 parcelas; parcela calculada pela Tabela Price; um crédito por contrato. | A |
| HU16 | Como **agente**, quero cadastrar outros agentes com uma chave administrativa, para controlar quem tem acesso ao painel. | `POST /api/usuarios/agente` exige o cabeçalho `X-Codigo-Administrativo`. | M |

## Rastreabilidade

| História | Endpoint(s) |
|---|---|
| HU01, HU02 | `POST /api/usuarios/cadastro` |
| HU03 | `POST /api/usuarios/login`, `POST /api/usuarios/logout`, `GET /api/usuarios/me` |
| HU04, HU10 | `GET/POST/PUT/DELETE /api/automoveis` |
| HU05–HU07 | `POST/PUT/DELETE /api/solicitacoes`, `GET /api/solicitacoes/minhas` |
| HU08, HU09 | `POST /api/contratos`, `GET /api/contratos/solicitacao/{id}`, `GET /api/contratos/{id}/pdf` |
| HU11, HU12 | `PUT /api/solicitacoes/{id}/avaliacao`, `GET /api/solicitacoes/{pendentes\|aprovadas\|recusadas}` |
| HU13 | `GET/POST /api/bancos` |
| HU14 | `GET/POST /api/empresas` |
| HU15 | `POST /api/contratos-credito`, `GET /api/contratos-credito/contrato/{id}` |
| HU16 | `POST /api/usuarios/agente` |
