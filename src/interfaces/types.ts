export interface IUser {
  id: number;
  currentAction: string;
  lastSound: ISound | {};
}

export interface ISound {
  fileId: string;
  title?: string;
  identifier: string;
  createdAt?: string;
}
