// My HydraDX Validator Address (identity: iMiroslav)
const VALIDATOR_ADDR = '7Ni7k6VzmMamc5XixohFCmMYe6WYeqqgkqSGhupA8FMEhHFP';
const PARENT_VALIDATOR_ADDR =
  '7Lzt2oxZiPdwzTKKZFEV6xfhyfJhMsqyQkwK9EHhy8cHXyLa';

const MY_DONATION_DOT_ADDR = '15omeN8MJUhcvjAjdSqWq9UUjmtE7guKXWK4Ew2nj2czmrjp';
const HYDRASIK_ADDR = '7NzHitwWA5UidhXiNJSTipSwbXgDfikKefdY9kB69sBJxPS7';

/**
 * Chain snippets
 */
const chain = await this.api.rpc.system.chain();
const chain = await this.api.rpc.system.chain();
const nodeName = await this.api.rpc.system.name();
const nodeVersion = await this.api.rpc.system.version();
const header = await this.api.rpc.chain.getHeader();
const now = await (await this.api.query.timestamp.now()).toNumber(); // return time from UTC

const events = await api.query.system.events.at(header.hash);

const blockEvents = await api.query.system.events.at(
  '0x1e256ef083f7a57d7ea582d3c556f0126a0e9ddaffa20cbb9816c9d21a8feb89'
);
console.log('Info: ', JSON.stringify(blockEvents.toHuman(), undefined, 3));

const eventData = api.events.staking.Reward.is(blockEvents[1].event);
//console.log('Info: ', JSON.stringify(eventData.toHuman() , undefined, 5));

blockEvents.forEach(async (record, index) => {
  const { event, phase } = record;
  console.log(`
 ${event.section},    
 ${event.method},
 ${phase.toString()},
 ${JSON.stringify(event.data)}`);
});

/**
 * Identity informations
 */

// validator Info
const info = await api.derive.accounts.info(VALIDATOR_ADDR);
console.log(`Validator Info: ${JSON.stringify(info, undefined, 2)}`);

// paretnt validator Info
const info2 = await api.derive.accounts.info(PARENT_VALIDATOR_ADDR);
console.log(`Parent validator Info: ${JSON.stringify(info2, undefined, 2)}`);

const stringifySubstrateInfo = (info, name) => {
  console.log(`==== Substrate info ${name} BEGIN: ====`);
  Object.keys(info).map((key, value) => {
    console.log(`${key}: ${value.toString()}`);
  });
  console.log(`==== Substrate info ${name} END: ====`);
};

/**
 * STAKING INFORMATION - QUERIES
 */

/**
 * @description The active era information, it holds index and start. The active era is the era being currently rewarded.
 * Validator set of this era must be equal to  [SessionInterface::validators].
 * @czechComments
 */
const activeEra = await api.query.staking.activeEra();
console.log(`Query result: ${JSON.stringify(activeEra, undefined, 2)}`);

/**
 * @description This is the latest planned era, depending on how the Session pallet queues the validator set, it might be active or not.
 * @czechComments většinou o 1 větší než activeEra
 */
const currentEra = await api.query.staking.currentEra();
console.log(`Query result: ${JSON.stringify(currentEra, undefined, 2)}`);

/**
 * @description Number of eras to keep in history. Information is kept for eras in [current_era - history_depth; current_era].
 * Must be more than the number of eras delayed by session otherwise. I.e. active era must always be in history.
 * I.e. active_era > current_era - history_depth must be guaranteed.
 * @czechComments
 */
const historyDepth = await api.query.staking.historyDepth();
console.log(`Query result: ${JSON.stringify(historyDepth, undefined, 2)}`);

/**
 * @description Minimum number of staking participants before emergency conditions are imposed.
 * @czechComments
 */
const minimumValidatorCount = await api.query.staking.minimumValidatorCount();
console.log(
  `Query result: ${JSON.stringify(minimumValidatorCount, undefined, 2)}`
);

/**
 * @description The ideal number of staking participants.
 * @czechComments
 */
