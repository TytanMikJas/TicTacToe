import { create } from "zustand";
import CreateGameDto from "./dto/create-game.dto";
import MakeMoveDto from "./dto/make-move.dto";
import Game from "./interface/game.interface";
import { createJSONStorage, persist } from "zustand/middleware";
import { Socket } from "socket.io-client";
import { createSocket } from "../utils/socket-io";
import { GameStatus } from "../utils/enums";

export interface GameStore {
  pendingGames: Game[];
  inProgressGames: Game[];

  connect: (userId: string) => void;
  disconnect: () => void;
  createGame: (dto: CreateGameDto) => void;
  joinGame: (gameId: string) => void;
  makeMove: (makeMoveDto: MakeMoveDto) => void;
}

let socket: Socket | null = null;

export const useGamesStore = create<GameStore>()(
  persist(
    (set, get) => ({
      pendingGames: [],
      inProgressGames: [],

      connect: (userId: string) => {
        const _socket = createSocket(userId);
        socket = _socket;
        socket.connect();
        _socket.on("connect", () => {
          socket?.emit("getGames", (games: Game[]) => {
            set({
              inProgressGames: games.filter(
                (g) => g.status === GameStatus.IN_PROGRESS
              ),
              pendingGames: games.filter(
                (g) => g.status === GameStatus.PENDING && g.player2 === userId
              ),
            });
          });
        });
        _socket.connect();
        _socket.on("gameCreated", (game: Game) => {
          set({ pendingGames: [...get().pendingGames, game] });
        });
        _socket.on("moveMade", (game: Game) => {
          set({
            inProgressGames: get().inProgressGames.map((g) =>
              g.id === game.id ? game : g
            ),
          });
        });
        _socket.on("gameJoined", (game: Game) => {
          set({
            pendingGames: get().pendingGames.filter((g) => g.id !== game.id),
            inProgressGames: [...get().inProgressGames, game],
          });
        });
      },
      disconnect: () => {
        socket?.disconnect();
        set({ pendingGames: [], inProgressGames: [] });
      },
      createGame: (dto: CreateGameDto) => {
        socket?.emit("createGame", dto, (game: Game) => {
          set({ pendingGames: [...get().pendingGames, game] });
        });
      },
      joinGame: (gameId: string) => {
        socket?.emit("joinGame", gameId, (game: Game) => {
          set({
            pendingGames: get().pendingGames.filter((g) => g.id !== game.id),
            inProgressGames: [...get().inProgressGames, game],
          });
        });
      },
      makeMove: (makeMoveDto: MakeMoveDto) => {
        socket?.emit("makeMove", makeMoveDto, (game: Game) => {
          set({
            inProgressGames: get().inProgressGames.map((g) =>
              g.id === game.id ? game : g
            ),
          });
        });
      },
    }),
    {
      name: "games-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
