import React from "react";
import { Marker, LatLng } from "react-native-maps";
import { useCourseStore } from "@/store/useCourseStore";
import { useShallow } from "zustand/react/shallow";

interface CourseMarkersProps {
  onCoursePress: (courseId: string, coordinates: number[][]) => void;
}

export const CourseMarkers = ({ onCoursePress }: CourseMarkersProps) => {
  const { currentCourses, setSelectedCourseId, setIsDropdownVisible } = useCourseStore(
    useShallow((state) => ({
      currentCourses: state.currentCourses,
      setSelectedCourseId: state.setSelectedCourseId,
      setIsDropdownVisible: state.setIsDropdownVisible,
    }))
  );

  return (
    <>
      {currentCourses?.map((course, index) => {
        if (!course) return null;
        
        const courseStart: LatLng = {
          longitude: course?.coordinates[0][0][0],
          latitude: course?.coordinates[0][0][1],
        };

        return (
          <Marker
            key={index}
            coordinate={courseStart}
            style={{ zIndex: 3 }}
            onPress={() => {
              setSelectedCourseId(course.courseId);
              setIsDropdownVisible(false);
              onCoursePress(course.courseId, course.coordinates[0]);
            }}
            pinColor="#8A2BE2"
          />
        );
      })}
    </>
  );
};