import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  AdminApplicationsRoute,
  AdminBookingsRoute,
  AdminClientsRoute,
  AdminEnquiriesRoute,
  AdminEventsRoute,
  AdminModelsRoute,
  AdminOverviewRoute,
  AdminProjectsRoute,
  AdminTestimonialsRoute,
} from '../components/admin/AdminRouteViews.tsx';
import { RequireAdminAuth } from '../components/admin/RequireAdminAuth.tsx';
import { Loader } from '../components/common/Loader.tsx';
import { MainLayout } from '../layouts/MainLayout.tsx';

const Home = lazy(() => import('../pages/Home.tsx'));
const Models = lazy(() => import('../pages/Models.tsx'));
const ModelProfile = lazy(() => import('../pages/ModelProfile.tsx'));
const About = lazy(() => import('../pages/About.tsx'));
const Services = lazy(() => import('../pages/Services.tsx'));
const Projects = lazy(() => import('../pages/Projects.tsx'));
const Events = lazy(() => import('../pages/Events.tsx'));
const BecomeAModel = lazy(() => import('../pages/BecomeAModel.tsx'));
const BookModel = lazy(() => import('../pages/BookModel.tsx'));
const Blog = lazy(() => import('../pages/Blog.tsx'));
const BlogPost = lazy(() => import('../pages/BlogPost.tsx'));
const Contact = lazy(() => import('../pages/Contact.tsx'));
const Admin = lazy(() => import('../pages/Admin.tsx'));
const AdminLogin = lazy(() => import('../pages/AdminLogin.tsx'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy.tsx'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions.tsx'));
const NotFound = lazy(() => import('../pages/NotFound.tsx'));

export function AppRoutes() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const shellKey = location.pathname.startsWith('/admin')
    ? 'admin-shell'
    : 'public-shell';

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={shellKey}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F5F1EA]">
              <Loader label="Preparing House of Fashion Nepal" />
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<RequireAdminAuth />}>
              <Route path="/admin" element={<Admin />}>
                <Route index element={<AdminOverviewRoute />} />
                <Route path="models" element={<AdminModelsRoute />} />
                <Route path="clients" element={<AdminClientsRoute />} />
                <Route path="projects" element={<AdminProjectsRoute />} />
                <Route path="events" element={<AdminEventsRoute />} />
                <Route path="bookings" element={<AdminBookingsRoute />} />
                <Route path="enquiries" element={<AdminEnquiriesRoute />} />
                <Route path="applications" element={<AdminApplicationsRoute />} />
                <Route path="testimonials" element={<AdminTestimonialsRoute />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/:slug" element={<ModelProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/clients" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/auditions" element={<Navigate to="/events?category=Audition%20%26%20Casting" replace />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/journal" element={<Navigate to="/blog" replace />} />
              <Route path="/become-a-model" element={<BecomeAModel />} />
              <Route path="/book" element={<BookModel />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
