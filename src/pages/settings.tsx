/**
 * Settings Page
 * User profile and account settings
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { Settings, User, Lock, Save } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApi } from "@/lib/hooks/use-api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  displayName: z.string().optional().nullable(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

interface UserProfile {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatar: string | null;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const { execute: executeProfile, isLoading: isLoadingProfile } = useApi({
    showErrorToast: true,
    showSuccessToast: false,
  });

  const { execute: executePassword, isLoading: isLoadingPassword } = useApi({
    showErrorToast: true,
    showSuccessToast: false,
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.get<UserProfile>("/auth/me");
        setProfile(data);
        resetProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          displayName: data.displayName || "",
        });
      } catch (error) {
        // Error handled
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      await executeProfile(() =>
        api.put("/auth/profile", {
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          displayName: data.displayName || null,
        })
      );
      setProfileSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(false), 3000);
      
      // Reload profile
      const updated = await api.get<UserProfile>("/auth/me");
      setProfile(updated);
      updateUser({
        username: updated.displayName || updated.fullName,
      });
    } catch (error) {
      // Error handled by useApi
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await executePassword(() =>
        api.post("/auth/change-password", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      );
      setPasswordSuccess(true);
      toast.success("Password changed successfully!");
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      // Error handled by useApi
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              {profileSuccess && (
                <SuccessMessage message="Profile updated successfully!" />
              )}

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...registerProfile("firstName")}
                  placeholder="Enter your first name"
                />
                {profileErrors.firstName && (
                  <p className="text-sm text-destructive">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...registerProfile("lastName")}
                  placeholder="Enter your last name"
                />
                {profileErrors.lastName && (
                  <p className="text-sm text-destructive">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  {...registerProfile("displayName")}
                  placeholder="Enter your display name"
                />
                {profileErrors.displayName && (
                  <p className="text-sm text-destructive">
                    {profileErrors.displayName.message}
                  </p>
                )}
              </div>

              {profile && (
                <div className="pt-2 space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Full Name:</span>{" "}
                    {profile.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Member since:</span>{" "}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={isLoadingProfile}>
                {isLoadingProfile ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              {passwordSuccess && (
                <SuccessMessage message="Password changed successfully!" />
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...registerPassword("currentPassword")}
                  placeholder="Enter your current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPassword("newPassword")}
                  placeholder="Enter your new password"
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerPassword("confirmPassword")}
                  placeholder="Confirm your new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoadingPassword}>
                {isLoadingPassword ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="font-medium">{user.username}</p>
                </div>
                {profile && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">User ID</Label>
                      <p className="font-medium font-mono text-sm">
                        {profile.userId}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Last Updated
                      </Label>
                      <p className="font-medium">
                        {new Date(profile.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

