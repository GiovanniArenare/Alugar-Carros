# AlugaCar — Sistema de Aluguel de Carros

## 1. Sobre o projeto

O **AlugaCar** é um sistema web desenvolvido para gerenciamento de solicitações de aluguel de automóveis. A aplicação permite que clientes cadastrem solicitações de aluguel e acompanhem seu andamento, enquanto agentes podem cadastrar automóveis e realizar avaliações financeiras das solicitações.

O sistema foi desenvolvido como projeto acadêmico da disciplina **Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da PUC Minas.

## 2. Objetivos

O objetivo do projeto é desenvolver uma aplicação web que facilite o gerenciamento do processo de aluguel de automóveis, integrando clientes e agentes em uma única plataforma.

A aplicação busca:
- Facilitar o cadastro e a autenticação de usuários.
- Permitir o cadastro e a consulta de automóveis.
- Gerenciar solicitações de aluguel.
- Possibilitar a avaliação financeira por agentes.
- Permitir a geração e consulta de contratos de aluguel.

## 3. Funcionalidades

### Área do cliente
- Cadastro de novos usuários.
- Login e autenticação.
- Visualização dos automóveis disponíveis.
- Criação de solicitações de aluguel.
- Edição de solicitações pendentes.
- Consulta do andamento das solicitações.
- Cancelamento de solicitações pendentes.
- Consulta e geração de contratos para solicitações aprovadas.

### Área do agente
- Login e autenticação como agente.
- Cadastro de automóveis.
- Visualização dos automóveis cadastrados.
- Edição e exclusão de automóveis.
- Visualização de solicitações de aluguel.
- Avaliação financeira das solicitações.
- Aprovação ou recusa de solicitações.
- Registro de parecer financeiro.

### Gerenciamento de contratos
- Criação de contratos para solicitações aprovadas.
- Registro de informações do contratante.
- Consulta dos contratos associados às solicitações.

## 4. Tecnologias utilizadas

### Frontend
- React
- Vite
- JavaScript
- HTML5
- CSS3
- React Router

### Backend
- Java 25
- Spring Boot 4.0.x
- Spring Security
- Spring Data JPA
- Apache Maven

### Banco de dados
- Supabase
- PostgreSQL

### Ferramentas
- Visual Studio Code
- Git
- GitHub
- PowerShell

## 5. Arquitetura do sistema

O projeto utiliza uma arquitetura dividida em duas partes principais:

**Frontend:** desenvolvido em React com Vite, responsável pela interface visual e pela interação com os usuários.

**Backend:** desenvolvido em Java com Spring Boot, responsável pelas regras de negócio, autenticação, processamento das solicitações e comunicação com o banco de dados.

**Banco de dados:** utiliza PostgreSQL hospedado no Supabase para armazenar os dados da aplicação.

A comunicação entre frontend e backend acontece por meio de requisições HTTP para uma API REST.

## 6. Estrutura do projeto

```text
Alugar-Carros/
│
├── backend/
│   └── sistema-aluguel/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/br/com/alugarcarros/sistema/
│       │   │   │   ├── config/
│       │   │   │   ├── controller/
│       │   │   │   ├── dto/
│       │   │   │   ├── model/
│       │   │   │   ├── repository/
│       │   │   │   └── service/
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 7. Como executar o projeto

### Pré-requisitos

Antes de executar a aplicação, é necessário ter instalado:

- Java JDK 25.
- Node.js e npm.
- Git.
- Uma conta no Supabase.

### 7.1. Configuração do banco de dados

1. Crie um projeto no Supabase.
2. Acesse as configurações de conexão do banco PostgreSQL.
3. Obtenha os dados de conexão necessários.
4. Configure as variáveis de ambiente no terminal antes de iniciar o backend.

No PowerShell, configure:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://SEU_HOST:5432/postgres"
$env:SPRING_DATASOURCE_USERNAME="SEU_USUARIO"
$env:SPRING_DATASOURCE_PASSWORD="SUA_SENHA"
$env:APP_ADMIN_KEY="SUA_CHAVE_ADMINISTRATIVA"
```

Substitua os valores pelos dados do seu projeto Supabase.

A variável `APP_ADMIN_KEY` é utilizada para proteger o cadastro de agentes.

**Importante:** não compartilhe suas credenciais e não as envie para o GitHub.

