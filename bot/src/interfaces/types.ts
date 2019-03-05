export interface IUser {
  id: number;
  currentAction?: string;
  currentChatId?: number;
  lastSound: ISound | {};
}

export interface ISound {
  fileId: string;
  identifier: string;
  createdAt?: string;
}

export interface IUserAction {
  currentAction: string | null;
  currentChatId: number | null;
}

export interface IPlayCommandResponse {
  text?: string;
  fileId?: string;
}
