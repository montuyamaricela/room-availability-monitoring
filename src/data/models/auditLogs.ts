export interface activityLogsAttributes {
  id: number;
  dateTime: Date;
  userName: string;
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
  borrowedAt?: Date;
  returnedAt?: Date;
}
