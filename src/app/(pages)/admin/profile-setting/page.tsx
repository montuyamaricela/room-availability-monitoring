/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-const */
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ProfileSettings from "~/components/common/ProfileSettings";
import Spinner from "~/components/common/Spinner";
import { useUserInfoStore } from "~/store/useUserInfoStore";
import { api } from "~/trpc/react";

export default function Page() {
  const session = useSession();
  const { setUser } = useUserInfoStore();
  const { mutate, isPending } = api.user.getUserInfo.useMutation({
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
    },
    onError: (error) => {
      console.error("Error fetching user info:", error.message);
    },
  });

  useEffect(() => {
    // Check if session is ready and user ID is available
    if (session.status === "authenticated" && session.data?.user.id) {
      const fetchUserInfo = async () => {
        try {
          mutate({ id: session.data.user.id });
        } catch (error) {
          console.error("Error during fetchUserInfo:", error);
        }
      };

      // Fetch user info immediately
      void fetchUserInfo();
    }
  }, [session]);

  return (
    <>
      {isPending || session.status === "loading" ? (
        <Spinner />
      ) : (
        <ProfileSettings />
      )}
    </>
  );
}
