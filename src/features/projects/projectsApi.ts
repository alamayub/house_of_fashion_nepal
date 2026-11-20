import type {
  AgencyProject,
  ClientPartner,
  CreateClientPayload,
  CreateProjectPayload,
  ProjectsQueryParams,
  UpdateClientPayload,
  UpdateProjectPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientPartner[], void>({
      query: () => '/clients',
      providesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    createClient: builder.mutation<ClientPartner, CreateClientPayload>({
      query: (body) => ({
        url: '/clients',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    updateClient: builder.mutation<ClientPartner, UpdateClientPayload>({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'Clients', id: 'LIST' },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
    deleteClient: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Clients', id: 'LIST' },
        { type: 'Projects', id: 'LIST' },
      ],
    }),
    getProjects: builder.query<AgencyProject[], ProjectsQueryParams | void>({
      query: (params) => {
        const cleanParams: Record<string, string | number | boolean> = {};
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== 'All') {
              cleanParams[key] = value;
            }
          });
        }
        return {
          url: '/projects',
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      providesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    createProject: builder.mutation<AgencyProject, CreateProjectPayload>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    updateProject: builder.mutation<AgencyProject, UpdateProjectPayload>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    deleteProject: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
