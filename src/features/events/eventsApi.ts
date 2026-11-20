import type {
  AgencyEvent,
  CreateEventPayload,
  EventRegistrationPayload,
  EventRegistrationRecord,
  EventsQueryParams,
  UpdateEventPayload,
  UpdateEventRegistrationPayload,
} from '../../types/index.ts';
import { baseApi } from '../api/baseApi.ts';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<AgencyEvent[], EventsQueryParams | void>({
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
          url: '/events',
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Events' as const, id })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),
    createEvent: builder.mutation<AgencyEvent, CreateEventPayload>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }, 'AdminOverview'],
    }),
    updateEvent: builder.mutation<AgencyEvent, UpdateEventPayload>({
      query: ({ id, ...body }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Events', id: 'LIST' },
        { type: 'Events', id: arg.id },
        { type: 'EventRegistrations', id: 'LIST' },
        'AdminOverview',
      ],
    }),
    deleteEvent: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        { type: 'EventRegistrations', id: 'LIST' },
        'AdminOverview',
      ],
    }),
    getEventRegistrations: builder.query<
      EventRegistrationRecord[],
      { eventId?: string; status?: string } | void
    >({
      query: (params) => {
        const cleanParams: Record<string, string> = {};
        if (params?.eventId && params.eventId !== 'All') {
          cleanParams.eventId = params.eventId;
        }
        if (params?.status && params.status !== 'All') {
          cleanParams.status = params.status;
        }
        return {
          url: '/event-registrations',
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      providesTags: [{ type: 'EventRegistrations', id: 'LIST' }],
    }),
    createEventRegistration: builder.mutation<
      EventRegistrationRecord,
      EventRegistrationPayload
    >({
      query: (body) => ({
        url: '/event-registrations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        { type: 'EventRegistrations', id: 'LIST' },
        'AdminOverview',
      ],
    }),
    updateEventRegistration: builder.mutation<
      EventRegistrationRecord,
      UpdateEventRegistrationPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/event-registrations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        { type: 'EventRegistrations', id: 'LIST' },
        'AdminOverview',
      ],
    }),
    deleteEventRegistration: builder.mutation<{ deleted: boolean; id: string }, string>(
      {
        query: (id) => ({
          url: `/event-registrations/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          { type: 'Events', id: 'LIST' },
          { type: 'EventRegistrations', id: 'LIST' },
          'AdminOverview',
        ],
      },
    ),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventRegistrationsQuery,
  useCreateEventRegistrationMutation,
  useUpdateEventRegistrationMutation,
  useDeleteEventRegistrationMutation,
} = eventsApi;
