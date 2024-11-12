
FROM node:18-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 5173

# --host for listen to  all "interfaces" .....
CMD ["npm", "run", "dev", "--", "--host"]
