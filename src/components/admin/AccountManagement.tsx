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
import CreateAccount from "./CreateAccount";
import toast from "react-hot-toast";

export default function AccountManagement() {
  const session = useSession();
  const { data, isLoading, error, refetch } = api.user.getAllUser.useQuery();
  const [search, setSearch] = useState("");

  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Successfully Deleted.");
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => deleteUser({ id: id });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  const filteredUsers = (role: string) =>
    data?.filter(
      (account) =>
        account.role === role &&
        (account.firstName.toLowerCase().includes(search.toLowerCase()) ||
          account.lastName.toLowerCase().includes(search.toLowerCase()) ||
          account.id.toLowerCase().includes(search.toLowerCase())),
    );

  const renderTable = (role: string, columns: string[]) => (
    <Table className="text-xs sm:text-sm">
      <TableHeader>
        <TableRow className="border-t-2">
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
          {session.data?.user.role === "Super Admin" && (
            <TableHead>Action</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers(role)?.map((account, index) => (
          <TableRow key={account.id} className="odd:bg-table-gray">
            <TableCell className="w-10">{index + 1}</TableCell>
            <TableCell>{account.firstName + " " + account.lastName}</TableCell>
            <TableCell>{account.email}</TableCell>
            <TableCell>{account.role}</TableCell>
            {role === "Admin" && <TableCell>{account.department}</TableCell>}
            <TableCell>{account.status}</TableCell>
            {session.data?.user.role === "Super Admin" && (
              <TableCell className="flex items-center gap-5">
                <Button className="h-5 bg-transparent p-0 text-red-light hover:bg-transparent">
                  Block
                </Button>
                <Button className="hover:bg-grtransparent h-5 bg-transparent p-0 text-green-light">
                  Unblock
                </Button>
                <Button
                  onClick={() => handleDelete(account.id)}
                  className="h-5 bg-transparent p-0 text-red-light hover:bg-transparent"
                >
                  Delete
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
        {filteredUsers(role)?.length === 0 && (
          <TableCell
            colSpan={
              columns.length +
              (session.data?.user.role === "Super Admin" ? 1 : 0)
            }
            className="text-center text-base text-red-light"
          >
            No Data Available
          </TableCell>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Container>
      <div className="flex items-center justify-center">
        <div className="w-full min-w-[367px] rounded border border-gray-light p-8 shadow-md drop-shadow-md">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <h1 className="text-2xl font-semibold text-gray-dark">
              ACCOUNT MANAGEMENT
            </h1>
            {session.data?.user.role === "Super Admin" && <CreateAccount />}
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
                {renderTable("Security Guard", [
                  "ID",
                  "Name",
                  "Email",
                  "Role",
                  "Status",
                ])}
              </TabsContent>
              <TabsContent value="admin">
                {renderTable("Admin", [
                  "ID",
                  "Name",
                  "Email",
                  "Role",
                  "Department",
                  "Status",
                ])}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
}
