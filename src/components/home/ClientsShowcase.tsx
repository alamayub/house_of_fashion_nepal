import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetClientsQuery } from '../../features/projects/projectsApi.ts';

export function ClientsShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { data: clients = [] } = useGetClientsQuery();
  const featuredClients = clients.filter((c) => c.featured).slice(0, 6);

  return (
    <section className="bg-[#101010] text-[#FAF8F4] py-20 md:py-28 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Selected Client Roster
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.03]">
              Trusted by Heritage Houses &amp; Contemporary Brands
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF8F4] hover:text-[#B6A48D] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Explore Clients &amp; Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
          {featuredClients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : idx * 0.04 }}
              className="border-r border-b border-white/10"
            >
              <Link
                to={`/projects?client=${encodeURIComponent(client.id)}`}
                className="group h-full p-6 sm:p-8 flex flex-col justify-between gap-6 hover:bg-white/[0.04] transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-[#B6A48D]">
                    <span>{client.industry}</span>
                    <span className="font-mono tabular-nums shrink-0">Est. {client.yearSince}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F4] group-hover:text-[#B6A48D] transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-[#FAF8F4]/55">{client.location}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-[#FAF8F4]/70 leading-relaxed">
                    {client.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#B6A48D] group-hover:text-[#FAF8F4] transition-colors">
                    <span>View Commissions</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
