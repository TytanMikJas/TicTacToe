// import { Socket } from "socket.io-client";
// import { createSocket } from "../utils/socket-io";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

export interface CreateGameDto {
  playerId: string;
  oponentId?: string;
}

export interface MakeMoveDto {
  gameId: string;
  square: number;
}
export interface GameStore {
  pendingGames: Game[];
  inProgressGames: Game[];

  connect: (userId: string) => void;
  disconnect: () => void;
  createGame: (dto: CreateGameDto) => void;
  acceptGame: (gameId: string) => void;
  makeMove: (makeMoveDto: MakeMoveDto) => void;
}

export interface Game {
  id: string;
  player1: string;
  player2: string;
  player1Figure: Figure;
  player2Figure: Figure;
  startingFigure: Figure;
  square1: Figure;
  square2: Figure;
  square3: Figure;
  square4: Figure;
  square5: Figure;
  square6: Figure;
  square7: Figure;
  square8: Figure;
  square9: Figure;
  status: GameStatus;
}

export enum Figure {
  X = "X",
  O = "O",
  Empty = "NONE",
}

export enum GameStatus {
  PLAYER_1_WON = "PLAYER_1_WON",
  PLAYER_2_WON = "PLAYER_2_WON",
  DRAW = "DRAW",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
}
