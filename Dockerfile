FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.* ./
RUN npm install

# Build the application
COPY . .
RUN npm run build
RUN npm run generate

# ====================================
FROM build as release

CMD ["npm", "run", "start"]