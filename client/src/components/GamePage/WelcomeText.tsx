interface userProps {
  user: string | null;
}

export default function WelcomeText({ user }: userProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 text-center shadow-lg p-4 bg-gradient-to-r from-purple-400 to-blue-300">
        🎮 Welcome {user} 🎮
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        
      </h2>
    </>
  );
}
