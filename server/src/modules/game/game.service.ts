import { BadRequestException, Injectable } from '@nestjs/common';
import GameRepository from './game.repository';
import { Game } from '@prisma/client';
import CreateGameDto from './dto/create-game.dto';
import { Figure, Player, GameStatus } from '../../enums/enums';

@Injectable()
export default class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async getGames(userId: string): Promise<Game[]> {
    return this.gameRepository.getGames(userId);
  }

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.getAllGames();
  }

  async createGame(data: CreateGameDto): Promise<Game> {
    return this.gameRepository.createGame(data);
  }

  async joinGame(gameId: string, userId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (game.status !== GameStatus.PENDING) {
      throw new BadRequestException('Game is not pending');
    }
    game.player2 = userId;
    game.status = GameStatus.IN_PROGRESS;
    return this.gameRepository.updateGame(game);
  }

  async makeMove(
    gameId: string,
    userId: string,
    square: number,
  ): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    const player = userId === game.player1 ? Player.PLAYER_1 : Player.PLAYER_2;
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new BadRequestException('Game is not in progress');
    }
    if (this.checkTurn(game) !== player) {
      throw new BadRequestException('Not your turn');
    }

    const squareKey = `square${square}`;
    if (game[squareKey] !== Figure.NONE) {
      throw new BadRequestException('Square is already taken');
    }
    game[squareKey] = player === Player.PLAYER_1 ? Figure.X : Figure.O;

    const winner = this.checkWinner(game);

    switch (winner) {
      case GameStatus.PLAYER_1_WON:
        game.status = GameStatus.PLAYER_1_WON;
        break;
      case GameStatus.PLAYER_2_WON:
        game.status = GameStatus.PLAYER_2_WON;
        break;
      case GameStatus.DRAW:
        game.status = GameStatus.DRAW;
        break;
      default:
        break;
    }

    return this.gameRepository.updateGame(game);
  }

  checkTurn(game: Game): Player {
    const moves = [];
    for (let i = 1; i <= 9; i++) {
      moves.push(game[`square${i}`]);
    }

    const playerMoves = moves.filter((move) => move === Figure.X).length;
    const opponentMoves = moves.filter((move) => move === Figure.O).length;

    if (playerMoves === opponentMoves) {
      return Player.PLAYER_2;
    } else {
      return Player.PLAYER_1;
    }
  }

  checkWinner(game: Game): GameStatus {
    const {
      square1,
      square2,
      square3,
      square4,
      square5,
      square6,
      square7,
      square8,
      square9,
    } = game;
    const squares = [
      square1,
      square2,
      square3,
      square4,
      square5,
      square6,
      square7,
      square8,
      square9,
    ];

    const winningCombinations = [
      [square1, square2, square3],
      [square4, square5, square6],
      [square7, square8, square9],
      [square1, square4, square7],
      [square2, square5, square8],
      [square3, square6, square9],
      [square1, square5, square9],
      [square3, square5, square7],
    ];

    for (const [a, b, c] of winningCombinations) {
      if (a !== Figure.NONE && a === b && b === c) {
        return a === Figure.X
          ? GameStatus.PLAYER_1_WON
          : GameStatus.PLAYER_2_WON;
      }
    }

    const isDraw = squares.every((square) => square !== Figure.NONE);
    if (isDraw) {
      return GameStatus.DRAW;
    }

    return GameStatus.IN_PROGRESS;
  }
}
