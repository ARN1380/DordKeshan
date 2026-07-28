FROM alpine:3.20

RUN apk add --no-cache ca-certificates unzip wget

ARG PB_VERSION=0.25.4
RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /usr/local/bin \
    && rm /tmp/pb.zip \
    && chmod +x /usr/local/bin/pocketbase

COPY bootstrap.sh /bootstrap.sh
COPY seed.sh /seed.sh
RUN chmod +x /bootstrap.sh /seed.sh

EXPOSE 8090

ENTRYPOINT ["/bootstrap.sh"]
