import { LoginForm } from "@/components/authentication/components/login-form";
import { UserAuthForm } from "@/components/authentication/components/user-auth-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router";

export default function AuthPage() {
  const [showLogin, setShowlogin] = useState(false);

  return (
    <div className="relative container flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Button
        onClick={() => setShowlogin((p) => !p)}
        className="absolute top-4 right-4 md:top-8 md:right-8"
      >
        {showLogin ? <span>Sign Up</span> : <span>Login</span>}
      </Button>
      <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
        <div
          className="bg-primary/5 absolute inset-0"
          style={{
            backgroundImage: "url(/Banner/authentication-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium text-white/80">
          Exam Scheduler
        </div>
      </div>
      <div className="flex items-center justify-center lg:h-screen lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          {!showLogin && (
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email below to create your account
              </p>
            </div>
          )}
          {showLogin ? <LoginForm /> : <UserAuthForm />}
          <Link to={"/landing"}>
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
