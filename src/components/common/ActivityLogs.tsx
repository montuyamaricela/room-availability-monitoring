import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../common/DatePicker";
import { ActivityLog } from "../../app/SampleData";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"

export default function ActivityLogs() {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="rounded shadow-md border border-gray-light drop-shadow-md lg:w-4/5 w-full p-8">
          <p className="text-gray-dark font-semibold text-xl">ACTIVITY LOGS</p>
          <hr className="mt-1 mb-7 border border-gray-light border-t-1"/>
          
          <div className="flex flex-col md:flex-row gap-5 justify-between mb-7">
            <Input type="text" id="search" placeholder="Search" className="md:w-1/3 w-full md:mb-0 mb-2" required/>
            <div className="flex gap-2">
                <DatePickerDemo />
                <DatePickerDemo />
            </div>
          </div>

          <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Transaction #</TableHead>
                        <TableHead>Date and Time</TableHead>
                        <TableHead>Activities</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ActivityLog.map((logs) => (
                    <TableRow key={logs.id} className="odd:bg-table-gray">
                        <TableCell className="font-medium">{logs.id}</TableCell>
                        <TableCell>{logs.dateTime}</TableCell>
                        <TableCell>{logs.activities}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Container>
  );
}