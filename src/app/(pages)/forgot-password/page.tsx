"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Resetpassword from "~/components/authentications/Resetpassword";
import Signin from "~/components/authentications/Signin";
import Spinner from "~/components/common/Spinner";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    return <Resetpassword />;
  }

  // Optionally, you can return null or a loading state if needed
  return null;
}
