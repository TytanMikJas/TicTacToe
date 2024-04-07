import OMarker from "./OMarker";
import XMarker from "./XMarker";

interface CellProps {
  value: string;
  onMakeMove: () => void;
}

export default function Cell({ value, onMakeMove }: CellProps) {
  const Marker = value === "X" ? XMarker : value === "O" ? OMarker : null;

  return (
    <div className="w-30 h-30 flex items-center justify-center" onClick={onMakeMove}>
      {Marker && <Marker />}
    </div>
  );
}
