import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";

export default function Day() {
    return (
        <Select required>
            <SelectTrigger className="w-[105px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Day</SelectLabel>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}