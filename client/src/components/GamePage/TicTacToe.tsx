import Board from "./board/Board";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcn/card";
import Game from "../../stores/interface/game.interface";

interface TicTacToeProps {
  game: Game;
  player: string;
  makeMove: (index: number) => void;
}

export default function TicTacToe({ game, player, makeMove }: TicTacToeProps) {
  return (
    <Card className="w-1/4">
      <CardHeader className="fiex">
        <CardTitle>
          {game.player1} vs {game.player2}
        </CardTitle>
        <CardDescription>Your mark is {player === game.player1 ? "X" : "O" }</CardDescription>
      </CardHeader>
      <CardContent>
        <Board game={game} onMakeMove={makeMove} />
      </CardContent>
    </Card>
  );
}
