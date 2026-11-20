import { ArrowLeft, Compass, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';

export default function NotFound() {
  return (
    <PageTransition>
      <SeoHead
        title="Page Not Found"
        description="The requested page could not be located on House of Fashion Nepal."
        noIndex
      />
      <section className="min-h-[82vh] flex flex-col items-center justify-center px-6 pt-28 pb-20 text-center bg-[#F5F1EA] text-[#101010]">
        <Reveal className="flex flex-col items-center">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-[#632B37] mb-4">
            <Compass className="w-4 h-4" />
            <span>Error 404</span>
          </p>
          <h1 className="font-serif text-5xl sm:text-7xl leading-none mb-5">
            Out of Frame
          </h1>
          <p className="text-base text-[#101010]/70 max-w-md mb-10 leading-relaxed">
            The editorial page or portfolio entry you are seeking is no longer available at this address.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:bg-[#632B37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/models"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#101010]/25 text-xs uppercase tracking-[0.18em] hover:border-[#101010] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Browse Models</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
