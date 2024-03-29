import FindPlayerButton from "@/components/GamePage/FindPlayerButton";

export default function GamePage() {
  return (
    <div className="flex flex-col items-center space-y-4 pt-4">
      <h1>Welcome *username*</h1>
      <FindPlayerButton />
      <div className="w-3/4 h-3/4">
        <p> Board </p>
      </div>
    </div>
  );
}
