FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "if [ -d prisma/migrations ] && [ \"$(ls -A prisma/migrations)\" ]; then npx prisma migrate deploy; else echo 'No Prisma migrations found, skipping migrate deploy'; fi && node dist/src/main.js"]
