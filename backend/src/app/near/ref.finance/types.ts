import { FarmKind, FarmStatus } from '@prisma/client';

export interface IToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  spec: string;
  reference: string;
  referenceHash: string;
}

export interface IPool {
  token_account_ids: any[];
  amounts: any[];
  total_fee: any;
  shares_total_supply: any;
}

export type TVolumeItem = {
  input: number;
  output: number;
};

export type TVolume = TVolumeItem[];

export interface ISeed {
  seed_id: string;
  seed_type: string;
  farms: Array<string>;
  next_index: number;
  amount: number;
  min_deposit: number;
}

export interface IFarm {
  farm_id: string;
  farm_kind: string;
  farm_status: string;
  seed_id: string;
  reward_token: string;
  start_at: number;
  reward_per_session: number;
  session_interval: number;
  total_reward: number;
  cur_round: number;
  last_round: number;
  claimed_reward: number;
  unclaimed_reward: number;
  current_user_reward: number;
  beneficary_reward: number;
}

export const getFarmKind = (kind: string) => {
  switch (kind) {
    case 'SIMPLE_FARM':
      return FarmKind.SIMPLE_FARM;
    default:
      FarmKind.SIMPLE_FARM;
  }
};

export const getFarmStatus = (status: string) => {
  switch (status) {
    case 'Running':
      return FarmStatus.RUNNING;
    case 'Created':
      return FarmStatus.CREATED;
    case 'Ended':
      return FarmStatus.ENDED;
    default:
      return FarmStatus.CLEARED;
  }
};
