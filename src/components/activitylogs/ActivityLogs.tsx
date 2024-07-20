import { Container } from "../common/Container";
import { Input } from "../ui/input";
import { DatePickerDemo } from "../common/DatePicker";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"

const ActivityLog = [
  { id: 20000000, 
    dateTime: "May 2, 2024 15:34:25 PM", 
    activities:"Maira Bermudez timed in at multimedia.", 
  },
  { id: 20000001, 
    dateTime: "May 2, 2024 17:34:25 PM", 
    activities:"Maira Bermudez timed out at multimedia.", 
  },
  { id: 20000002, 
    dateTime: "May 4, 2024 13:34:25 PM", 
    activities:"Maribel Garcia timed in at mpg2.", 
  },
  { id: 20000003, 
    dateTime: "May 4, 2024 15:34:25 PM", 
    activities:"Maribel Garcia timed out at mpg2.", 
  },
  { id: 20000004, 
    dateTime: "May 5, 2024 13:34:25 PM", 
    activities:"Juan Dela Cruz timed in at room 123.", 
  },
];

export default function ActivityLogs() {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="rounded shadow-md border border-gray-light drop-shadow-md w-4/5 p-8">
          <p className="text-gray-dark font-semibold text-xl">ACTIVITY LOGS</p>
          <hr className="mt-1 mb-7 border border-gray-light border-t-1"/>
          
          <div className="md:flex justify-between mb-7">
            <Input type="text" id="search" placeholder="Search" className="md:w-1/3 w-1/2 md:mb-0 mb-2" required/>
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
                    <TableRow key={logs.id}>
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