FROM mongo:6.0

RUN apt-get update && apt-get install -y curl jq

WORKDIR /loader
COPY loader/download-db.sh loader/import-db.sh ./
RUN chmod +x download-db.sh import-db.sh

CMD ["bash", "-c", "./download-db.sh && ./import-db.sh mongodb://root:example@mongo:27017/find-my-anime"]
