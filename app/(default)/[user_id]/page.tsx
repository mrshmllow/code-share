"use client";

import { useProfileStore } from "./store";
import Image from "next/image";

export default function ProfilePage() {
  const profile = useProfileStore();

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-32 h-32 relative">
          <Image
            src={profile.image}
            alt={`${profile.name}'s profile picture`}
            fill={true}
            className="rounded-full"
          />
        </div>

        <div>
          <p className="font-bold text-xl">{profile.name}</p>
        </div>
      </div>
    </div>
  );
}
