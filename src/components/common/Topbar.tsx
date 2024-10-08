"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ModalMenu from "../common/Modal/ModalMenu";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import bell from "/public/images/icon/bell.png";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { useUserInfoStore } from "~/store/useUserInfoStore";

export default function Topbar() {
  const pathname = usePathname();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <div
      className={`flex items-center bg-primary-green text-white ${pathname.includes("signup") || pathname.includes("signin") || pathname.includes("forgot-password") ? "hidden" : "block"}`}
    >
      <div className="container mx-auto flex items-center justify-between py-5">
        <Link
          href={session.data ? "/admin" : "/"}
          className="flex items-center gap-2 font-bold"
        >
          <Image src={logo} alt="logo" className="h-12 w-12" />
          BULACAN STATE UNIVERSITY
        </Link>

        <div className="flex gap-2">
          {/* <Link
            className={session.data ? "block" : "hidden"}
            href="/admin/notification"
          >
            <Image src={bell} alt="notification" className="h-8 w-8" />
          </Link> */}
          <ModalMenu {...session?.data?.user} />
        </div>
      </div>
    </div>
  );
}
