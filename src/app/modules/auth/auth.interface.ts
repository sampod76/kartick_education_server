export type ILoginUser = {
  email?: string;
  password?: string;
  uid: string;
  role: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
