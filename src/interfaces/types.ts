export interface IUser {
  id: number;
  currentAction: string;
  lastSound: ISound | {};
}

export interface ISound {
  userId?: number;
  fileId: string;
  duration: number;
  mimeType?: string;
  title?: string;
  performer?: string;
  createdAt?: string;
  type: 'audio' | 'voice';
  identifier: string;
  fileSize: number;
}
