export interface userSignupType {
  loginId: string;
  password: string;
  username: string;
  physical: {
    gender: "MALE" | "FEMALE";
    age: number;
    height: number;
    weight: number;
  };
};

export interface userLoginType {
  loginId: string;
  password: string;
}

export interface location {
  latitude: number;
  longitude: number;
}