const validatorCount = await api.query.staking.validatorCount();
console.log(`Query result: ${JSON.stringify(validatorCount, undefined, 2)}`);

/**
 * @description The map from (wannabe) validator stash key to the preferences of that validator.
 * @czechComments Vrací nastavení validátora (commision, blocked)
 */
const validators = await api.query.staking.validators(VALIDATOR_ADDR);
console.log(`Query result: ${JSON.stringify(validators, undefined, 2)}`);

/**
 * @description: Rewards for the last HISTORY_DEPTH eras. If reward hasn't been set or has been removed then 0 reward is returned
 * @czechComments
 */
const erasRewardPoints = await api.query.staking.erasRewardPoints();
console.log(`Query result: ${JSON.stringify(erasRewardPoints, undefined, 2)}`);

/**
 * @description:
 * @czechComments
 */
const erasStartSessionIndex = await api.query.staking.erasStartSessionIndex(
  ERA_NR
);
console.log(
  `Query result: ${JSON.stringify(erasStartSessionIndex, undefined, 2)}`
);

/**
 * @description Map from all (unlocked) "controller" accounts to the info regarding the staking.
 * @czechComments vrací základní statistiku a pak seznam eras, kde byl claimedRewards
 */
const ledger = await api.query.staking.ledger(HYDRASIK_ADDR);
console.log(`Query result: ${JSON.stringify(ledger, undefined, 2)}`);

/**
 * Staking Used in eraGrabber
 */

const HYDRASIK_ADDR = '7NzHitwWA5UidhXiNJSTipSwbXgDfikKefdY9kB69sBJxPS7';
const validators = await api.query.staking.validators(HYDRASIK_ADDR);
console.log(`Query result: ${JSON.stringify(validators, undefined, 2)}`);

const eraStakers = await api.query.staking.erasStakers(55, HYDRASIK_ADDR);
console.log(`Query result: ${JSON.stringify(eraStakers, undefined, 2)}`);

const erasRewardPoints = await api.query.staking.erasRewardPoints(55);
console.log(`Query result: ${JSON.stringify(erasRewardPoints, undefined, 2)}`);

const erasValidatorReward = await api.query.staking.erasValidatorReward(55);
console.log(
  `Query result: ${JSON.stringify(erasValidatorReward, undefined, 2)}`
);

/**
 * STAKING DERIVES
 */

/**
 * @czechComments základní informace o aktivní a current era, jací jsou validátoři a jací jsou next elected v rámci session
 */
