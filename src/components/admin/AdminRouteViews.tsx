import { useOutletContext } from 'react-router-dom';
import type {
  AgencyEvent,
  AgencyProject,
  ApplicationRecord,
  BookingRecord,
  ClientPartner,
  ContactRecord,
  EventRegistrationRecord,
  Model,
  Testimonial,
} from '../../types/index.ts';
import { AdminOverviewTab } from './AdminOverviewTab.tsx';
import { ApplicationsAdminTab } from './ApplicationsAdminTab.tsx';
import { BookingsAdminTab } from './BookingsAdminTab.tsx';
import { ClientsAdminTab } from './ClientsAdminTab.tsx';
import { EnquiriesAdminTab } from './EnquiriesAdminTab.tsx';
import { EventsAdminTab } from './EventsAdminTab.tsx';
import { ModelsAdminTab } from './ModelsAdminTab.tsx';
import { ProjectsAdminTab } from './ProjectsAdminTab.tsx';
import { TestimonialsAdminTab } from './TestimonialsAdminTab.tsx';

export interface AdminOutletContext {
  models: Model[];
  clients: ClientPartner[];
  projects: AgencyProject[];
  events: AgencyEvent[];
  eventRegistrations: EventRegistrationRecord[];
  testimonials: Testimonial[];
  bookings: BookingRecord[];
  applications: ApplicationRecord[];
  contacts: ContactRecord[];
  modelsLoading: boolean;
  overviewLoading: boolean;
  eventsLoading: boolean;
}

export function AdminOverviewRoute() {
  const {
    models,
    clients,
    projects,
    events,
    eventRegistrations,
    testimonials,
    bookings,
    applications,
    contacts,
  } = useOutletContext<AdminOutletContext>();

  return (
    <AdminOverviewTab
      models={models}
      clients={clients}
      projects={projects}
      events={events}
      eventRegistrations={eventRegistrations}
      testimonials={testimonials}
      bookings={bookings}
      applications={applications}
      contacts={contacts}
    />
  );
}

export function AdminModelsRoute() {
  const { models, modelsLoading } = useOutletContext<AdminOutletContext>();
  return <ModelsAdminTab models={models} isLoading={modelsLoading} />;
}

export function AdminClientsRoute() {
  return <ClientsAdminTab />;
}

export function AdminProjectsRoute() {
  const { models } = useOutletContext<AdminOutletContext>();
  return <ProjectsAdminTab models={models} />;
}

export function AdminEventsRoute() {
  const { events, eventRegistrations, models, eventsLoading } =
    useOutletContext<AdminOutletContext>();
  return (
    <EventsAdminTab
      events={events}
      registrations={eventRegistrations}
      models={models}
      isLoading={eventsLoading}
    />
  );
}

export function AdminBookingsRoute() {
  const { bookings, models, overviewLoading } =
    useOutletContext<AdminOutletContext>();
  return (
    <BookingsAdminTab
      bookings={bookings}
      models={models}
      isLoading={overviewLoading}
    />
  );
}

export function AdminEnquiriesRoute() {
  const { contacts, overviewLoading } = useOutletContext<AdminOutletContext>();
  return (
    <EnquiriesAdminTab enquiries={contacts} isLoading={overviewLoading} />
  );
}

export function AdminApplicationsRoute() {
  const { applications, overviewLoading } =
    useOutletContext<AdminOutletContext>();
  return (
    <ApplicationsAdminTab
      applications={applications}
      isLoading={overviewLoading}
    />
  );
}

export function AdminTestimonialsRoute() {
  const { models } = useOutletContext<AdminOutletContext>();
  return <TestimonialsAdminTab models={models} />;
}
