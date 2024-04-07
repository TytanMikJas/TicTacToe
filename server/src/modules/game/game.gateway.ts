import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import GameService from './game.service';
import CreateGameDto from './dto/create-game.dto';
import MakeMoveDto from './dto/make-move.dto';
import { Game } from '@prisma/client';

@WebSocketGateway({ transports: ['websocket'], cors: true })
@Injectable()
export default class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;
  connectedClients: string[] = [];

  async afterInit(): Promise<void> {}

  async handleConnection(client: any) {
    const userId = client.handshake.auth.userId;
    const userGames = await this.gameService.getGames(userId);
    userGames.forEach((game) => {
      client.join(game.id);
    });
    client.join(userId);
    this.connectedClients.push(userId);
    client.to(userId).emit('connected', 'You are connected');
  }

  async handleDisconnect(client: any) {
    const userId = client.handshake.auth.userId;
    this.connectedClients = this.connectedClients.filter((id) => id !== userId);
  }

  @SubscribeMessage('createGame')
  async createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateGameDto,
  ): Promise<Game> {
    const userId = client.handshake.auth.userId as string;
    if (data.opponentId === data.userId) {
      throw new BadRequestException('You cannot play against yourself');
    }
    let game = null;
    if (data.opponentId) {
      game = await this.gameService.createGame(data);
    } else {
      const opponentId = this.connectedClients.find((id) => id !== userId);
      if (!opponentId) {
        throw new BadRequestException('No available opponents');
      }
      game = await this.gameService.createGame({
        userId,
        opponentId,
      });
    }
    client.join(game.id);
    client.to(game.player2).emit('gameCreated', game);
    return game;
  }

  @SubscribeMessage('getGames')
  async getGames(@ConnectedSocket() client: Socket): Promise<Game[]> {
    const userId = client.handshake.auth.userId as string;
    return await this.gameService.getGames(userId);
  }

  @SubscribeMessage('makeMove')
  async makeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MakeMoveDto,
  ): Promise<Game> {
    const userId = client.handshake.auth.userId as string;
    const game = await this.gameService.makeMove(
      data.gameId,
      userId,
      data.square,
    );
    client.to(game.id).emit('moveMade', game);
    return game;
  }

  @SubscribeMessage('joinGame')
  async joinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ): Promise<Game> {
    const userId = client.handshake.auth.userId as string;
    const game = await this.gameService.joinGame(gameId, userId);
    client.join(game.id);
    client.to(game.player1).emit('gameJoined', game);
    return game;
  }
}
