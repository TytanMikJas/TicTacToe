import FindPlayerButton from "@/components/GamePage/FindPlayerButton";
import TicTacToe from "@/components/GamePage/TicTacToe";
import { Figure, GameStatus } from "@/stores/game-store";

export default function GamePage() {
  const mockGame = {
    id: "4132",
    player1: "Alice",
    player2: "Bob",
    player1Figure: Figure.X,
    player2Figure: Figure.O,
    startingFigure: Figure.X,
    square1: Figure.X,
    square2: Figure.O,
    square3: Figure.Empty,
    square4: Figure.X,
    square5: Figure.O,
    square6: Figure.Empty,
    square7: Figure.Empty,
    square8: Figure.Empty,
    square9: Figure.Empty,
    status: GameStatus.IN_PROGRESS,
  };

  return (
    <div className="flex flex-col items-center space-y-4 pt-4">
      <h1>Welcome {mockGame.player1}</h1>
      <FindPlayerButton />
      <TicTacToe game={mockGame} />
    </div>
  );
}
