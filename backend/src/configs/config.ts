import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 4006,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  chain: {
    name: 'near',
    decimalPlaces: 24,
  },
  tasks: {
    runAtStartup: process.env.TASKS_AT_STARTUP || '',
  },
};

export default (): Config => config;
