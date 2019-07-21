FROM sqitch/sqitch:latest

COPY . .

ADD migrate-up.sh /migrate-up.sh

ENTRYPOINT ["/migrate-up.sh"]
