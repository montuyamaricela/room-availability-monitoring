"use client";
import { useSession } from "next-auth/react";
import AccountManagement from "~/components/admin/AccountManagement";
import NotAllowed from "~/components/common/NotAllowed";

export default function Page() {
  const session = useSession();
  if (session.data?.user.role === "Security Guard" || session.data?.user.role === "Room Viewer") {
    return <NotAllowed />;
  }

  return <AccountManagement />;
}
