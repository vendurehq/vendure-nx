import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    outDir: join(__dirname, '../../dist/apps/dashboard'),
  },
  plugins: [
    vendureDashboardPlugin({
      tempCompilationDir: join(__dirname, './__vendure-dashboard-temp'),
      vendureConfigPath: pathToFileURL(
        join(__dirname, '../../libs/util-config/src/lib/vendure-config.ts'),
      ),
      // Points to the location of your Vendure server.
      api: {
        host: process.env.API_PUBLIC_URL ?? 'http://localhost',
        port: +((process.env.API_PUBLIC_PORT as string) ?? 3000),
      },
      gqlOutputPath: join(__dirname,'./src/gql'),
      pathAdapter: {
        getCompiledConfigPath: ({
          inputRootDir,
          outputPath,
          configFileName,
        }) => {
          const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
          const pathAfterProject = inputRootDir.split(
            `/libs/${projectName}`,
          )[1];
          const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
          return join(compiledConfigFilePath, configFileName);
        },
        transformTsConfigPathMappings: ({ phase, patterns }) => {
          if (phase === 'loading') {
            return patterns.map(p =>
              p.replace('libs/', '').replace(/.ts$/, '.js'),
            );
          }
          return patterns;
        },
      },
    }),
  ],
  resolve: {
    alias: {
      // This allows all plugins to reference a shared set of
      // GraphQL types.
      '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
    },
  },
});
