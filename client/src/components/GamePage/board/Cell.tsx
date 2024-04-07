import OMarker from "./OMarker";
import XMarker from "./XMarker";

interface CellProps {
  value: string;
  onMakeMove: () => void;
}

export default function Cell({ value, onMakeMove }: CellProps) {
  return (
    <>
      <div
        className="w-30 h-30 flex items-center justify-center bg-slate-200 hover:bg-gray-500 cursor-pointer"
        onClick={() => onMakeMove}
      >
        {value === "NONE" && <p>ᅠ</p>}
        {value === "X" && <XMarker />}
        {value === "O" && <OMarker />}
      </div>
    </>
  );
}
