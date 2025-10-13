import ProfileContent from "@/components/profile/components/profile-content";
import ProfileHeader from "@/components/profile/components/profile-header";
import { useEffect, useState } from "react";
import { getUsers, type User } from "@/_api/Auth/users";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUsers();
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

  if (loading) {
    return (
      <div>
        <ProfileHeader name={""} email={""} school={""} avatarUrl={""} />
        <ProfileContent
          firstName={""}
          lastName={""}
          email={""}
          phone={""}
          school={""}
        />
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader
        name={name}
        email={user?.email ?? ""}
        school={user?.school ?? ""}
        avatarUrl={user?.avatarUrl ?? undefined}
      />
      <ProfileContent
        firstName={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
        email={user?.email ?? ""}
        phone={(user?.phone as string) ?? ""}
        school={user?.school ?? ""}
      />
    </div>
  );
}
