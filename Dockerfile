FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ENV MODEL_URL=https://storage.googleapis.com/mlgc-malvin/model-in-prod/model.json
EXPOSE 3000

CMD ["npm","run", "start"]