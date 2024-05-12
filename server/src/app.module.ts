import { Module } from '@nestjs/common';
import GameModule from './modules/game/game.module';
import AuthModule from './modules/auth/auth.module';

@Module({
  imports: [GameModule, AuthModule],
  providers: [],
})
export class AppModule {}
