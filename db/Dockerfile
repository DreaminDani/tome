FROM sqitch/sqitch:latest

ENV SQITCH_PASSWORD example

COPY . .

ADD migrate-up.sh /migrate-up.sh

ENTRYPOINT ["/migrate-up.sh"]