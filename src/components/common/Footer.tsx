import {
  Clock,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { openAdminLoginDialog } from '../../features/admin/adminSlice.ts';
import { Reveal } from './MotionPrimitives.tsx';
import { SocialLinks } from './SocialLinks.tsx';

export function Footer() {
  const dispatch = useAppDispatch();
  const isAdminSignedIn = useAppSelector((s) => Boolean(s.admin.authSession));
  return (
    <footer className="bg-[#101010] text-[#FAF8F4] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 md:pb-16 border-b border-white/10">
          <Reveal className="md:col-span-5 space-y-5 min-w-0">
            <Link
              to="/"
              className="inline-block font-serif text-2xl sm:text-[26px] tracking-[0.12em] font-semibold uppercase text-[#FAF8F4]"
            >
              House of Fashion Nepal
            </Link>
            <p className="text-sm text-[#FAF8F4]/70 max-w-sm leading-relaxed">
              An independent editorial fashion and commercial talent agency bridging Nepal’s creative ateliers with international fashion houses.
            </p>
            <div className="pt-2 text-xs text-[#B6A48D] flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p>Jhamsikhel Atelier Wing, Lalitpur 44700</p>
                <p>Kathmandu Valley, Nepal</p>
              </div>
            </div>
            <div className="pt-2">
              <SocialLinks variant="icons" tone="dark" />
            </div>
          </Reveal>

          <Reveal delay={0.06} className="md:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#B6A48D] font-sans">
              Directory
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F4]/80">
              <li>
                <Link to="/models" className="hover:text-[#B6A48D] transition-colors">
                  All Models
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#B6A48D] transition-colors">
                  Events &amp; Auditions
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-[#B6A48D] transition-colors">
                  Book a Model
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#B6A48D] transition-colors">
                  About Agency
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#B6A48D] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#B6A48D] transition-colors">
                  Clients &amp; Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#B6A48D] transition-colors">
                  Journal &amp; Guides
                </Link>
              </li>
              <li>
                <Link to="/become-a-model" className="hover:text-[#B6A48D] transition-colors">
                  Become a Model
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#B6A48D] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-4 space-y-4 min-w-0">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#B6A48D] font-sans">
              Direct Desk
            </h3>
            <div className="space-y-3 text-sm text-[#FAF8F4]/80">
              <p>
                <a
                  href="mailto:bookings@houseoffashionnepal.com.np"
                  className="inline-flex items-start gap-2 hover:text-[#B6A48D] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-[#B6A48D] shrink-0" />
                  <span>bookings@houseoffashionnepal.com.np</span>
                </a>
              </p>
              <p>
                <a
                  href="mailto:scouting@houseoffashionnepal.com.np"
                  className="inline-flex items-start gap-2 hover:text-[#B6A48D] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-[#B6A48D] shrink-0" />
                  <span>scouting@houseoffashionnepal.com.np</span>
                </a>
              </p>
              <p className="inline-flex items-center gap-2 tabular-nums text-[#FAF8F4]/70">
                <Phone className="w-3.5 h-3.5 text-[#B6A48D] shrink-0" />
                <span>+977 1 552 8410</span>
              </p>
              <p className="inline-flex items-center gap-2 text-xs text-[#FAF8F4]/50 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#B6A48D]/70 shrink-0" />
                <span>Sunday–Friday · 10:00–18:00 NPT</span>
              </p>
            </div>
          </Reveal>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FAF8F4]/50">
          <p>&copy; {new Date().getFullYear()} House of Fashion Nepal Pvt. Ltd.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-1.5 hover:text-[#FAF8F4] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              to="/terms-and-conditions"
              className="inline-flex items-center gap-1.5 hover:text-[#FAF8F4] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms &amp; Conditions</span>
            </Link>
            {isAdminSignedIn ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 hover:text-[#FAF8F4] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openAdminLoginDialog('/admin'))}
                className="inline-flex items-center gap-1.5 hover:text-[#FAF8F4] transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
