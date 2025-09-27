import { LoginForm } from "@/components/authentication/components/login-form";
import { UserAuthForm } from "@/components/authentication/components/user-auth-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router";

export default function AuthPage() {
  const [showLogin, setShowlogin] = useState(true);

  return (
    <div className="relative container flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* <Button
        onClick={() => setShowlogin((p) => !p)}
        className="absolute top-4 right-4 md:top-8 md:right-8"
      >
        {showLogin ? <span>Sign Up</span> : <span>Login</span>}
      </Button> */}
      <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r rounded-r-md bg-accent">
        <div
          className="bg-primary/5 absolute inset-0 rounded-md "
          style={{
            backgroundImage: "url(/Banner/banner.png)",
            backgroundSize: "auto 50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <div className="font-bold text-xl">Exam Scheduler</div>
      </div>
      <div className="flex items-center justify-center lg:h-screen lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          {showLogin ? (
            <>
              <LoginForm />{" "}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Don't Have An Account
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => setShowlogin((p) => !p)}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <UserAuthForm />
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Already Have An Account
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => setShowlogin((p) => !p)}
              >
                Sign In
              </Button>
            </>
          )}
          <Link to={"/landing"}>
            <Button variant="secondary">Back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
