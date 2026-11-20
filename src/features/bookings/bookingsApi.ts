import type {
  ApplicationRecord,
  BookingPayload,
  BookingRecord,
  ContactPayload,
  ContactRecord,
  UpdateBookingPayload,
  UpdateContactPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export interface AdminOverviewResponse {
  bookings: BookingRecord[];
  applications: ApplicationRecord[];
  contacts: ContactRecord[];
}

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<BookingRecord, BookingPayload>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    updateBooking: builder.mutation<BookingRecord, UpdateBookingPayload>({
      query: ({ id, ...body }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    deleteBooking: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    createContact: builder.mutation<ContactRecord, ContactPayload>({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    updateContact: builder.mutation<ContactRecord, UpdateContactPayload>({
      query: ({ id, ...body }) => ({
        url: `/contact/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    deleteContact: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminOverview'],
    }),
    resetAdminDemoData: builder.mutation<{ reset: boolean }, void>({
      query: () => ({
        url: '/admin/reset',
        method: 'POST',
      }),
      invalidatesTags: [
        'AdminOverview',
        'Models',
        'FeaturedModels',
        'Categories',
        'Clients',
        'Projects',
        'Testimonials',
        'Events',
        'EventRegistrations',
      ],
    }),
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => '/admin/overview',
      providesTags: ['AdminOverview'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useResetAdminDemoDataMutation,
  useGetAdminOverviewQuery,
} = bookingsApi;
