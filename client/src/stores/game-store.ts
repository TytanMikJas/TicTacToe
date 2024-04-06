import CreateGameDto from "./dto/create-game.dto";
import MakeMoveDto from "./dto/make-move.dto";
import Game from "./interface/game.interface";

export interface GameStore {
  pendingGames: Game[];
  inProgressGames: Game[];

  connect: (userId: string) => void;
  disconnect: () => void;
  createGame: (dto: CreateGameDto) => void;
  joinGame: (gameId: string) => void;
  makeMove: (makeMoveDto: MakeMoveDto) => void;
}

