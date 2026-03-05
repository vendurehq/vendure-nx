import { config } from '@vendure-nx/util-config';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import {
  bootstrap,
  JobQueueService,
  mergeConfig,
  runMigrations,
} from '@vendure/core';
import * as path from 'path';

const mergedConfig = mergeConfig(config, {
  dbConnectionOptions: {
    migrations: [path.join(__dirname, '../../migrations/*.js')],
  },
  plugins: [
    ...config.plugins,
    DashboardPlugin.init({
      route: 'dashboard',
      appDir: path.join(__dirname, '../admin-dashboard'),
    }),
  ],
});

runMigrations(mergedConfig)
  .then(() => bootstrap(mergedConfig))
  .then((app) => {
    if (process.env.RUN_JOB_QUEUE === '1') {
      app.get(JobQueueService).start();
    }
  })
  .catch((err: any) => {
    // tslint:disable-next-line:no-console
    console.log(err);
    process.exit(1);
  });
