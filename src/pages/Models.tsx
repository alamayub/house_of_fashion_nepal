import { Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { ModelFilters } from '../components/models/ModelFilters.tsx';
import { ModelGrid } from '../components/models/ModelGrid.tsx';
import { useGetModelsQuery } from '../features/models/modelsApi.ts';
import { setFilterField, setSearch } from '../features/models/modelsSlice.ts';

export default function Models() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.modelsFilter);
  const hadUrlParamsRef = useRef(false);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const genderParam = searchParams.get('gender');
    const locationParam = searchParams.get('location');
    const availabilityParam = searchParams.get('availability');

    const hasAnyUrlFilter = Boolean(
      searchParam || categoryParam || genderParam || locationParam || availabilityParam,
    );

    if (hasAnyUrlFilter) {
      hadUrlParamsRef.current = true;
      dispatch(setSearch(searchParam ?? ''));
      dispatch(setFilterField({ key: 'category', value: categoryParam || 'All' }));
      dispatch(setFilterField({ key: 'gender', value: genderParam || 'All' }));
      dispatch(setFilterField({ key: 'location', value: locationParam || 'All' }));
      dispatch(
        setFilterField({ key: 'availability', value: availabilityParam || 'All' }),
      );
    } else if (hadUrlParamsRef.current) {
      hadUrlParamsRef.current = false;
      dispatch(setSearch(''));
      dispatch(setFilterField({ key: 'category', value: 'All' }));
      dispatch(setFilterField({ key: 'gender', value: 'All' }));
      dispatch(setFilterField({ key: 'location', value: 'All' }));
      dispatch(setFilterField({ key: 'availability', value: 'All' }));
    }
  }, [searchParams, dispatch]);

  const { data, isLoading, isFetching, isError, refetch } = useGetModelsQuery({
    search: filters.search || undefined,
    gender: filters.gender !== 'All' ? filters.gender : undefined,
    category: filters.category !== 'All' ? filters.category : undefined,
    heightMin: filters.heightMin,
    heightMax: filters.heightMax,
    ageGroup: filters.ageGroup !== 'All' ? filters.ageGroup : undefined,
    bodyType: filters.bodyType !== 'All' ? filters.bodyType : undefined,
    experienceLevel:
      filters.experienceLevel !== 'All' ? filters.experienceLevel : undefined,
    availability:
      filters.availability !== 'All' ? filters.availability : undefined,
    location: filters.location !== 'All' ? filters.location : undefined,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  });

  return (
    <PageTransition>
      <SeoHead
        title={
          filters.category && filters.category !== 'All'
            ? `${filters.category} — Talent Directory`
            : 'Our Models — Talent Directory'
        }
        description={
          filters.category && filters.category !== 'All'
            ? `Explore House of Fashion Nepal's ${filters.category.toLowerCase()} roster across Nepal. Inspect portfolios, measurements, and booking availability.`
            : "Browse House of Fashion Nepal's editorial, runway, commercial, and new face models represented across all of Nepal."
        }
        canonicalPath="/models"
        models={data?.data}
        image={data?.data?.[0]?.coverImage}
      />

      <div className="pt-24 sm:pt-28 md:pt-36 pb-32 md:pb-28 bg-[#F5F1EA] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <Reveal>
            <header className="space-y-3 border-b border-[#101010]/10 pb-10">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37]">
                <Users className="w-3.5 h-3.5" />
                <span>Nepal Roster · Representation Boards</span>
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] uppercase">
                Our Models
              </h1>
              <p className="text-base sm:text-lg text-[#101010]/70 max-w-2xl">
                Meet the talent shaping the future of fashion across Nepal and beyond.
              </p>
            </header>
          </Reveal>

          <ModelFilters
            availableFilters={data?.availableFilters}
            totalCount={data?.total ?? 0}
          />

          <ModelGrid
            models={data?.data ?? []}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onRetry={refetch}
          />
        </div>
      </div>
    </PageTransition>
  );
}
