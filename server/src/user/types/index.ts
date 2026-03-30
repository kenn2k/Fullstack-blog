export interface RegisterUser {
  id: number;
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user: IUser;
}

export interface IUserWithRefresh extends IUser {
  refreshToken: string;
}
