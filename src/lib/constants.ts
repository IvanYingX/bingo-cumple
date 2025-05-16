export const API_SLICE_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://bingo-cumple.vercel.app/api'
    : 'http://localhost:3000/api';
