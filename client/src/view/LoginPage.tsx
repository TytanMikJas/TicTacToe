import { Button } from "../components/shadcn/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/shadcn/card";
import { Input } from "../components/shadcn/input";
import { User, useUserStore } from "../stores/user-store";
import { useState } from "react";
import { loginCogito } from "../utils/cognito";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    console.log("Logging in");

    login(
      email,
      password,
      (user) => {
        setUser(user);
        navigate("/game");
      },
      (error) => {
        setError(error);
      }
    );
  }

  function login(
    email: string,
    password: string,
    onSuccess?: (user: User) => void,
    onError?: (error: string) => void
  ) {
    loginCogito(email, password)
      .then((session) => {
        onSuccess &&
          onSuccess({
            email: email,
            accessToken: session.getAccessToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
          });
      })
      .catch((error) => {
        console.log("error");
        onError && onError(error.message);
      });
  }

  return (
    <div className="flex justify-center pt-4">
      <Card className="w-1/5">
        <CardHeader>
          <CardTitle>Login Page</CardTitle>
          <CardDescription>Please enter your name to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              placeholder="Your Name"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{error}</p>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <Button className="mt-2 w-full" onClick={() => navigate("/register")}>
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
