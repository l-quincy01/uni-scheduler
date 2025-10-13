/**
 * ProfileHeader Component
 *
 * - Displays a user profile header with avatar, name, email, school, and joined date.
 * - Optionally shows a badge (e.g., role, achievement, or status).
 * - Supports avatar image or fallback initials if no image is provided.
 * - Uses responsive layout to adapt for smaller and larger screens.
 *
 * @author Quincy Pitsi
 * @version 1.0.0
 * @exports ProfileHeader
 * @constructor
 * @this {React.FC<ProfileHeaderProps>}
 * @param {ProfileHeaderProps} props - Component props.
 * @returns {JSX.Element} A styled profile header card.
 * @throws Will throw if required props (name, email, school, joined, initials) are missing or invalid.
 * @see Badge, Avatar
 * @todo
 */

import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, University } from "lucide-react";

/**
 * Props for the ProfileHeader component.
 *
 * @property {string} name - Full name of the user.
 * @property {string} email - Email address of the user.
 * @property {string} school - school or institution the user is associated with.
 * @property {string} joined - Date string representing when the user joined.
 * @property {string} [avatarUrl] - Optional URL to the user's profile picture.
 * @property {string} initials - User's initials, used as avatar fallback.
 * @property {string} [badge] - Optional badge text to display next to the user's name.
 */
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
