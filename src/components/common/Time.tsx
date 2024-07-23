import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";

export default function Time() {
    return (
        <Select required>
            <SelectTrigger className="w-[105px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Time</SelectLabel>
                    <SelectItem value="7am">7:00 AM</SelectItem>
                    <SelectItem value="8am">8:00 AM</SelectItem>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="10am">10:00 AM</SelectItem>
                    <SelectItem value="11am">11:00 AM</SelectItem>
                    <SelectItem value="12pm">12:00 PM</SelectItem>
                    <SelectItem value="1pm">1:00 PM</SelectItem>
                    <SelectItem value="2pm">2:00 PM</SelectItem>
                    <SelectItem value="3pm">3:00 PM</SelectItem>
                    <SelectItem value="4pm">4:00 PM</SelectItem>
                    <SelectItem value="5pm">5:00 PM</SelectItem>
                    <SelectItem value="6pm">6:00 PM</SelectItem>
                    <SelectItem value="7pm">7:00 PM</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}