### 7.2. Executando o backend

Abra um terminal na pasta do backend:

```powershell
cd backend/sistema-aluguel
```

Execute a aplicação:

```powershell
.\mvnw.cmd spring-boot:run
```

O backend será iniciado em:

```text
http://localhost:8080
```

### 7.3. Executando o frontend

Abra outro terminal na pasta do frontend:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

Com o backend e o frontend em execução, acesse o endereço do frontend pelo navegador.

## 8. Principais endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/usuarios/cadastro` | Cadastro de cliente |
| POST | `/api/usuarios/login` | Autenticação |
| POST | `/api/usuarios/logout` | Encerramento da sessão |
| GET | `/api/usuarios/me` | Consulta do usuário autenticado |
| POST | `/api/usuarios/agente` | Cadastro de agente |
| POST | `/api/automoveis` | Cadastro de automóvel |
| GET | `/api/automoveis` | Listagem de automóveis |
| PUT | `/api/automoveis/{id}` | Atualização de automóvel |
| DELETE | `/api/automoveis/{id}` | Exclusão de automóvel |
| POST | `/api/solicitacoes` | Criação de solicitação |
| GET | `/api/solicitacoes/minhas` | Solicitações do cliente |
| PUT | `/api/solicitacoes/{id}` | Atualização de solicitação |
| DELETE | `/api/solicitacoes/{id}` | Cancelamento de solicitação |
| GET | `/api/solicitacoes/pendentes` | Solicitações pendentes |
| GET | `/api/solicitacoes/aprovadas` | Solicitações aprovadas |
| GET | `/api/solicitacoes/recusadas` | Solicitações recusadas |
| PUT | `/api/solicitacoes/{id}/avaliacao` | Avaliação financeira |
| POST | `/api/contratos` | Criação de contrato |
| GET | `/api/contratos/solicitacao/{id}` | Consulta de contrato |

Os endpoints protegidos exigem autenticação.

## 9. Modelo de funcionamento

O fluxo principal da aplicação acontece da seguinte maneira:

1. O cliente realiza seu cadastro e acessa o sistema.
2. O cliente consulta os automóveis disponíveis.
3. O cliente seleciona um automóvel e cria uma solicitação de aluguel.
4. O agente acessa as solicitações e realiza a avaliação financeira.
5. A solicitação pode ser aprovada ou recusada.
6. Quando aprovada, a solicitação fica disponível para a geração do contrato.
7. O cliente pode consultar e gerar o contrato correspondente.

### Status das solicitações

- `PENDENTE`: solicitação aguardando avaliação.
- `EM_ANALISE`: solicitação em análise.
- `APROVADA`: solicitação aprovada.
- `RECUSADA`: solicitação recusada.
- `CANCELADA`: solicitação cancelada.

### Status dos contratos

- `AGUARDANDO_ASSINATURA`
- `EM_EXECUCAO`
- `FINALIZADO`
- `CANCELADO`

## 10. Testes

O projeto possui estrutura de testes no backend utilizando as ferramentas de testes do Spring Boot.

Para executar os testes do backend:

```powershell
cd backend/sistema-aluguel
.\mvnw.cmd test
```

Para verificar o frontend com o ESLint:

```powershell
cd frontend
npm run lint
```
## 11. Acesso para demonstração

O sistema possui dois perfis de acesso:

- **Cliente:** permite consultar automóveis, criar solicitações e acompanhar contratos.
- **Agente:** permite cadastrar automóveis e avaliar solicitações de aluguel.

As credenciais de demonstração serão disponibilizadas durante a apresentação do projeto.

## 12. Repositório

O código-fonte do projeto está disponível no GitHub:

[https://github.com/GiovanniArenare/Alugar-Carros](https://github.com/GiovanniArenare/Alugar-Carros)

## 13. Autor

**Giovanni Arenare**

Estudante de Engenharia de Software — PUC Minas.

GitHub: [@GiovanniArenare](https://github.com/GiovanniArenare)

## 14. Agradecimentos

Projeto desenvolvido como atividade acadêmica da disciplina Desenvolvimento e Integração de Aplicações Web, do curso de Engenharia de Software da PUC Minas.

Agradecimentos aos professores e a todos que contribuíram para o desenvolvimento do projeto.

## 15. Licença

Este projeto foi desenvolvido para fins acadêmicos.
