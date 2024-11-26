/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { Avatar } from "../../ui/avatar";
import avatar from "/public/images/avatar/image.png";
import Link from "next/link";
import { Button } from "../../ui/button";
import { signOut } from "next-auth/react";
import { useActivityLog } from "~/lib/createLogs";
import { useUserInfoStore } from "~/store/useUserInfoStore";

type ModalProps = {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  id?: string | undefined;
  role?: string | undefined;
};

export default function ModalMenu({
  firstName,
  lastName,
  id,
  role,
}: ModalProps) {
  const { logActivity } = useActivityLog();
  const { user } = useUserInfoStore();

  const signOutHandler = async () => {
    void signOut();
    logActivity(firstName + " " + lastName || "", "logged out");
  };
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
                <img
                  src={user?.image ?? avatar.src}
                  alt="Avatar"
                  className="rounded-full border-2 border-primary-green"
                />
              </Avatar>
              <div className="text-sm text-gray-dark">
                Welcome, {user?.firstName ?? firstName}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Link href="/admin">
              <DropdownMenuItem>Home</DropdownMenuItem>
            </Link>

            {role != "Security Guard" && role != "Room Viewer" && (
              <>
                <Link href="/admin/account-management">
                  <DropdownMenuItem>Manage Account</DropdownMenuItem>
                </Link>
                <Link href="/admin/schedule">
                  <DropdownMenuItem>Schedule</DropdownMenuItem>
                </Link>
                <Link href="/admin/faculty">
                  <DropdownMenuItem>Faculty</DropdownMenuItem>
                </Link>
              </>
            )}
            {role != "Room Viewer" && (
              <Link href="/admin/logs">
                <DropdownMenuItem>Logs</DropdownMenuItem>
              </Link>
            )}
            {role === "Super Admin" && (
              <Link href="/admin/barcode-list">
                <DropdownMenuItem>Barcode List</DropdownMenuItem>
              </Link>
            )}
            {role != "Room Viewer" && (
              <>
                <Link href="/admin/feedback">
                  <DropdownMenuItem>Feedback</DropdownMenuItem>
                </Link>
                <Link href="/admin/profile-setting">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                </Link>
                <Link href="/admin/change-password">
                  <DropdownMenuItem>Password Settings</DropdownMenuItem>
                </Link>
              </>
            )}

            <div
              onClick={signOutHandler}
              className="h-5 w-full  font-normal text-gray-dark hover:cursor-pointer"
            >
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </div>
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
