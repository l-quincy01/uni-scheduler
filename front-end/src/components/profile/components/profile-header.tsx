import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, University } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  school: string;

  avatarUrl?: string;
}

export default function ProfileHeader({
  name,
  email,
  school,

  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <Card className="bg-accent/20 border-none">
      <CardContent className="p-6 bg-transparent">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl"></AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Mail className="size-4" />
              {email}
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <University className="size-4" />
                {school}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
