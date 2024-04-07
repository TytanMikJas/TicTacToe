import Separator from "@/components/GamePage/Separator";
import TicTacToe from "@/components/GamePage/TicTacToe";
import WelcomeText from "@/components/GamePage/WelcomeText";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useGamesStore } from "@/stores/game-store";
import { useUserStore } from "@/stores/user-store";
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
  const [oponent, setoponent] = useState("");

  useEffect(() => {
    connect(user!);
    return () => {
      disconnect();
    };
  });

  return (
    <div className="flex items-center space-y-4">
      <div className="w-1/4 h-screen flex flex-col space-y-2 bg-gradient-to-r from-purple-100 to-blue-100">
        <WelcomeText user={user} />
        <div className="mx-3 flex flex-col">
          <Label className="text-xl mb-1">Select an opponent</Label>
          <Input
            placeholder="Your friend"
            value={oponent}
            onChange={(e) => {setoponent(e.target.value); console.log(oponent)}}
          />
          <Button
            className="mt-2"
            onClick={() => createGame({ playerId: user!, oponentId: oponent })}
          >
            Send a game invite
          </Button>
          <Separator text="OR" />
          <Button onClick={() => createGame({ playerId: user! })}>
            Find a random Player
          </Button>
          <Label className="text-xl pt-10"> Pending games </Label>
          {pendingGames.map((game) => (
            <div key={game.id} className="flex justify-between">
              <Label className="text-lg">
                {game.player1} vs {game.player2}
              </Label>
              <Button onClick={() => joinGame(game.id)}>Join</Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xl mb-1">Current Games:</Label>
        {inProgressGames.map((game) => (
          <div>
            <TicTacToe
              game={game}
              player={user!}
              makeMove={(position: number) =>
                makeMove({ gameId: game.id, square: position })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
