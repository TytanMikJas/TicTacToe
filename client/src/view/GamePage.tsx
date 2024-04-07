import Separator from "../components/GamePage/Separator";
import TicTacToe from "../components/GamePage/TicTacToe";
import WelcomeText from "../components/GamePage/WelcomeText";
import { Button } from "../components/shadcn/button";
import { Input } from "../components/shadcn/input";
import { Label } from "../components/shadcn/label";
import { useGamesStore } from "../stores/game-store";
import { useUserStore } from "../stores/user-store";
import { useEffect, useState } from "react";

export default function GamePage() {
  const { user } = useUserStore();
  const {
    pendingGames,
    inProgressGames,
    connect,
    disconnect,
    createGame,
    joinGame,
    makeMove,
  } = useGamesStore();
  const myPendingGames = pendingGames.filter((g) => g.player2 === user);
  const [oponent, setoponent] = useState("");

  useEffect(() => {
    console.log({ user });
    connect(user!);
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="flex">
      <div className="w-1/4 h-screen flex flex-col space-y-2 bg-gradient-to-r from-purple-100 to-blue-100">
        <WelcomeText user={user} />
        <div className="mx-3 flex flex-col">
          <Label className="text-xl mb-1">Select an opponent</Label>
          <Input
            placeholder="Your friend"
            value={oponent}
            onChange={(e) => {
              setoponent(e.target.value);
            }}
          />
          <Button
            className="mt-2"
            onClick={() => createGame({ userId: user!, opponentId: oponent })}
          >
            Send a game invite
          </Button>
          <Separator text="OR" />
          <Button onClick={() => createGame({ userId: user! })}>
            Find a random Player
          </Button>
          <Label className="text-xl pt-10"> Pending games </Label>
          {myPendingGames.map((game) => (
            <div key={game.id} className="flex justify-between py-2">
              <Label className="text-lg">
                {game.player1} vs {game.player2}
              </Label>
              <Button onClick={() => joinGame(game.id)}>Join</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-2 ms-8 mt-8 gap-8">
          {inProgressGames.length === 0 ? (
            <Label>No games in progress</Label>
          ) : (
            inProgressGames.map((game) => (
              <div>
                <TicTacToe
                  game={game}
                  player={user!}
                  makeMove={(position: number) =>
                    makeMove({ gameId: game.id, square: position })
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
