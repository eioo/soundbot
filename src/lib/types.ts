interface IUser {
  id: number;
  current_action: string;
  last_sound?: ISound;
}

export interface ISound {
  user_id?: number;
  file_id: string;
  duration: number;
  mime_type?: string;
  title?: string;
  performer?: string;
  created_at?: string;
  type: 'audio' | 'voice';
  identifier: string;
}

interface IGetSoundOptions {
  type: 'user' | 'all';
  identifier: string;
}

interface IGetAllSoundsOptions {
  type: 'user' | 'all';
  limit?: number;
}
