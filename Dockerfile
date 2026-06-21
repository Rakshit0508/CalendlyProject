FROM node:22

RUN npm install -g pnpm

WORKDIR /app/calendly_backend

COPY . .

RUN pnpm install 

CMD ["pnpm","dev"]