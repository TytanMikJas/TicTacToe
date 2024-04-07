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

  async afterInit(): Promise<void> {
    console.log('init');
    this.connectedClients = [];
  }

  async handleConnection(client: any) {
    console.log('handleConnection');
    const userId = client.handshake.auth.userId;
    const userGames = await this.gameService.getGames(userId);
    userGames.forEach((game) => {
      client.join(game.id);
    });
    client.join(userId);
    this.connectedClients.push(userId);
    this.server.to(userId).emit('connected', 'connected');
  }

  async handleDisconnect(client: any) {
    const userId = client.handshake.auth.userId;
    this.connectedClients = this.connectedClients.filter((id) => id !== userId);
  }

  connectedClients: string[] = [];

  @WebSocketServer() server: Server;

  @SubscribeMessage('createGame')
  async createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateGameDto,
  ): Promise<Game> {
    console.log(data.userId, data.opponentId);
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
    client.to(game.player1).emit('gameJoined', game);
    client.join(game.id);
    return game;
  }
}
