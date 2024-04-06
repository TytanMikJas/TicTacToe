import Game from "@/stores/interface/game.interface";
import Cell from "./Cell";

interface BoardProps {
  game: Game;
  onCellClick: (index: number) => void;
}

export default function Board({ game, onCellClick }: BoardProps) {
  const squares = [
    game.square1, game.square2, game.square3,
    game.square4, game.square5, game.square6,
    game.square7, game.square8, game.square9,
  ];

  return (
    <div className="w-96 h-96 mx-auto grid grid-cols-3 grid-rows-3 gap-0.5 bg-white">
      {squares.map((value, index) => (
        <div key={index} className="flex items-center justify-center border border-gray-300">
          <Cell value={value} onCellClick={() => onCellClick(index + 1)} />
        </div>
      ))}
    </div>
  );
}
