import type {
  ApplicationPayload,
  ApplicationRecord,
  UpdateApplicationPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation<ApplicationRecord, ApplicationPayload>({
      query: (body) => ({
        url: '/applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    updateApplication: builder.mutation<ApplicationRecord, UpdateApplicationPayload>({
      query: ({ id, ...body }) => ({
        url: `/applications/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    deleteApplication: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminOverview'],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationsApi;
