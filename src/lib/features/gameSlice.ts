import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { defaultHeaders } from '@/lib/features/utils';
import { API_SLICE_BASE_URL } from '@/lib/constants';
import { Game, GameQuestion } from '@/lib/prisma';
import { toast } from 'sonner';

interface GameWithQuestions extends Game {
  questions: GameQuestion[];
}

interface BingoCell {
  id: string;
  question: string;
  selected: boolean;
}

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_SLICE_BASE_URL,
    prepareHeaders: (headers) => {
      Object.entries(defaultHeaders).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
      return headers;
    },
  }),
  tagTypes: ['Game', 'Board'],
  endpoints: (builder) => ({
    getGames: builder.query<GameWithQuestions[], void>({
      query: () => `games`,
      providesTags: ['Game'],
    }),
    createGame: builder.mutation<GameWithQuestions, { name: string; questions: { question: string }[]; gameId?: string }>({
      query: (body) => ({
        url: 'games',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
    getGameFromId: builder.query<GameWithQuestions, string>({
      query: (gameId) => `games/${gameId}`,
      providesTags: (result, error, gameId) => [{ type: 'Game', id: gameId }],
    }), 
    getGameStatus: builder.query<
      { started: boolean; gameId: string },
      { gameId: string }
    >({
      query: ({ gameId }) => `games/${gameId}/status`,
      providesTags: (result, error, { gameId }) => [{ type: 'Game', id: gameId }],
    }),
    startGame: builder.mutation<void, string>({
      query: (gameId) => ({
        url: `games/${gameId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, gameId) => [{ type: 'Game', id: gameId }],
    }),
    getBoard: builder.query<BingoCell[], string>({
      query: (gameId) => `games/${gameId}/board`,
      providesTags: (result, error, gameId) => [{ type: 'Board', id: gameId }],
    }),
    toggleCell: builder.mutation<
      void,
      { questionId: string; gameId: string }
    >({
      query: ({ questionId }) => ({
        url: `user-questions/${questionId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, __, { gameId }) => [{ type: 'Board', id: gameId }],
      async onQueryStarted({ questionId, gameId }, { dispatch, queryFulfilled }) {
        let wasSelected = false;

        const patchResult = dispatch(
          gameApi.util.updateQueryData('getBoard', gameId, (draft) => {
            const cell = draft.find((q) => q.id === questionId);
            if (cell) {
              wasSelected = cell.selected;
              cell.selected = !cell.selected;
            }
          })
        );

        try {
          await queryFulfilled;
          toast.success(wasSelected ? 'Celda desmarcada' : 'Celda marcada');
        } catch {
          patchResult.undo();
          toast.error('Error al actualizar la celda');
        }
      },
    }),
    deleteGame: builder.mutation<void, string>({
      query: (gameId) => ({
        url: `games/${gameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, gameId) => [{ type: 'Game', id: gameId }]
    }),
  }),
});

export const {
  useGetGamesQuery,
  useCreateGameMutation,
  useGetGameFromIdQuery,
  useGetGameStatusQuery,
  useStartGameMutation,
  useGetBoardQuery,
  useToggleCellMutation,
  useDeleteGameMutation,
} = gameApi;
