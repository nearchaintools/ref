# TESTNET

export TEST_CONTRACT_ID=ref-finance.testnet
npx near login

## Query pools

npx near view $TEST_CONTRACT_ID get_pools '{"from_index": 0, "limit": 10}'

## Query whitelisted tokens

npx near view $CONTRACT_ID get_whitelisted_tokens


# MAINNET

npx near login --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet --walletUrl=https://wallet.near.org
export CONTRACT_ID=v2.ref-finance.near
export REF_FARM_CONTRACT_ID=v2.ref-farming.near
export USER_ID=imiroslav.near
export TOKEN_ID=token.v2.ref-finance.near

npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID get_pools '{"from_index": 0, "limit": 10}'
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID get_pool_volumes '{"pool_id": 0}'
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID get_pool '{"pool_id": 0}'
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID get_pool_total_shares '{"pool_id": 0}'

npx near view --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID  get_deposits "{\"account_id\": \"$USER_ID\"}"
npx near view --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $CONTRACT_ID  get_pool_shares "{\"pool_id\": 0, \"account_id\": \"$USER_ID\"}"

# FARMS
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID get_metadata
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID list_seeds_info '{"from_index": 0, "limit": 10}'
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID list_farms '{"from_index": 0, "limit": 10}'
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID list_rewards "{\"account_id\": \"$USER_ID\"}"
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID list_user_seeds "{\"account_id\": \"$USER_ID\"}"
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID get_reward "{\"account_id\": \"$USER_ID\", \"token_id\": \"$TOKEN_ID\"}"
npx near view  --nodeUrl=https://rpc.mainnet.near.org --networkId=mainnet $REF_FARM_CONTRACT_ID get_unclaimed_reward "{\"account_id\": \"$USER_ID\", \"farm_id\": \"0#0\"}"