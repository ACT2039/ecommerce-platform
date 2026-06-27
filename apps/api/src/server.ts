import { env } from './config/env'; // This ensures env is validated before starting
import { createServer } from './app';
import { logger } from './utils/logger';

const port = env.PORT || 4000;

const server = createServer();

server.listen(port, () => {
  logger.info(`API listening on http://localhost:${port} in ${env.NODE_ENV} mode`);
});
