import Separator from "@/components/GamePage/Separator";
import WelcomeText from "@/components/GamePage/WelcomeText";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useUserStore } from "@/stores/user-store";

export default function GamePage() {
  const { user } = useUserStore();

  return (
    <div className="flex items-center space-y-4">
      <div className="w-1/4 h-screen flex flex-col space-y-2 bg-gradient-to-r from-purple-100 to-blue-100">
        <WelcomeText user={user} />
        <div className="mx-3 flex flex-col">
          <Label className="text-xl mb-1">Select an opponent</Label>
          <Input></Input>
          <Button className="mt-2">Send a game invite</Button>
          <Separator text="OR" />
          <Button>Find a random Player</Button>
          <Label className="text-xl pt-10"> Pending games </Label>
        </div>
      </div>

      <div>test</div>
    </div>
  );
}
