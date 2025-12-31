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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";
import {
  ProfileSchema,
  type ProfileForm,
} from "@/validations/profile.validations";
import { deleteUser, updateUser } from "@/_api/Auth/users";

interface ProfileContentProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
}

export default function ProfileContent(props: ProfileContentProps) {
  const { id, firstName, lastName, email, phone, school } = props;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    firstName,
    lastName,
    email,
    phone,
    school,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // keep state in sync if parent refetches
  useEffect(() => {
    setForm({ firstName, lastName, email, phone, school });
  }, [firstName, lastName, email, phone, school]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setErrors({});

    const parsed = ProfileSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(
        (i) => (errs[i.path[0] as string] = i.message)
      );
      setErrors(errs);
      setSaving(false);
      return;
    }

    try {
      await updateUser(id, parsed.data);
      setEditing(false);
    } catch (e: any) {
      setErrors({ root: e.message ?? "Update failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("This will permanently delete your account.")) return;

    try {
      setDeleting(true);
      await deleteUser(id);
      window.location.href = "/";
    } catch (e: any) {
      alert(e.message ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  // return (
  //   <Tabs defaultValue="personal" className="space-y-6">
  //     <TabsList className="grid w-full grid-cols-2 bg-accent/20 border-none">
  //       <TabsTrigger value="personal">Personal</TabsTrigger>
  //       <TabsTrigger value="account">Account</TabsTrigger>
  //     </TabsList>

  //     {/* Personal Information */}
  //     <TabsContent value="personal" className="space-y-6">
  //       <Card className="bg-accent/20 border-none">
  //         <CardHeader className="flex flex-row justify-between">
  //           <div className="flex flex-col gap-2">
  //             <CardTitle>Personal Information</CardTitle>
  //             <CardDescription>
  //               Update your personal details and profile information.
  //             </CardDescription>
  //           </div>
  //           <Button
  //             variant="secondary"
  //             onClick={() => setEditingProfile((prev) => !prev)}
  //           >
  //             {editingProfile ? "Done" : "Edit Profile"}
  //           </Button>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
  //             <div className="space-y-2">
  //               <Label htmlFor="firstName">First Name</Label>
  //               <Input
  //                 id="firstName"
  //                 defaultValue={firstName}
  //                 disabled={!editingProfile}
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="lastName">Last Name</Label>
  //               <Input
  //                 id="lastName"
  //                 defaultValue={lastName}
  //                 disabled={!editingProfile}
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="email">Email</Label>
  //               <Input
  //                 id="email"
  //                 type="email"
  //                 defaultValue={email}
  //                 disabled={!editingProfile}
  //               />
  //             </div>
  //             <div className="space-y-2">
  //               <Label htmlFor="phone">Phone</Label>
  //               <Input
  //                 id="phone"
  //                 defaultValue={phone}
  //                 disabled={!editingProfile}
  //               />
  //             </div>
  //           </div>

  //           <div className="space-y-2">
  //             <Label htmlFor="school">School</Label>
  //             <Input
  //               id="school"
  //               defaultValue={school}
  //               disabled={!editingProfile}
  //             />
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </TabsContent>

  //     {/* Account Settings */}
  //     <TabsContent value="account" className="space-y-6">
  //       <Card className="border-destructive/50">
  //         <CardHeader>
  //           <CardTitle className="text-destructive">Danger Zone</CardTitle>
  //           <CardDescription>
  //             Irreversible and destructive actions
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="flex items-center justify-between">
  //             <div className="space-y-1">
  //               <Label className="text-base">Delete Account</Label>
  //               <p className="text-muted-foreground text-sm">
  //                 Permanently delete your account and all data
  //               </p>
  //             </div>
  //             <Button variant="destructive">
  //               <Trash2 className="mr-2 h-4 w-4" />
  //               Delete Account
  //             </Button>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </TabsContent>
  //   </Tabs>
  // );

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-accent/20 border-none">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      {/* Personal */}
      <TabsContent value="personal" className="space-y-6">
        <Card className="bg-accent/20 border-none">
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </div>

            <div className="flex gap-2">
              {editing && (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}

              <Button variant="secondary" onClick={() => setEditing((p) => !p)}>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root}</p>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={form.school}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account */}
      <TabsContent value="account" className="space-y-6">
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

              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