const overview = await api.derive.staking.overview();
console.log(`Query result: ${JSON.stringify(overview, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

/**
 * @description Retrieves all the session and era query and calculates specific values on it as the length of the session and eras
 * @czechComments základní informace o nastavení chainu. !!! Lze použít do Statusu, jen je třeba převádět informace na numbers
 */
const sessionInfo = await api.derive.session.info();
console.log(`Query result: ${JSON.stringify(sessionInfo, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

/**
 * @czechComments vrací všechny historické ery (do history depth) a k nim validátory a jejich Prefs (commisions, blocked). Obdoba api.query.staking.validators(ADDR)
 * !!! Bohužel nevrací start ery
 */
const erasPrefs = await api.derive.staking.erasPrefs();
console.log(`Query result: ${JSON.stringify(erasPrefs, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

/**
 * @czechComments kombinace validátorů a nominátorů ve všech érách (asi do HISTORY_DEPHT), a výše slashe
 */
const erasExposure = await api.derive.staking.erasExposure();
console.log(`Query result: ${JSON.stringify(erasExposure, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

/**
 * @czechComments
 */
const erasSlashes = await api.derive.staking.erasSlashes();
console.log(`Query result: ${JSON.stringify(erasSlashes, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

/**
 * STAKING SESSION DERIVES
 */

const progress = await api.derive.session.progress();
console.log(`Query result: ${JSON.stringify(progress, undefined, 2)}`);
stringifySubstrateInfo(sessionInfo, `Query result`);

// -----------------------------------

const [validatorAddresses, stakingOverview, nominators] = await Promise.all([
  api.query.session.validators(),
  api.derive.staking.overview(),
  api.query.staking.nominators.entries(),
]);

stringifySubstrateInfo(validatorAddresses, 'Validator Addresses');
stringifySubstrateInfo(stakingOverview, 'Staking Overview');
stringifySubstrateInfo(nominators, 'Nominators');

// staking parameters
const maxNominatorRewardedPerValidator = await api.consts.staking
  .maxNominatorRewardedPerValidator;
console.log(
  `Max Rewarded Validators ${maxNominatorRewardedPerValidator.toString()}`
);

const sessionsPerEra = await api.consts.staking.sessionsPerEra;
console.log(
  `Sessions Per GRANDPA Era (finalization): ${sessionsPerEra.toString()}`
);

// ===========================  Extrinsics:BEGIN ===============

// no blockHash is specified, so we retrieve the latest
const BLOCK_NUMBER = 266904;
const blockHash = await api.rpc.chain.getBlockHash(BLOCK_NUMBER);
const sessionIndex = await api.query.session.currentIndex.at(blockHash);
const startDateTime = await api.query.timestamp.now.at(blockHash);
const events = await api.query.system.events.at(blockHash);
const signedBlock = await api.rpc.chain.getBlock(blockHash);

// the information for each of the contained extrinsics
signedBlock.block.extrinsics.forEach((ex, index) => {
  // the extrinsics are decoded by the API, human-like view
  const exHuman = ex.toHuman();

  const { method: globalMethod, isSigned, signer } = ex;
  //@ts-ignore
  const { args, method, section } = globalMethod.toHuman();
  console.log('===== NEW =======');
  console.log('----- method --------');
  console.log(method);
  console.log('----- section--------');
  console.log(section);
  console.log('----- args --------');
  console.log(JSON.stringify(args, undefined, 2));

  /*
  // !!! documentation is accessible only if you do not do toHuman() function
  console.log('======== documentation ===========');
  console.log(meta.documentation.map((d) => d.toString()).join('\n'));

  // signer/nonce info
  if (isSigned) {
    console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
  }
  */
});

console.log('----- events -----');
console.log(JSON.stringify(events.toHuman(), undefined, 2));

// ===========================  Extrinsics:END ===============

// === Funds Locked in Nirvana during Gen2 and Gen3 ==============

const ACCOUNTS = [
  '7KZaTmriQDAcKAF9xbGnxQQksseZSzcPTX3BdkKxPwzF7Y8B',
  '7NakBh7FhckZX63La4s4FSszNRPXryRuuyP6mfgokpT8abZf',
  '7NSGubcW8Yobh1RMVKJs2UtBRnVGVztwaYWunqvZRwuahuLQ',
  '7MStThEUx6VVXWGwpp4UMSoehgojyPvu6t5yrkFmKMPLB6QN',
];

let x = 0;
for (const ACC of ACCOUNTS) {
  x++;
  console.log(`\n==== account nr. ${x} ===== `);
  const ledger = await api.query.staking.ledger(ACC);
  console.log(JSON.stringify(ledger, undefined, 2));
  console.log('---ledger details -----');
  console.log('total : ', ledger.toJSON().total / 1000000000000);
  console.log('active : ', ledger.toJSON().active / 1000000000000);
  let i = 0;
  ledger.toJSON().unlocking.forEach((item) => {
    i++;
    console.log(`unlocking value ${i}: `, item.value / 1000000000000);
  });
}

/////
const ACC = '7JTSL7V5hzxt7K97TJJkMSQ3cptf9Xf577DPqheRg32XrHKo';
const info = await api.query.balances.locks(ACC);
console.log(JSON.stringify(info.toHuman(), undefined, 2));

const info2 = await api.query.system.account(ACC);
console.log(JSON.stringify(info2.toHuman(), undefined, 2));

const ledgerOption = await api.query.staking.ledger(ACC);
console.log(JSON.stringify(ledgerOption.toHuman(), undefined, 2));

// zkusit hledat ty, kde Ledger.total > ledger.active
