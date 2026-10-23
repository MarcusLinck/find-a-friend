# Estágio 1: Instalação de dependências e build
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN pnpm install

# Copiar o restante do código fonte
COPY . .

# Gerar o cliente Prisma e fazer o build da aplicação TypeScript
RUN pnpm prisma generate
RUN pnpm build

# Estágio 2: Imagem final para produção (enxuta)
FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

# Copiar apenas os arquivos essenciais do build e dependências de produção
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

CMD ["node", "dist/server.js"]