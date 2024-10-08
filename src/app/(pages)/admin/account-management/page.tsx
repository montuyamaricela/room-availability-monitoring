"use client";
import { useSession } from "next-auth/react";
import AccountManagement from "~/components/admin/AccountManagement";
import NotAllowed from "~/components/common/NotAllowed";

export default function Page() {
  const session = useSession();
  if (session.data?.user.role != "Super Admin") {
    return <NotAllowed />;
  }

  return <AccountManagement />;
}
