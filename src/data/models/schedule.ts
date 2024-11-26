export interface scheduleAttributes {
  id: number;
  roomId: string;
  section: string;
  courseCode: string;
  room: {
    roomName: string;
    building: string;
  };
  faculty: {
    facultyName: string;
    department: string
  }
  day: string;
  beginTime: Date;
  endTime: Date;
  isTemp: boolean;
}

export interface scheduleRecordsAttributes {
  id: number;
  roomScheduleId: number;
  facultyName: string;
  roomSchedule: {
    roomId: string;
    room: {
      roomName: string;
      id: string;
      building: string;
    };
    day: string;
  };
  timeIn: Date;
  timeOut: Date;
}

export interface facultyAttributes {
  id: number;
  facultyName: string;
  department: string;
  email: string;
}
