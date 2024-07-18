import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";

export default function SelectDepartment() {
    return (
        <Select required>
            <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Department</SelectLabel>
                    <SelectItem value="cba">CBA</SelectItem>
                    <SelectItem value="cics">CICS</SelectItem>
                    <SelectItem value="coed">CoED</SelectItem>
                    <SelectItem value="cit">CIT</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}