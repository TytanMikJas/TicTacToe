import { Module } from '@nestjs/common';
import GameGateway from './game.gateway';
import GameRepository from './game.repository';
import GameService from './game.service';
import AuthModule from '../auth/auth.module';

@Module({
  providers: [GameGateway, GameService, GameRepository],
  imports: [AuthModule],
})
export default class GameModule {}
