import { CourseResponse } from '@/app/_types';
import { create } from 'zustand';

interface CourseStore {
  currentCourses: CourseResponse[] | null;
  setCurrentCourses: (courses: CourseResponse[] | null) => void;
  selectedCourse: string;
  setSelectedCourse: (courseId: string) => void;
  isDropdownVisible: boolean;
  setIsDropdownVisible: (visible: boolean) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  currentCourses: null,
  setCurrentCourses: (courses) => set({ currentCourses: courses }),
  selectedCourse: '',
  setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),
  isDropdownVisible: false,
  setIsDropdownVisible: (visible) => set({ isDropdownVisible: visible }),
}));
