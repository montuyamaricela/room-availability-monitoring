export interface scheduleAttributes {
  id: number;
  facultyName: string;
  department?: string;
  roomId: string;
  section: string;
  courseCode: string;
  room: {
    roomName: string;
    building: string;
  };
  day: string;
  beginTime: Date;
  endTime: Date;
  isTemp: boolean;
}

export interface scheduleRecordsAttributes {
  id: number;
  facultyName: string;
  roomScheduleId: number;
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

// export interface schedule {
//   // id: number;
//   attributes: scheduleAttributes;
// }
