import type {
  CreateTestimonialPayload,
  Testimonial,
  TestimonialsQueryParams,
  UpdateTestimonialPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], TestimonialsQueryParams | void>({
      query: (params) => {
        const cleanParams: Record<string, string | boolean> = {};
        if (params) {
          if (params.perspective && params.perspective !== 'All') {
            cleanParams.perspective = params.perspective;
          }
          if (params.featured !== undefined) {
            cleanParams.featured = params.featured;
          }
        }
        return {
          url: '/testimonials',
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      providesTags: [{ type: 'Testimonials', id: 'LIST' }],
    }),
    createTestimonial: builder.mutation<Testimonial, CreateTestimonialPayload>({
      query: (body) => ({
        url: '/testimonials',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Testimonials', id: 'LIST' }],
    }),
    updateTestimonial: builder.mutation<Testimonial, UpdateTestimonialPayload>({
      query: ({ id, ...body }) => ({
        url: `/testimonials/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Testimonials', id: 'LIST' }],
    }),
    deleteTestimonial: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Testimonials', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
