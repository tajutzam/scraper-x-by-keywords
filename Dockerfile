
FROM apify/actor-node-playwright-chrome:24

RUN npm ls @crawlee/core apify playwright

COPY --chown=myuser:myuser package*.json ./

RUN npm --quiet set progress=false \
    && npm install --include=dev --audit=false \
    && echo "Installed NPM packages:" \
    && (npm list --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version

COPY --chown=myuser:myuser . ./

CMD ["npx", "tsx", "src/main.ts"]
