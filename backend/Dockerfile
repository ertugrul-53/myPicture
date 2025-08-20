
FROM node:20
WORKDIR /app
# 3. Paketleri kopyala ve kurma
COPY package*.json ./
RUN npm install
# 4. Kodları kopyalama
COPY . 
# 5. Port 
EXPOSE 5000
# 6. Çalıştırma
CMD ["node", "index.js"]
