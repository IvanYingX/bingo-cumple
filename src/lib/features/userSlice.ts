import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { defaultHeaders } from '@/lib/features/utils'
import { User } from '@/lib/prisma';
import { API_SLICE_BASE_URL } from '@/lib/constants'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_SLICE_BASE_URL,
    prepareHeaders: (headers) => {
      Object.entries(defaultHeaders).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (username) => `users/${username}`,
      providesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUserQuery
} = userApi;
