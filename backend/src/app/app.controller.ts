import {
  Controller,
  Get,
  Param,
  Response,
  Query,
  Post,
  Body,
  Put,
  Req,
} from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { Response as Res, Request as EReq } from 'express';
import { AppService } from './app.service';
import { ChainService } from './chain/chain.service';
import { ReactAdminPipe } from '../request-validation.pipe';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chainService: ChainService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/hello/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }

  @Get('api/ref-stats/:id')
  async getChainInfo(): Promise<object> {
    const data = await this.chainService.refStats();

    const result = {
      id: 'dashboard',
      ...data,
    };

    return result;
  }

  // React Admin Section
  @Get('api/tokens')
  async reactAdminTokens(
    @Response() res: Res,
    @Query(new ReactAdminPipe()) query
  ): Promise<Res> {
    const data = await this.chainService.tokens({
      skip: query.pagination.skip,
      take: query.pagination.pageSize,
      orderBy: query.orderBy,
      where: query.where,
    });

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  @Get('api/pools')
  async reactAdminPools(
    @Response() res: Res,
    @Query(new ReactAdminPipe()) query
  ): Promise<Res> {
    const pools = await this.chainService.pools({
      skip: query.pagination.skip,
      take: query.pagination.pageSize,
      orderBy: query.orderBy,
      where: query.where,
    });

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': pools.count })
      .json(pools.pools);
  }

  @Get('api/pools/:id')
  async reactAdminPoolDetail(
    @Response() res: Res,
    @Param() IdParam: { id: string }
  ): Promise<Res> {
    const pool = await this.chainService.poolDetail(parseInt(IdParam.id));
    const result = {
      id: 'poolDetail',
      ...pool,
    };
    return res.json(result);
  }

  @Get('api/pool-tokens')
  async reactAdminPoolTokens(
    @Response() res: Res,
    @Query() query
  ): Promise<Res> {
    const filter = JSON.parse(query.filter);
    const data = await this.chainService.poolTokens(parseInt(filter.poolId));

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  @Get('api/account-deposits')
  async reactAdminAccountDeposits(
    @Response() res: Res,
    @Query() query
  ): Promise<Res> {
    const filter = JSON.parse(query.filter);
    const deposits = await this.chainService.accountDeposits(
      filter.accountAddress
    );

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': deposits.length })
      .json(deposits);
  }

  @Get('api/account-pools')
  async reactAdminAccountPools(
    @Response() res: Res,
    @Query() query
  ): Promise<Res> {
    const filter = JSON.parse(query.filter);
    const pools = await this.chainService.accountPools(filter.accountAddress);

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': pools.length })
      .json(pools);
  }

  @Get('api/liquidity')
  async reactAdminLiquidity(
    @Response() res: Res,
    @Query(new ReactAdminPipe()) query
  ): Promise<Res> {
    const data = await this.chainService.simplePoolLiquidity({
      skip: query.pagination.skip,
      take: query.pagination.pageSize,
      orderBy: query.orderBy,
      where: query.where,
    });

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  @Get('api/farms')
  async reactAdminFarms(
    @Response() res: Res,
    @Query(new ReactAdminPipe()) query
  ): Promise<Res> {
    const data = await this.chainService.farms({
      skip: query.pagination.skip,
      take: query.pagination.pageSize,
      orderBy: query.orderBy,
      where: query.where,
    });

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  @Get('api/account-farms')
  async reactAdminAccountFarms(
    @Response() res: Res,
    @Query() query
  ): Promise<Res> {
    const filter = JSON.parse(query.filter);
    const data = await this.chainService.accountFarms(filter.accountAddress);

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  @Get('api/account-rewards')
  async reactAdminAccountRewards(
    @Response() res: Res,
    @Query() query
  ): Promise<Res> {
    const filter = JSON.parse(query.filter);
    const data = await this.chainService.accountRewards(filter.accountAddress);

    return res
      .set({ 'Access-Control-Expose-Headers': 'X-Total-Count' })
      .set({ 'x-total-count': data.length })
      .json(data);
  }

  // ! ------ Just in case of auth -----------

  @Get('api/admin/:id')
  async reactAdminAdmin(
    @Req() request: EReq,
    @Response() res: Res
  ): Promise<Res> {
    if (request.cookies['auth0.is.authenticated'] === 'true') {
      res.json({ id: '1', data: { data1: 1, data2: 2 } });
    } else {
      res.status(401);
      return res.send();
    }
  }
}
