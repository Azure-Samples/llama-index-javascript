FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
#TODO: send a PR to LlamaIndex.ts upstrea and remove this patch
COPY llamaindex-0.3.16-aoai-mi.tgz ./

COPY package.json package-lock.* ./
RUN npm install

# Build the application
COPY . .
RUN npm run build

# ====================================
FROM build as release

CMD ["npm", "run", "start"]