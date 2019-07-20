FROM sqitch/sqitch:latest

ENV SQITCH_PASSWORD example

COPY . .

ENTRYPOINT ["/bin/bash"]
CMD ["./migrate-up.sh"]