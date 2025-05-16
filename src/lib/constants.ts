export const API_SLICE_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.onlaine-cv.com/api'
    : 'http://localhost:3000/api';
