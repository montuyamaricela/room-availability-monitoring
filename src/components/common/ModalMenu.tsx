"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar } from "../ui/avatar";
import Image from "next/image";
import avatar from "/public/images/avatar/image.png";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export function ModalMenu() {
  const session = useSession();
  console.log(session);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="menu-toggle flex cursor-pointer flex-col gap-1 p-5">
          <div className="h-1 w-7 rounded-2xl bg-white"></div>
          <div className="h-1 w-7 rounded-2xl bg-white"></div>
          <div className="h-1 w-7 rounded-2xl bg-white"></div>
        </div>
      </DropdownMenuTrigger>
      {session.data ? (
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar>
              <Image src={avatar} alt="Avatar" />
            </Avatar>
            <div className="text-sm text-gray-dark">
              Welcome, {session.data.user.name}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/accountmanagement">Manage Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/activitylog">Activity Log</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/feedback">Feedback</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/profilesetting">Profile Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/changepassword">Password Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={() => signOut()}
              className="h-5 bg-transparent p-0 font-normal text-gray-dark hover:bg-transparent"
            >
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center justify-center gap-2">
            <div className="text-center text-sm text-gray-dark">
              <Link href="/signin">Sign In</Link>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
