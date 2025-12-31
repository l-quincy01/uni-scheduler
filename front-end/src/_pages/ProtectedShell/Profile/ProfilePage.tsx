import ProfileContent from "@/components/profile/components/profile-content";
import ProfileHeader from "@/components/profile/components/profile-header";
import { useEffect, useState } from "react";
import { getUser, type User } from "@/_api/Auth/users";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUser();
        if (mounted) setUser(u[0] ?? null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "";

  if (!user) return null;

  return (
    <div>
      <ProfileHeader
        name={name}
        email={user?.email ?? ""}
        school={user?.school ?? ""}
        avatarUrl={user?.avatarUrl ?? "https://i.redd.it/8ugv2z5fdj7f1.png"}
      />
      <ProfileContent
        id={user?.sqlId ?? null}
        firstName={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
        email={user?.email ?? ""}
        phone={(user?.phone as string) ?? ""}
        school={user?.school ?? ""}
      />
    </div>
  );
}
