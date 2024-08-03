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
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

type ModalProps = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  id?: string | undefined;
  role?: string | undefined;
};

export function ModalMenu({ name, email, id, role }: ModalProps) {
  return (
    <>
      {id ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="menu-toggle flex cursor-pointer flex-col gap-1 p-3">
              <div className="h-0.5 w-7 rounded-2xl bg-white"></div>
              <div className="h-0.5  w-7 rounded-2xl bg-white"></div>
              <div className="h-0.5  w-7 rounded-2xl bg-white"></div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar>
                <Image src={avatar} alt="Avatar" />
              </Avatar>
              <div className="text-sm text-gray-dark">Welcome, {name}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {role != "Security Guard" && (
              <DropdownMenuItem>
                <Link href="/admin/account-management">Manage Account</Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>
              <Link href="/admin/activity-log">Activity Log</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/feedback">Feedback</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/profile-setting">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin/change-password">Password Settings</Link>
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
        </DropdownMenu>
      ) : (
        <div className="text-center text-sm text-gray-dark">
          <Link href="/signin">
            <Button className=" bg-transparent uppercase hover:bg-transparent ">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
