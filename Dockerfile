# Gunakan image Node.js resmi sebagai base image
FROM node:16-alpine

# Atur working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependencies
RUN npm install

# Salin seluruh kode aplikasi ke container
COPY . .

# Build aplikasi untuk produksi
RUN npm run build

# Gunakan image nginx untuk serving file build
FROM nginx:alpine

# Salin file build Vue.js ke direktori nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80 untuk akses HTTP
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
