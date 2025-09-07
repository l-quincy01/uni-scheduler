import ProfileContent from "@/components/profile-page/components/profile-content";
import ProfileHeader from "@/components/profile-page/components/profile-header";
import React from "react";

export default function ProfilePage() {
  return (
    <div>
      <ProfileHeader
        name="John Doe"
        email="john.doe@example.com"
        school="Rhodes University"
        avatarUrl="https://preview.redd.it/the-new-discord-default-profile-pictures-v0-uqvmqo1cdj7f1.png?width=1024&auto=webp&s=6c1ac3264c8febf1eb3d2bdd0534eef83f2b94f3"
      />
      <ProfileContent
        firstName="John"
        lastName="Doe"
        email="john.doe@example.com"
        phone="+27 123456789"
        school="Rhodes University"
      />
    </div>
  );
}
