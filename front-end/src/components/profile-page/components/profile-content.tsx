/**
 * ProfileContent Component
 *
 * - Displays user profile information across multiple tabs (Personal, Account, Security, Notifications).
 * - Provides editable personal information fields (first name, last name, email, phone, school).
 * - Shows account details such as subscription plan, price, account status, and join date.
 * - Includes account management actions such as updating subscription and deleting the account.
 * - Uses tab-based navigation for clean separation of profile-related content.
 *
 * @author Quincy Pitsi
 * @version 1.0.0
 * @exports ProfileContent
 * @constructor
 * @this {React.FC<ProfileContentProps>}
 * @param {ProfileContentProps} props - Component props.
 * @returns {JSX.Element} A tabbed profile section displaying personal, account, and security details.
 * @throws Will throw if required profile props are missing or invalid.
 * @see ProfileContentProps
 * @todo
 */

import { Shield, Key, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

/**
 * Props for the ProfileContent component.
 *
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} phone - The user's phone number.
 * @property {string} school - The user's school or institution.
 * @property {string} subscriptionPlan - The user's subscription plan name.
 * @property {string} subscriptionPrice - The price of the user's subscription.
 * @property {"Active" | "Inactive"} accountStatus - Current account status.
 * @property {string} joined - Date the user joined the platform.
 */

interface ProfileContentProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  subscriptionPlan: string;
  subscriptionPrice: string;
  accountStatus: "Active" | "Inactive";
  joined: string;
}

export default function ProfileContent({
  firstName,
  lastName,
  email,
  phone,
  school,
  subscriptionPlan,
  subscriptionPrice,
  accountStatus,
  joined,
}: ProfileContentProps) {
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-accent/20 border-none">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        {/* <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <Card className="bg-accent/20 border-none">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </div>
            <Button
              variant="secondary"
              onClick={() => setEditingProfile((prev) => !prev)}
            >
              {editingProfile ? "Done" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue={firstName}
                  disabled={!editingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue={lastName}
                  disabled={!editingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={email}
                  disabled={!editingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={phone}
                  disabled={!editingProfile}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                defaultValue={school}
                disabled={!editingProfile}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <Card className="bg-accent/20 border-none">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Delete Account</Label>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
