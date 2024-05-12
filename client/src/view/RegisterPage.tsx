import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/shadcn/card";
import { Input } from "../components/shadcn/input";
import { Button } from "../components/shadcn/button";
import { register } from "../utils/cognito";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email === "" || password === "") {
      return;
    }
    console.log("registring")
    register(email, password).then(() => {
      alert("User registered successfully");
      navigate("/login");
    });
  }

  return (
    <div className="flex justify-center pt-4">
      <Card className="w-1/5">
        <CardHeader>
          <CardTitle>Register Page</CardTitle>
          <CardDescription>
            Please enter your mail and password to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              placeholder="Your email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
