FROM node:13

WORKDIR "/app"
COPY docker/client/start.sh /start.sh
RUN chmod +x /start.sh

# Run entrypoint under Tini
ENTRYPOINT ["/start.sh"]
