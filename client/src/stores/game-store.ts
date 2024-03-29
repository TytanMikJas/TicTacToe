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
