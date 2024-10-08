export interface activityLogsAttributes {
  id: number;
  dateTime: Date;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
  };
  activity: string;
}

export interface roomLogsAttributes {
  id: number;
  dateTime: Date;
  facultyName: string;
  roomId: string;
  loggedBy: string;
  activity: string;
  careOf: string;
}
