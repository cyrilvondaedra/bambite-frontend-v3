"use client";

import { User } from "@/components/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

interface ProfileSectionProps {
  user: User;
  isEditing: boolean;
  formData: { name: string; email: string; profileImageUrl: string | null };
  message: string;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
  onFormChange: (field: string, value: string) => void;
}

export default function ProfileSection({
  user,
  isEditing,
  formData,
  message,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFormChange,
}: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Profile Information
          </h2>
          {!isEditing && (
            <Button
              onClick={onEdit}
              variant="secondary"
              className="flex items-center gap-2 bg-transparent"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-100/20 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange("name", e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium text-foreground">{user.name}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
