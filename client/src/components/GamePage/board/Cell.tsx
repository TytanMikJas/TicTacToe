import OMarker from "./OMarker";
import XMarker from "./XMarker";

export default function Cell(props: { value: string, onCellClick: () => void}) {
  return (
    <div className="w-30 h-30" onClick={props.onCellClick}>
      {props.value === "X" && <XMarker />}
      {props.value === "O" && <OMarker />}
    </div>
  );
}
