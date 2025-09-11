import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerUser } from "@/_api/Auth/auth";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserAuthForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    school: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.email ||
      !form.password ||
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.school
    ) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userData = await registerUser({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        school: form.school,
      });
      console.log("User registered:", userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below to create your account
        </p>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="080 123 4567"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">School</Label>
        <Select
          value={form.school}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, school: value }))
          }
        >
          <SelectTrigger id="school" className="w-full">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>School</SelectLabel>
              <SelectItem value="Rhodes University">
                Rhodes University
              </SelectItem>
              <SelectItem value="University of Cape Town">
                University of Cape Town
              </SelectItem>
              <SelectItem value="Stellenbosch">Stellenbosch</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up…" : "Sign Up"}
      </Button>
    </form>
  );
}
