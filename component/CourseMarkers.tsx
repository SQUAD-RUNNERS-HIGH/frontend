import React from "react";
import { Marker, LatLng } from "react-native-maps";
import { useCourseStore } from "@/store/useCourseStore";
import { useShallow } from "zustand/react/shallow";

interface CourseMarkersProps {
  onCoursePress: (courseId: string, coordinates: number[][]) => void;
}

const CourseMarkers = ({ onCoursePress }: CourseMarkersProps) => {
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

        const firstPoint = course?.coordinates?.[0]?.[0];
        if (!firstPoint || firstPoint[0] == null || firstPoint[1] == null) return null;

        const courseStart: LatLng = {
          longitude: firstPoint[0],
          latitude: firstPoint[1],
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

export default React.memo(CourseMarkers);