FROM docker.elastic.co/elasticsearch/elasticsearch:7.10.0
RUN bin/elasticsearch-plugin install https://github.com/MLnick/elasticsearch-vector-scoring/releases/download/v5.4.0/elasticsearch-vector-scoring-5.4.0.zip
