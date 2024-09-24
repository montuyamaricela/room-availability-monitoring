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

// export interface schedule {
//   // id: number;
//   attributes: scheduleAttributes;
// }
