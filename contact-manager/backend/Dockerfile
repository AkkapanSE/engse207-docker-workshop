FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# เปลี่ยนจาก npm ci เป็น npm install
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]