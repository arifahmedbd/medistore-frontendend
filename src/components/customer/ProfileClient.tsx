"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ImageIcon,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  Mail,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/customer.action";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  emailVerified: boolean;
}

interface Props {
  profile: Profile | null;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfileClient({ profile }: Props) {
  const router = useRouter();

  const [name, setName] = useState(profile?.name ?? "");
  const [image, setImage] = useState(profile?.image ?? "");
  const [profilePending, startProfileTransition] = useTransition();

  const handleProfileSave = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    startProfileTransition(async () => {
      const res = await updateProfileAction({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error?.message ?? "Failed to update");
        return;
      }

      toast.success("Profile updated!");
      router.refresh();
    });
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Could not load profile</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto max-w-2xl px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {profile.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  profile.role === "SELLER"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : profile.role === "ADMIN"
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                }`}
              >
                {profile.role}
              </span>

              {profile.emailVerified && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <BadgeCheck size={12} /> Verified
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto">
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <ShoppingBag size={14} /> My Orders
            </Link>
          </div>
        </div>

        <div className="space-y-4">

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> Account Info
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {profile.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                  <Calendar size={12} className="text-gray-400" />
                  {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm flex items-center gap-2">
              <User size={14} className="text-blue-500" /> Edit Profile
            </h2>

            <div className="space-y-4">
              <Field label="Full Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>

              <Field label="Profile Photo URL">
                <div className="flex gap-3 items-start">
                  <div className="relative flex-1">
                    <ImageIcon
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      onError={() => setImage("")}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-600"
                    />
                  )}
                </div>
              </Field>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleProfileSave}
                disabled={profilePending}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {profilePending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}