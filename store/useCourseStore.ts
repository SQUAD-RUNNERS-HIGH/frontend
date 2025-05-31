import { CourseResponse } from '@/types';
import { create } from 'zustand';

interface CourseStore {
  currentCourses: CourseResponse[] | null;
  setCurrentCourses: (courses: CourseResponse[] | null) => void;
  selectedCourseId: string;
  setSelectedCourseId: (courseId: string) => void;
  isDropdownVisible: boolean;
  setIsDropdownVisible: (visible: boolean) => void;
  totalDistance: number;
  setTotalDistance: (value: number) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  currentCourses: null,
  setCurrentCourses: (courses) => set({ currentCourses: courses }),
  selectedCourseId: '',
  setSelectedCourseId: (courseId) => set({ selectedCourseId: courseId }),
  isDropdownVisible: false,
  setIsDropdownVisible: (visible) => set({ isDropdownVisible: visible }),
  totalDistance: 0,
  setTotalDistance: (totalDistance) => set({totalDistance})
}));
