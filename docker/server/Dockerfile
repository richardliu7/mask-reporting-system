FROM node:13

WORKDIR "/app"
COPY docker/server/start.sh /start.sh
RUN chmod +x /start.sh

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Run entrypoint under Tini
CMD ["/start.sh"]
