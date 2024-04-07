import { Injectable } from '@nestjs/common';
import { Game, PrismaClient } from '@prisma/client';
import CreateGameDto from './dto/create-game.dto';
import { GameStatus } from 'src/enums/enums';

@Injectable()
export default class GameRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getGames(userId: string): Promise<Game[]> {
    return await this.prisma.game.findMany({
      where: {
        OR: [{ player1: userId }, { player2: userId }],
      },
    });
  }

  async getAllGames(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  async createGame(data: CreateGameDto): Promise<Game> {
    return await this.prisma.game.create({
      data: {
        player1: data.userId,
        player2: data.opponentId,
        status: GameStatus.PENDING,
      },
    });
  }

  async updateGame(game: Game): Promise<Game> {
    return await this.prisma.game.update({
      where: { id: game.id },
      data: game,
    });
  }

  async getGameById(gameId: string): Promise<Game> {
    return await this.prisma.game.findUnique({
      where: { id: gameId },
    });
  }
}
