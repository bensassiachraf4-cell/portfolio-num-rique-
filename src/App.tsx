const RESOURCE_STORAGE_KEY = 'portfolio_course_resources_v1';

function loadSavedResources(): CourseResource[] {
  if (typeof window === 'undefined') return INITIAL_COURSE_RESOURCES;
  try {
    const saved = window.localStorage.getItem(RESOURCE_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CourseResource[]) : INITIAL_COURSE_RESOURCES;
  } catch {
    return INITIAL_COURSE_RESOURCES;
  }
}
