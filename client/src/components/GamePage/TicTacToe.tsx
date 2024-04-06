import Board from "./board/Board";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcn/card";
import Game from "@/stores/interface/game.interface";

interface TicTacToeProps {
  game: Game;
}

export default function TicTacToe({ game }: TicTacToeProps) {
  return (
    <Card className="w-1/4">
      <CardHeader className="fiex">
        <CardTitle>
          {game.player1} vs {game.player2}
        </CardTitle>
        <CardDescription>Game numer: {game.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <Board game={game} onCellClick={() => {}} />
      </CardContent>
    </Card>
  );
}
