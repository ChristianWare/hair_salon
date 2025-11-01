"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Button from "@/components/shared/Button/Button";

export default function UserButton() {
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    try {
      setPending(true);
      await signOut(); // optionally: signOut({ callbackUrl: "/" })
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      btnType='brownBorder'
      type='button'
      disabled={pending}
      onClick={handleSignOut}
      text={pending ? "Signing out…" : "Sign Out"}
    />
  );
}
