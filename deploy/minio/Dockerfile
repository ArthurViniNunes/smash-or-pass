FROM golang:1.25-alpine AS build
RUN apk add --no-cache git ca-certificates
RUN CGO_ENABLED=0 GOBIN=/out go install github.com/minio/minio@7aac2a2c5b7c882e68c1ce017d8256be2feea27f
RUN CGO_ENABLED=0 GOBIN=/out go install github.com/minio/mc@77f82e18b5401a65958f1619df6ebb994634bd88

FROM alpine:3.23
RUN apk add --no-cache ca-certificates
COPY --from=build /out/minio /out/mc /usr/local/bin/
ENTRYPOINT ["minio"]
