npx near login

npx near call cron.in.testnet create_task '{"contract_id": "ref-finance.testnet","function_id": "get_whitelisted_tokens","cadence": "* */1 * * * *","recurring": true,"deposit": "1","gas": 2400000000000}' --accountId imiro-croncat-user.testnet --amount 10

npx near call cron.in.testnet create_task '{"contract_id": "counter.in.testnet","function_id": "increment","cadence": "* */5 * * * *","recurring": true,"deposit": "0","gas": 2400000000000}' --accountId imiro-croncat-user.testnet --amount 2


npx near call cron.in.testnet create_task '{"contract_id": "ref-finance.testnet","function_id": "swap {\"actions\": [{\"pool_id\": 0, \"token_in\": \"token.skyward.near\", \"amount_in\": \"6\", \"token_out\": \"wrap.near\", \"min_amount_out\": \"1\"}]}", "cadence": "*/30 * * * * *","recurring": true,"deposit": "2","gas": 2400000000000}' --accountId imiro-croncat-user.testnet --amount 2