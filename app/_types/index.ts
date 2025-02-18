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
