import {
  bootstrap,
  DefaultJobQueuePlugin,
  LogLevel,
  DefaultLogger,
  mergeConfig,
} from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { config } from '@vendure-nx/util-config';
import { initialData, PRODUCTS_CSV_PATH } from '@vendure-nx/util-testing';
import * as path from 'path';

const mergedConfig = mergeConfig(config, {
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  dbConnectionOptions: {
    synchronize: true,
    migrations: [path.join(__dirname, '../../migrations/*.js')],
  },
  plugins: (config.plugins || [])
    .filter((p: any) => {
      const name = typeof p === 'function' ? p.name : '';
      // Skip the BullMQ plugin, as it is not needed for the populate script and can cause issues if Redis is not running
      return !name.includes('BullMQ');
    })
    .concat(DefaultJobQueuePlugin),
});

populate(() => bootstrap(mergedConfig), initialData, PRODUCTS_CSV_PATH)
  .then(app => app.close())
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
