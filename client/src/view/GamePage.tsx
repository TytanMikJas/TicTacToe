import Separator from "../components/GamePage/Separator";
import TicTacToe from "../components/GamePage/TicTacToe";
import WelcomeText from "../components/GamePage/WelcomeText";
import { Button } from "../components/shadcn/button";
import { Input } from "../components/shadcn/input";
import { Label } from "../components/shadcn/label";
import { useGamesStore } from "../stores/game-store";
import { useUserStore } from "../stores/user-store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/cognito";

export default function GamePage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUserStore();
  const {
    pendingGames,
    inProgressGames,
    connect,
    disconnect,
    createGame,
    joinGame,
    makeMove,
  } = useGamesStore();
  const myPendingGames = pendingGames.filter((g) => g.player2 === user?.email);
  const [oponent, setoponent] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    connect(user);
    document.title = user!.email;
    return () => {
      disconnect();
    };
  }, [user]);

  return (
    <div className="flex">
      <div className="w-1/4 h-screen flex flex-col space-y-2 bg-gradient-to-r from-red-100 to-blue-100">
        <WelcomeText user={user!.email} />
        <div className="mx-3 flex flex-col">
          <div>
            <Button
              onClick={() =>
                logout().then(() => {
                  logoutUser();
                  navigate("/login");
                })
              }
            ></Button>
            <Label className="text-xl mb-2">Select an opponent</Label>
            <Input
              placeholder="Your friend"
              value={oponent}
              onChange={(e) => {
                setoponent(e.target.value);
              }}
            />
            <Button
              className="mt-2 w-full"
              onClick={() =>
                createGame({ userId: user!.email, opponentId: oponent })
              }
            >
              Send a game invite
            </Button>
            <Separator text="OR" />
            <Button
              className="w-full"
              onClick={() => createGame({ userId: user!.email })}
            >
              Find a random Player
            </Button>
          </div>
          <div className="pt-10 space-y-2">
            <Label className="text-xl"> Pending games </Label>
            {myPendingGames.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center rounded-xl shadow-sm bg-gray-50"
              >
                <Label className="text-lg ms-2">
                  {game.player1} vs {game.player2}
                </Label>
                <Button onClick={() => joinGame(game.id)}>Join</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 ms-8 mt-8 gap-8">
          {inProgressGames.length === 0 ? (
            <Label>No games in progress</Label>
          ) : (
            inProgressGames.map((game) => (
              <div>
                <TicTacToe
                  game={game}
                  player={user!.email}
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
