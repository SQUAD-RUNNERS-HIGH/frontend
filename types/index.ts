import { LocationObjectCoords } from "expo-location/build/Location.types";

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
  userLocation: {
    latitude: number;
    longitude: number;
    specificLocation: string;
  }
};

export interface runningLocation extends LocationObjectCoords {
  runningStatus: 'ONGOING' | 'ESCAPED';
}

export interface crewRunningLocation extends LocationObjectCoords {
  runningStatus: 'ONGOING' | 'ESCAPED';
  userId: string;
  username: string;
}

export interface userLoginType {
  loginId: string;
  password: string;
}

export interface UserLoginResponse {
  tokenResponse: {
    accessToken: string;
    refreshToken: string;
  };
  userId: number;
  username: string;
};
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

export interface CreateCrewApi {
  name: string;
  description: string;
  maxCapacity: number;
  image: string;
  latitude: number;
  longitude: number;
}

export interface competitorRunningRecord {
  progress: number[];
  runningTime: number;
  courseId: string;
}

export interface soloRunningRecord {
  runningTime: number;
  progress: number[]
  coordinates: [number, number][][];
  courseName: string;
}

export interface Crew {
  crewId: number;
  crewName: string;
  numberOfParticipants: number;
  crewUserRole?: string;
}

export interface myCrewResponse {
  myCrews: Crew[];
}
export type CrewRunningPrepareParticipant = {
  userId: string;
  isReady: boolean;
  username: string;
  longitude: number;
  latitude: number;
  runningStatus: string;
};

export interface CrewRunningParticipant {
  longitude: number;
  latitude: number;
  userId: string;
  distance: number;
  username: string;
  runningStatus?: string;
}

export interface ProfileUserLocation {
  latitude: number;
  longitude: number;
  specificLocation: string;
}

export interface UserProfile {
  physical: {
    gender: "MALE" | "FEMALE";
    age: number;
    height: number;
    weight: number;
  },
  userLocation: ProfileUserLocation
  username: string;
  loginId: string;
}