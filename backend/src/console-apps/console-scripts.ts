import { PrismaService } from '../app/prisma/prisma.service';
import { NearService } from '../app/near/near.service';
import { waitFor } from '../utils';
import { Command, Option } from 'commander';
import * as dotenv from 'dotenv';

// npx ts-node -r tsconfig-paths/register src/console-apps/console-scripts.ts -s cosi
//node ./dist/console-apps/console-scripts.js -s cosi

dotenv.config();

const program = new Command();
program
  .addOption(new Option('-s, --script <scriptName>', 'select script to run'))
  .parse();

const options = program.opts();

const prisma = new PrismaService();
const nearService = new NearService(null, prisma);

const main = async () => {
  let now = new Date();
  const script = options.script;
  console.log(`Task ${script}, started at ${now.toLocaleTimeString()}`);

  try {
    if (script === 'init') {
      await nearService.onModuleInit();
      await prisma.deleteDatabase();
      await nearService.refSaveTokens();
      await nearService.refSavePools();
    }

    if (script === 'tokens') {
      await nearService.onModuleInit();
      await nearService.refSaveTokens();
    }

    if (script === 'pools') {
      await nearService.onModuleInit();
      await nearService.refSavePools();
    }

    // TODO ---- dodělat
    if (script === 'volume') {
      await nearService.onModuleInit();
      //await nearService.refSavePoolVolume();   --> refService
    }

    if (script === 'farms') {
      await nearService.onModuleInit();
      await nearService.refSaveSeeds();
      await nearService.refSaveFarms();
    }
  } catch (e) {
    throw new Error(e);
  }

  now = new Date();
  console.log(`Task ${script}, finished at ${now.toLocaleTimeString()}`);
};

main()
  .then((result) => {
    console.log('All Done!');
  })
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
