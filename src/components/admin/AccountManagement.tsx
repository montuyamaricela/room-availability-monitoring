import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Accounts } from "../../app/SampleData";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";

export default function AccountManagement() {
  const security = Accounts.filter(accounts => accounts.role === 'Security');
  const admin = Accounts.filter(accounts => accounts.role === 'Admin');
  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="rounded shadow-md border border-gray-light drop-shadow-md min-w-[367px] lg:w-4/5 w-full px-8 py-3">
            <div className="flex flex-col  sm:flex-row justify-between gap-5">
                <p className="text-gray-dark font-semibold text-xl">ACCOUNT MANAGEMENT</p>
                <Button className="bg-green-light hover:bg-green-dark w-fit ml-auto">CREATE ACCOUNT</Button>
            </div>
            <Input type="text" id="search" placeholder="Search" required className="sm:w-1/2 w-full my-5 float-right"/>
            <div className="mt-24">
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="security" className="sm:px-16 px-8 rounded-t-2xl border-2 border-green-dark">SECURITY</TabsTrigger>
                    <TabsTrigger value="admin" className="sm:px-20 px-10 rounded-t-2xl border-2 border-green-dark">ADMIN</TabsTrigger>
                </TabsList>
                <TabsContent value="security">
                  <Table>
                    <TableHeader>
                        <TableRow className="border-t-2">
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {security.map((account) => (
                        <TableRow key={account.id} className="odd:bg-table-gray">
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.role}</TableCell>
                            <TableCell>
                                <Button className="bg-transparent hover:bg-red-light hover:text-white hover:no-underline text-red-light underline">
                                    Block
                                </Button>
                                <Button className="bg-transparent hover:bg-green-light hover:no-underline hover:text-white text-green-light underline">
                                    Unblock
                                </Button>
                                <Button className="bg-transparent hover:bg-red-light hover:no-underline hover:text-white text-red-light underline">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="admin">
                <Table>
                    <TableHeader>
                        <TableRow className="border-t-2">
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admin.map((account) => (
                        <TableRow key={account.id} className="odd:bg-table-gray">
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.role}</TableCell>
                            <TableCell>{account.department}</TableCell>
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