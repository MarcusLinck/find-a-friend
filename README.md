# 🐾 FindAFriend API

> Uma API RESTful desenvolvida em Node.js com TypeScript para conectar pessoas que procuram adotar um animal de estimação a organizações de proteção animal (ONGs), aplicando os mais altos padrões de arquitetura de software e testes automatizados.

---

## 🚀 Sobre o Projeto

O **FindAFriend** é o desafio final da formação em Node.js. O objetivo da aplicação é prover uma plataforma onde ONGs possam cadastrar animais disponíveis para adoção com características detalhadas (idade, nível de energia, tamanho, ambiente, etc.), e os adotantes possam buscar e filtrar esses pets por cidade e critérios específicos para encontrar o companheiro ideal.

---

## 🛠️ Tecnologias e Ferramentas

| Tecnologia | Descrição |
|------------|-----------|
| [Node.js](https://nodejs.org/) | Ambiente de execução JavaScript/TypeScript server-side |
| [TypeScript](https://www.typescriptlang.org/) | Superset JavaScript com tipagem estática |
| [Fastify](https://www.fastify.io/) | Framework web rápido e de baixo overhead |
| [Prisma ORM](https://www.prisma.io/) | ORM moderno para interações seguras com o banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Zod](https://zod.dev/) | Validação de esquemas e dados em tempo de execução |
| [JWT & Cookies](https://github.com/fastify/fastify-jwt) | Autenticação segura de rotas |
| [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) | Hash seguro de senhas |
| [Vitest](https://vitest.dev/) | Framework de testes unitários e E2E ultrarrápido |
| [Docker & Docker Compose](https://www.docker.com/) | Containerização de serviços e ambientes |

---

## 🏛️ Arquitetura e Padrões

O projeto segue estritamente os princípios de **Clean Architecture** e **SOLID**, garantindo baixo acoplamento e alta testabilidade:

* **Domain / Use Cases**: Regras de negócio totalmente isoladas do framework web e do banco de dados
* **Repositories Pattern**: Desacoplamento da persistência de dados através de interfaces, permitindo o uso de repositórios em memória para testes unitários rápidos
* **Factories**: Padrão de fábrica para injeção de dependências nos controladores
* **Test Isolation**: Testes E2E executados com isolamento completo de banco de dados utilizando schemas dinâmicos no PostgreSQL por suíte de testes

---

## 📋 Requisitos de Negócio (Regras)

- [x] Deve ser possível cadastrar uma ONG
- [x] Deve ser possível realizar login como ONG
- [x] Deve ser possível cadastrar um pet vinculado a uma ONG autenticada
- [x] Deve ser possível listar todos os pets disponíveis em uma cidade
- [x] Deve ser possível filtrar pets por suas características (idade, tamanho, nível de energia, independência, ambiente)
- [x] Deve ser possível visualizar detalhes específicos de um pet
- [x] As senhas das ONGs devem ser criptografadas de forma segura
- [x] Rotas sensíveis (como cadastro de pets) devem ser protegidas por autenticação JWT

---

## 📁 Estrutura do Projeto

```
src/
├── @types/                 # Extensões de tipos (ex: fastify-jwt)
├── env/                    # Configuração e validação de variáveis de ambiente
├── http/
│   ├── controllers/        # Controladores HTTP (camada de apresentação)
│   │   ├── orgs/          # Rotas de ONGs (register, authenticate)
│   │   └── pets/          # Rotas de Pets (register, search, get-details)
│   └── middlewares/       # Middlewares (ex: verify-jwt)
├── lib/                   # Configurações de bibliotecas (Prisma client)
├── repositories/          # Camada de acesso a dados
│   ├── in-memory/         # Implementações em memória para testes
│   └── prisma/            # Implementações com Prisma/PostgreSQL
├── use-cases/             # Regras de negócio (casos de uso)
│   ├── errors/           # Erros customizados da aplicação
│   └── factories/        # Factories para injeção de dependência
├── app.ts                # Configuração do Fastify
└── server.ts             # Ponto de entrada da aplicação
```

---

## 📦 Como Executar o Projeto

### Pré-requisitos

- Node.js (v20+)
- Gerenciador de pacotes `pnpm`
- Docker e Docker Compose

### 1. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/SEU_USUARIO/find-a-friend.git
cd find-a-friend
pnpm install
```

### 2. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/findafriend?schema=public"
JWT_SECRET="sua-chave-secreta-jwt-super-segura"
```

### 3. Subir o Banco de Dados com Docker

```bash
docker compose up -d
```

### 4. Executar as Migrations do Prisma

```bash
pnpm prisma migrate dev
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

A API estará rodando em **http://localhost:3333**.

---

## 🧪 Rodando os Testes

O projeto conta com uma suíte completa de Testes Unitários e Testes End-to-End (E2E):

```bash
# Rodar testes unitários
pnpm test

# Rodar testes unitários em modo watch
pnpm test:watch

# Rodar testes E2E (requer banco de dados rodando)
pnpm test:e2e

# Rodar testes E2E em modo watch
pnpm test:e2e:watch
```

---

## 📚 Endpoints da API

### Autenticação & ONGs

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `POST` | `/orgs` | Cadastrar nova ONG | ❌ |
| `POST` | `/sessions` | Login da ONG (retorna JWT) | ❌ |

### Pets

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `POST` | `/pets` | Cadastrar novo pet | ✅ (JWT) |
| `GET` | `/pets` | Listar pets por cidade (com filtros) | ❌ |
| `GET` | `/pets/:petId` | Buscar detalhes de um pet | ❌ |

#### Filtros de busca de pets (`GET /pets`)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `city` | string | Cidade (obrigatório) |
| `age` | string | Idade do pet |
| `size` | string | Tamanho do pet |
| `energyLevel` | string | Nível de energia |
| `independence` | string | Nível de independência |
| `environment` | string | Tipo de ambiente |

---

## 🐳 Executando via Docker (Produção)

Para gerar e rodar a aplicação containerizada:

```bash
# Construir a imagem Docker
docker build -t find-a-friend-api .

# Executar o container
docker run -p 3333:3333 --env-file .env find-a-friend-api
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo para estudos e melhorias!

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request