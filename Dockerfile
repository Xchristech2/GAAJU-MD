FROM quay.io/qasimtech/gaaju-bot:latest

WORKDIR /root/mega-md

RUN git clone https://github.com/Xchristech2/GAAJU-MD . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
