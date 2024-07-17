import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu"

import {Avatar} from "../ui/avatar"
import Image from "next/image";
import avatar from "/public/images/avatar/image.png";
import Link from "next/link";

  export function ModalMenu(){
    return (
        <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="flex flex-col gap-1 p-5 cursor-pointer menu-toggle">
                <div className="w-7 h-1 bg-white rounded-2xl"></div>
                <div className="w-7 h-1 bg-white rounded-2xl"></div>
                <div className="w-7 h-1 bg-white rounded-2xl"></div>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar>
                <Image src={avatar} alt="Avatar"/>
            </Avatar>
            <div className="text-sm text-gray-dark">Welcome, Username</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="#">Manage Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#">Activity Log</Link>
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
            <Link href="#">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    );
  }
  