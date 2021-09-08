import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Connection } from 'typeorm';

export type TQueryArgs = {
  where: object;
  skip: number;
  take: number;
  orderBy: object;
};

export interface ILiquidity {
  timestamp: string;
  receipt_receiver_account_id: string;
  receipt_predecessor_account_id: string;
  method_name: string;
  pool_id: number;
  amount1: number;
  amount2: number;
  removed_shares: number;
}

@Injectable()
export class IndexerService {
  constructor(private connection: Connection) {}

  async accounts() {
    const result = await this.connection.query(
      'SELECT * FROM accounts LIMIT 100'
    );
    return result;
  }

  async getLastLiquidity(lastTimestamp: string): Promise<ILiquidity[]> {
    const sqlSelect = `SELECT 
        receipt_included_in_block_timestamp AS timestamp, 
        receipt_receiver_account_id,
        receipt_predecessor_account_id,
        args->'method_name' AS method_name,
        --args->'args_json' AS args_json,
        args->'args_json'->'pool_id' as pool_id,    
        args->'args_json'->'amounts'->>0 AS amount1,
        args->'args_json'->'amounts'->>1 AS amount2,
        args->'args_json'->'shares' AS removed_shares
      FROM action_receipt_actions `;

    const sqlWhere1 = `
    WHERE (1=1)
      AND action_kind = 'FUNCTION_CALL'      
      AND (receipt_receiver_account_id = 'v2.ref-finance.near' OR receipt_receiver_account_id = 'token.v2.ref-finance.near')
      AND (args->>'method_name' = 'add_liquidity' OR args->>'method_name' = 'remove_liquidity')
      AND receipt_included_in_block_timestamp > ${lastTimestamp}
      `;

    const sqlOrderBy = 'order by timestamp asc';

    const sql = `${sqlSelect}${sqlWhere1}${sqlOrderBy}`;

    //console.log(sql);

    const result: ILiquidity[] = await this.connection.query(sql);
    return result;
  }

  async liquidityByArgs(args: TQueryArgs): Promise<ILiquidity[]> {
    const poolId = args.where['poolId'];
    const accountAddress = args.where['accountAddress'];

    const sqlSelect = `SELECT 
        receipt_included_in_block_timestamp AS timestamp, 
        receipt_receiver_account_id,
        receipt_predecessor_account_id,
        args->'method_name' AS method_name,
        --args->'args_json' AS args_json,
        args->'args_json'->'pool_id' as pool_id,    
        args->'args_json'->'amounts'->>0 AS amount1,
        args->'args_json'->'amounts'->>1 AS amount2,
        args->'args_json'->'shares' AS removed_shares
      FROM action_receipt_actions `;

    const sqlWhere1 = `
    WHERE (1=1)
      AND action_kind = 'FUNCTION_CALL'      
      AND (receipt_receiver_account_id = 'v2.ref-finance.near' OR receipt_receiver_account_id = 'token.v2.ref-finance.near')
      AND (args->>'method_name' = 'add_liquidity' OR args->>'method_name' = 'remove_liquidity')
      AND args->'args_json'->'pool_id' = '${poolId}'
      `;

    const sqlWhere2 = `AND receipt_predecessor_account_id = ${accountAddress}`;

    const sqlOrderBy = 'order by timestamp desc';

    const sql = !accountAddress
      ? `${sqlSelect}${sqlWhere1}${sqlOrderBy}`
      : `${sqlSelect}${sqlWhere1}${sqlWhere2}${sqlOrderBy}`;

    //console.log(sql);

    const result: ILiquidity[] = await this.connection.query(sql);
    return result;
  }
}
