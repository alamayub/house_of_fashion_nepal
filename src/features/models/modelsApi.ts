import type {
  CategoryItem,
  CreateModelPayload,
  Model,
  ModelsQueryParams,
  ModelVideo,
  PaginatedModelsResponse,
  ServiceItem,
  UpdateModelPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export const modelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<PaginatedModelsResponse, ModelsQueryParams | void>({
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
          url: '/models',
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Models' as const, id })),
              { type: 'Models', id: 'LIST' },
            ]
          : [{ type: 'Models', id: 'LIST' }],
    }),
    getModelBySlug: builder.query<{ model: Model; similar: Model[] }, string>({
      query: (slug) => `/models/${slug}`,
      providesTags: (result, _err, slug) => [
        { type: 'Models', id: slug },
        ...(result?.model?.id ? [{ type: 'Models' as const, id: result.model.id }] : []),
      ],
    }),
    getFeaturedModels: builder.query<Model[], void>({
      query: () => '/models/featured',
      providesTags: ['FeaturedModels'],
    }),
    getCategories: builder.query<CategoryItem[], void>({
      query: () => '/models/categories',
      providesTags: ['Categories'],
    }),
    getServices: builder.query<ServiceItem[], void>({
      query: () => '/services',
      providesTags: ['Services'],
    }),
    createModel: builder.mutation<Model, CreateModelPayload>({
      query: (body) => ({
        url: '/models',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Models', id: 'LIST' }, 'FeaturedModels', 'Categories'],
    }),
    updateModel: builder.mutation<Model, UpdateModelPayload>({
      query: ({ id, ...body }) => ({
        url: `/models/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (res, _err, arg) => [
        { type: 'Models', id: 'LIST' },
        { type: 'Models', id: arg.id },
        ...(arg.slug ? [{ type: 'Models' as const, id: arg.slug }] : []),
        ...(res?.slug ? [{ type: 'Models' as const, id: res.slug }] : []),
        { type: 'Projects', id: 'LIST' },
        { type: 'Events', id: 'LIST' },
        'FeaturedModels',
        'Categories',
      ],
    }),
    deleteModel: builder.mutation<{ deleted: boolean; id: string; slug?: string }, string>({
      query: (id) => ({
        url: `/models/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, _err, id) => [
        { type: 'Models', id: 'LIST' },
        { type: 'Models', id },
        ...(res?.slug ? [{ type: 'Models' as const, id: res.slug }] : []),
        { type: 'Projects', id: 'LIST' },
        { type: 'Events', id: 'LIST' },
        'FeaturedModels',
        'Categories',
      ],
    }),
    addModelVideo: builder.mutation<Model, { slug: string; video: Omit<ModelVideo, 'id'> }>({
      query: ({ slug, video }) => ({
        url: `/models/${slug}/videos`,
        method: 'POST',
        body: video,
      }),
      invalidatesTags: (res, _err, arg) => [
        { type: 'Models', id: 'LIST' },
        { type: 'Models', id: arg.slug },
        ...(res?.id ? [{ type: 'Models' as const, id: res.id }] : []),
        'FeaturedModels',
        'Categories',
      ],
    }),
  }),
});

export const {
  useGetModelsQuery,
  useGetModelBySlugQuery,
  useGetFeaturedModelsQuery,
  useGetCategoriesQuery,
  useGetServicesQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useAddModelVideoMutation,
} = modelsApi;
