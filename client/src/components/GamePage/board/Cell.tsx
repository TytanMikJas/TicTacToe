import OMarker from "./OMarker";
import XMarker from "./XMarker";
import { Figure } from "../../../utils/enums";

interface CellProps {
  value: string;
  onMakeMove: () => void;
}

export default function Cell({ value, onMakeMove }: CellProps) {
  const Marker = value === Figure.X ? XMarker : value === Figure.O ? OMarker : null;

  return (
    <div
      className="w-30 h-30 flex items-center justify-center"
      onClick={onMakeMove}
    >
      {Marker && <Marker />}
    </div>
  );
}
