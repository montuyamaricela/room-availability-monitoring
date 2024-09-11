export interface scheduleAttributes {
  id: number;
  facultyName: string;
  department: string;
  section: string;
  courseCode: string;
  room: {
    roomName: string;
    building: string;
  };
  faculties: [{ department: string }];

  day: string;
  beginTime: string;
  endTime: string;
}

// export interface schedule {
//   // id: number;
//   attributes: scheduleAttributes;
// }
