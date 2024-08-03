"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModalMenu } from "../common/ModalMenu";
import Image from "next/image";
import logo from "/public/images/logo/image.png";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const pathname = usePathname();
  const session = useSession();
  return (
    <div
      className={`flex items-center bg-primary-green text-white ${pathname.includes("signup") || pathname.includes("signin") || pathname.includes("resetpassword") ? "hidden" : "block"}`}
    >
      <div className="container mx-auto flex items-center justify-between py-5">
        <Link
          href={session.data ? "/admin" : "/"}
          className="flex items-center gap-2 font-bold"
        >
          <Image src={logo} alt="logo" className="h-12 w-12" />
          BULACAN STATE UNIVERSITY
        </Link>
        <ModalMenu {...session?.data?.user} />
      </div>
    </div>
  );
}
