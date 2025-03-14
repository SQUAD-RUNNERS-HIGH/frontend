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
export interface location {
  latitude: number;
  longitude: number;
}
export interface userLoginType {
  loginId: string;
  password: string;
}

export interface location {
  latitude: number;
  longitude: number;
}

export interface Place {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      }
    }
  };
  place_id: string;
}

type Coordinate = [number, number];

interface Elevation {
  elevation: number;
}

export type CourseResponse = {
  coordinates: Coordinate[][];
  courseId: string;
};

export type CourseResponses = {
  courseResponses: CourseResponse[];
};

export interface CourseDetail {
  courseElevations: Elevation[];
  courseName: string;
  maxCalorie: number;
  minCalorie: number;
  perimeter: number;
}
