"use client";

import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { api } from "~/trpc/react";
import Spinner from "../common/Spinner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function AccountManagement() {
  const session = useSession();

  const { data, isLoading, error } = api.user.getAllUser.useQuery();
  const [search, setSearch] = useState("");
  const filteredUsers = (role: string) => {
    return data?.filter(
      (account) =>
        account.role === role &&
        (account.firstName.toLowerCase().includes(search.toLowerCase()) ||
          account.lastName.toLowerCase().includes(search.toLowerCase()) ||
          account.id.toLowerCase().includes(search.toLowerCase())),
    );
  };
  // Filter users based on role
  const security = data?.filter((account) => account.role === "Security Guard");
  const admin = data?.filter((account) => account.role === "Admin");

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full min-w-[367px] rounded border border-gray-light p-8 shadow-md drop-shadow-md lg:w-4/5">
          <div className="flex flex-col  items-center justify-between gap-5 sm:flex-row">
            <h1 className="text-2xl font-semibold text-gray-dark">
              ACCOUNT MANAGEMENT
            </h1>
            {session.data?.user.role === "Super Admin" && (
              <div>
                <Button className="ml-auto w-fit bg-green-light hover:bg-green-dark">
                  CREATE ACCOUNT
                </Button>
              </div>
            )}
          </div>
          <Input
            type="text"
            id="search"
            placeholder="Search"
            required
            className="float-right my-5 w-full sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-24">
            <Tabs defaultValue="security">
              <TabsList>
                <TabsTrigger
                  value="security"
                  className="rounded-t-2xl border-2 border-green-dark px-8 sm:px-16"
                >
                  SECURITY
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-t-2xl border-2 border-green-dark px-10 sm:px-20"
                >
                  ADMIN
                </TabsTrigger>
              </TabsList>
              <TabsContent value="security">
                <Table className="text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow className="border-t-2">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {security?.map((account) => (
                      <TableRow
                        key={account?.id}
                        className="odd:bg-table-gray "
                      >
                        <TableCell className="w-10">{account?.id}</TableCell>
                        <TableCell>
                          {account?.firstName + " " + account.lastName}
                        </TableCell>
                        <TableCell>{account?.role}</TableCell>
                        <TableCell className="flex items-center gap-5">
                          <Button className="h-5 bg-transparent p-0 text-red-light hover:bg-red-light hover:bg-transparent ">
                            Block
                          </Button>
                          <Button className=" h-5 bg-transparent p-0 text-green-light hover:bg-green-light hover:bg-transparent  ">
                            Unblock
                          </Button>
                          <Button className="h-5  bg-transparent p-0 text-red-light hover:bg-red-light hover:bg-transparent  ">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="admin">
                <Table className="text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow className="border-t-2">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      {session.data?.user.role === "Super Admin" && (
                        <TableHead>Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admin?.map((account) => (
                      <TableRow key={account?.id} className="odd:bg-table-gray">
                        <TableCell className="w-10">{account?.id}</TableCell>
                        <TableCell>
                          {account?.firstName + " " + account.lastName}
                        </TableCell>
                        <TableCell>{account?.role}</TableCell>
                        <TableCell>{account?.department}</TableCell>
                        {session.data?.user.role === "Super Admin" && (
                          <TableCell className="flex items-center gap-5">
                            <Button className="h-5 bg-transparent p-0 text-red-light hover:bg-red-light hover:bg-transparent ">
                              Block
                            </Button>
                            <Button className=" h-5 bg-transparent p-0 text-green-light hover:bg-green-light hover:bg-transparent  ">
                              Unblock
                            </Button>
                            <Button className="h-5  bg-transparent p-0 text-red-light hover:bg-red-light hover:bg-transparent  ">
                              Delete
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}
