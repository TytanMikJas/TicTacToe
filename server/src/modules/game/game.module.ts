import { Module } from '@nestjs/common';
import GameGateway from './game.gateway';
import GameRepository from './game.repository';
import GameService from './game.service';

@Module({
  providers: [GameGateway, GameService, GameRepository],
})
export default class GameModule {}
