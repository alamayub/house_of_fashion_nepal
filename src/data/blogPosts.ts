import type { BlogCategory, BlogPost } from '../types/index.ts';
import { AGENCY_ASSETS } from './assets.ts';

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'Fashion & Styling',
  'Skincare & Beauty',
  'Daily Routine',
  'Runway & Posing',
  'Fitness & Nutrition',
  'Casting & Career',
  'On-Set & Travel',
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    slug: 'wardrobe-architecture-go-sees-editorial-fittings',
    title: 'Wardrobe Architecture for Go-Sees, Castings & Editorial Fittings',
    subtitle:
      'How monochrome proportion, fabric awareness, and quiet personal styling let casting directors envision you inside any fashion house collection.',
    category: 'Fashion & Styling',
    excerpt:
      'From fitted monochrome silhouettes to handling hand-loomed Dhaka and cashmere samples backstage, learn how professional models dress for castings and editorial fittings across Nepal and abroad.',
    coverImage: AGENCY_ASSETS.HERO_ATELIER,
    coverAlt:
      'Editorial couture silhouette inside a daylight atelier studio in Nepal',
    authorName: 'Kiran Shrestha',
    authorRole: 'Managing Director, House of Fashion Nepal',
    publishedAt: '2026-10-18',
    updatedAt: '2026-11-12',
    readTimeMinutes: 6,
    featured: true,
    tags: [
      'go-see wardrobe',
      'fashion styling',
      'casting outfit',
      'editorial fitting',
      'Nepal fashion',
    ],
    keyTakeaways: [
      'Dress as a clean architectural canvas: fitted neutral basics allow clients to read your proportions immediately.',
      'Avoid oversized graphic logos, heavy layering, or distracting statement jewelry at first-round castings.',
      'Always bring seamless neutral undergarments and clean, scuff-free footwear suited to your board.',
      'Handle designer samples — especially hand-loomed silk, felt, and Chyangra cashmere — with makeup-free collar discipline.',
    ],
    sections: [
      {
        id: 'blank-canvas-rule',
        heading: '01. The Blank Canvas Principle at Castings',
        paragraphs: [
          'A go-see is not a street-style showcase — it is a working architectural consultation. When a creative director or stylist meets twenty models in two hours, they are mentally projecting silhouettes, drape, and campaign moods onto your frame. Heavy prints, bulky jackets, and excessive accessories make that visualization harder.',
          'The most dependable casting uniform across Kathmandu, Mumbai, Milan, and Paris remains timeless: well-fitted monochrome denim or tailored straight trousers paired with a clean matte singlet, ribbed tank, or crew-neck tee in black, bone, or slate. Your posture and facial geometry should enter the room before your outfit does.',
        ],
        checklist: [
          'Fitted crew-neck tee or tank in matte black, charcoal, or off-white (no sheen or slogans).',
          'Clean-cut straight denim or tailored trousers that sit cleanly at the ankle without pooling.',
          'Minimal outerwear — a structured trench or wool coat that slips off in two seconds.',
          'Zero noisy bangles, heavy necklaces, or chipped nail polish that distract during close-up tests.',
        ],
      },
      {
        id: 'footwear-proportion',
        heading: '02. Footwear Discipline Across Boards',
        paragraphs: [
          'Your footwear dictates both your stride cadence and spinal alignment. Fashion and runway board models should carry a classic pair of clean heels (8–10 cm, closed or minimal strap) inside their tote alongside comfortable transit flats — never arrive exhausted from commuting across uneven city pavements in runway heels.',
          'For menswear, commercial, and alpine lifestyle castings, crisp minimal leather sneakers, Chelsea boots, or structured derbies keep the ankle line sharp. Always wipe soles clean before stepping onto a studio cyclorama wall.',
        ],
        studioNote:
          'Tip from House of Fashion Nepal Bookers: Tape a strip of painter’s tape to the sole of dark dress shoes before stepping onto a freshly painted white studio cove so you never leave scuff marks.',
      },
      {
        id: 'atelier-textile-care',
        heading: '03. Respecting Couture & Hand-Loomed Samples',
        paragraphs: [
          'Working closely with Nepal’s independent textile ateliers means stepping into one-of-one hand-woven Dhaka, wild allo nettle, and undyed Himalayan cashmere pieces that cannot simply be replaced overnight. Arrive at every fitting with clean, dry skin and no heavy body oil or self-tanner that can stain pale raw silk.',
          'When pulling a knit or silk blouse over your head after hair and makeup, ask the wardrobe assistant for a silk scarf or garment hood — never stretch collars or force tight zippers without assistance.',
        ],
      },
    ],
  },
  {
    id: 'post-02',
    slug: 'models-skin-barrier-protocol-nepal',
    title: 'The Model’s Skin Barrier Protocol: High-Altitude UV, Studio Lights & Shoot Prep',
    subtitle:
      'Protecting luminous, camera-ready skin across Nepal’s dry Himalayan air, urban dust, humid Terai locations, and back-to-back commercial makeup calls.',
    category: 'Skincare & Beauty',
    excerpt:
      'Great editorial and beauty photography starts 72 hours before call time. Discover a dermatologist-aligned routine for barrier repair, sun protection, and gentle makeup removal between sets.',
    coverImage: AGENCY_ASSETS.BLOG_SKINCARE,
    coverAlt:
      'Minimalist botanical skincare dropper, ceramic bowl, and raw linen cloth on pale travertine stone',
    authorName: 'Sanjana Thapa',
    authorRole: 'Commercial & Beauty Principal Model',
    publishedAt: '2026-10-24',
    updatedAt: '2026-11-14',
    readTimeMinutes: 7,
    featured: true,
    tags: [
      'model skincare',
      'skin barrier',
      'beauty shoot prep',
      'SPF Nepal',
      'post-shoot cleansing',
    ],
    keyTakeaways: [
      'Follow the 72-hour rule: never introduce new acids, retinoids, facials, or waxing within three days of a booking.',
      'UV intensity increases sharply across mid-hill valleys and Himalayan regions — broad-spectrum SPF 50+ is non-negotiable year-round.',
      'Double cleansing immediately after wrap prevents clogged pores from long-wear HD studio foundation and waterproof primers.',
      'Arrive on set with clean, hydrated, makeup-free skin and hydrated lips so the makeup artist can prep to brief.',
    ],
    sections: [
      {
        id: '72-hour-rule',
        heading: '01. The 72-Hour Pre-Shoot Skin Rule',
        paragraphs: [
          'The single most common mistake emerging models make before a major beauty or lookbook booking is panic-treating their skin the night before — trying a harsh exfoliating peel, squeezing a blemish, or booking an unfamiliar extraction facial. High-resolution 50-megapixel cameras pick up redness and flaking far more aggressively than a single calm blemish that a makeup artist can effortlessly veil.',
          'Starting three days before any shoot, strip your routine back to four calming pillars: gentle non-foaming cleanser, humectant hydration (hyaluronic acid or glycerin on damp skin), ceramide-rich barrier moisturizer, and zero-white-cast broad-spectrum SPF.',
        ],
        checklist: [
          'Pause strong AHAs, BHAs, benzoyl peroxide, and retinoids 72 hours prior to close-up beauty calls.',
          'Swap pillowcases to clean cotton or mulberry silk two nights before shoot day.',
          'Apply a thick occlusive lip balm the evening prior so matte editorial lipsticks sit smoothly.',
          'Never shave or wax facial hair the morning of a shoot — complete grooming at least 48 hours ahead.',
        ],
      },
      {
        id: 'climate-adaptation',
        heading: '02. Adapting to Nepal’s Micro-Climates',
        paragraphs: [
          'Working across Nepal means your skin experiences dramatic environmental shifts in a single week: dry, dusty afternoon air in Kathmandu Valley, intense high-altitude UV in Mustang or Nagarkot, and warm humidity in Chitwan or Biratnagar. One rigid heavy cream will rarely work across all three.',
          'In dry or alpine shoots, layer a light hydrating mist beneath a squalane or ceramide cream and reapply lip SPF between takes. In humid Terai locations, rely on lightweight gel-creams, blotting papers rather than powder piling, and antioxidant vitamin C under sunscreen.',
        ],
      },
      {
        id: 'post-wrap-recovery',
        heading: '03. Post-Wrap Double Cleanse & Barrier Reset',
        paragraphs: [
          'Studio foundations, lash adhesives, and waterproof setting sprays are engineered to survive ten hours under hot LED panels. A quick splash of micellar water is never enough. The moment you return from wrap, massage an oil or balm cleanser over dry skin for 60 full seconds to dissolve pigments and silicones, rinse thoroughly with lukewarm water, and follow with a mild pH-balanced gel or milk cleanser.',
          'Skip active exfoliants on shoot nights — seal clean damp skin with a soothing panthenol or centella moisturizer and let eight hours of uninterrupted sleep restore micro-circulation.',
        ],
        studioNote:
          'Call-sheet standard: Arrive on set with bare, clean, lightly moisturized skin — never pre-apply concealer, mascara, or tinted sunscreen unless explicitly requested by production.',
      },
    ],
  },
  {
    id: 'post-03',
    slug: 'working-models-24-hour-daily-routine',
    title: 'A Working Model’s 24-Hour Routine: Sleep, Hydration & Call-Sheet Discipline',
    subtitle:
      'Sustainable daily habits that keep your energy sharp, face rested, and nervous system grounded from 5:30 AM call times to late-evening wraps.',
    category: 'Daily Routine',
    excerpt:
      'Consistency beats extreme last-minute routines. Explore a realistic 24-hour rhythm covering morning hydration, posture mobility, shoot-day nutrition, and restorative evening habits.',
    coverImage: AGENCY_ASSETS.BLOG_DAILY_ROUTINE,
    coverAlt:
      'Sunlit morning table with ceramic herbal tea mug and open linen journal in a quiet Nepalese studio',
    authorName: 'Aanya Shrestha',
    authorRole: 'Principal Editorial & Runway Model',
    publishedAt: '2026-10-30',
    updatedAt: '2026-11-15',
    readTimeMinutes: 6,
    featured: true,
    tags: [
      'daily routine',
      'model morning routine',
      'sleep recovery',
      'hydration',
      'wellness',
    ],
    keyTakeaways: [
      'Hydrate with water and electrolytes within 15 minutes of waking to reduce morning facial puffiness naturally.',
      'Ten minutes of thoracic spine and hip-flexor mobility preserves tall, relaxed posture through 8-hour standing shoots.',
      'Pack your model bag and confirm call-sheet logistics the night before to eliminate morning cortisol spikes.',
      'Protect a consistent 7.5–8.5 hour sleep window — dark circles and dull skin cannot be out-trained.',
    ],
    sections: [
      {
        id: 'morning-reset',
        heading: '01. The First 45 Minutes: De-Puff, Hydrate & Align',
        paragraphs: [
          'Morning editorial shoots frequently begin at 6:00 AM to catch soft Himalayan sunrise light. Jumping out of bed ten minutes before your ride guarantees facial puffiness, rushed posture, and avoidable stress. Aim to wake at least 60–75 minutes before departure.',
          'Start with 400–500 ml of room-temperature water (add a pinch of sea salt or lemon if you trained the evening before), rinse your face with cool water, and spend three quiet minutes on gentle downward lymphatic drainage along the jawline and neck before applying moisturizer and SPF.',
        ],
        checklist: [
          '06:00 — Warm or room-temperature hydration before coffee or chiya.',
          '06:15 — 10-minute posture flow: cat-cow, thoracic rotations, calf stretches, and shoulder openers.',
          '06:30 — Balanced low-bloat breakfast: eggs or tofu, greens, oats, or fruit with nuts.',
          '06:45 — Final call-sheet check: address pin, producer phone number, and wardrobe notes.',
        ],
      },
      {
        id: 'midday-energy',
        heading: '02. Midday Stamina on Non-Shoot & Shoot Days',
        paragraphs: [
          'Modeling alternates between quiet development days and physically demanding 8-to-10-hour production days. On non-shoot days, treat your calendar like an independent creative business: update your measurement log monthly, reply promptly to bookers, attend go-sees, and protect dedicated time for strength training or creative study.',
          'On active shoot days, avoid heavy sugary crashes that leave you sluggish after lunch. Sip water steadily between setups and use 10-minute lighting resets to drop your shoulders, unclench your jaw, and shake out your ankles.',
        ],
      },
      {
        id: 'evening-wind-down',
        heading: '03. Evening Prep & Restorative Sleep',
        paragraphs: [
          'Your face reflects your nervous system. Ninety minutes before sleep, dim bright overhead screens, pack your shoot bag completely (undergarments, shoes, hydration bottle, power bank, snacks), and lay out tomorrow’s casting outfit. Removing micro-decisions from your morning keeps your expression composed and luminous in front of the lens.',
        ],
        studioNote:
          'Avoid excessive sodium or late-night salty snacks the evening before a beauty or jewelry close-up — sodium retention shows most visibly around the under-eye contour at 7 AM.',
      },
    ],
  },
  {
    id: 'post-04',
    slug: 'editorial-posing-runway-cadence-mastery',
    title: 'Mastering Editorial Angles, Posture & Runway Cadence Under Camera Pressure',
    subtitle:
      'How to translate garment architecture into effortless movement — building fluid micro-poses, calm eye-line control, and an unhurried catwalk presence.',
    category: 'Runway & Posing',
    excerpt:
      'Great posing feels like quiet choreography rather than rigid shapes. Learn weight distribution, hand placement, runway pacing, and how to read studio lighting while moving.',
    coverImage: AGENCY_ASSETS.BLOG_RUNWAY_POSING,
    coverAlt:
      'Fashion model practicing tailored runway walk under skylight shadows in a minimalist studio',
    authorName: 'Aarav Gurung',
    authorRole: 'Menswear & Runway Principal Model',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-15',
    readTimeMinutes: 7,
    featured: false,
    tags: [
      'runway walk',
      'editorial posing',
      'camera angles',
      'posture',
      'fashion photography',
    ],
    keyTakeaways: [
      'Shift your center of gravity continuously — micro-adjustments of the chin, shoulder, and hip yield ten strong frames from one stance.',
      'Always read the garment first: structured tailoring calls for clean geometric lines, while bias-cut silk comes alive with slow turns.',
      'On the runway, lead from the core rather than the chin, keep arms swinging naturally from the shoulders, and hold the end-pose for a clear two-beat count.',
      'Relax your fingers and jaw — tension always appears first in clenched hands and stiff lips.',
    ],
    sections: [
      {
        id: 'garment-first-posing',
        heading: '01. Read the Garment Before You Strike a Pose',
        paragraphs: [
          'The fastest way to elevate your editorial work is to stop posing for yourself and start posing for the garment. Before the first test frame, look at the construction in the mirror: Where is the seam line? Does the coat have an architectural shoulder? Does the hand-loomed skirt flare when you pivot? Your job is to show the designer’s craft in its clearest form.',
          'Rather than jumping dramatically between unrelated shapes every second, think in fluid chains. Shift your weight from your back heel to your front toe, rotate your collarbone fifteen degrees toward the key light, soften one elbow, and let the photographer capture the transition itself.',
        ],
        checklist: [
          'Elongate the neck subtly by extending the crown of the head upward — never tilt the chin too high.',
          'Keep space between your arms and torso so waist tailoring and silhouettes stay defined.',
          'Turn hands slightly edge-on toward the lens instead of showing flat palms or rigid fists.',
          'Breathe out gently before eye-contact frames to release tension around the eyes and mouth.',
        ],
      },
      {
        id: 'runway-cadence',
        heading: '02. Runway Cadence & End-of-Catwalk Presence',
        paragraphs: [
          'A commanding runway walk is defined by rhythm, restraint, and spatial awareness. Practice walking in a straight line with one foot landing cleanly ahead of the other — not an exaggerated hip sway — while keeping your gaze fixed on a steady focal point at camera height at the far end of the runway.',
          'At the photographic pit, pause cleanly for two full seconds (a silent "one-thousand, two-thousand") so seated press and pit photographers lock sharp focus before you pivot smoothly off your front foot and return at the same unhurried pace.',
        ],
      },
      {
        id: 'practicing-without-stiffness',
        heading: '03. Rehearsing Effectively at Home',
        paragraphs: [
          'Film yourself walking and posing for three minutes a week on a smartphone propped at chest height — not just in a mirror. Mirrors distort how angles translate through a 50mm or 85mm lens. Study which shoulder angle catches window light cleanly, practice commercial warmth alongside editorial stillness, and save reference tearsheets from international fashion houses.',
        ],
      },
    ],
  },
  {
    id: 'post-05',
    slug: 'functional-strength-nutrition-longevity-models',
    title: 'Functional Strength & Balanced Nutrition for Multi-Day Campaigns',
    subtitle:
      'Building postural endurance, joint resilience, and steady energy for long studio hours and high-altitude Nepal shoots — without crash dieting or burnout.',
    category: 'Fitness & Nutrition',
    excerpt:
      'True modeling longevity comes from strength, mobility, and sustainable nourishment. Learn how working talent train for posture, core stability, and multi-day campaign stamina.',
    coverImage: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
    coverAlt:
      'Editorial menswear model demonstrating poised posture during a studio campaign',
    authorName: 'Rohan Magar',
    authorRole: 'Fitness & Commercial Talent, House of Fashion Nepal Roster',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-16',
    readTimeMinutes: 6,
    featured: false,
    tags: [
      'model fitness',
      'nutrition',
      'posture training',
      'Pilates',
      'stamina',
    ],
    keyTakeaways: [
      'Prioritize postural strength — upper back, glutes, deep core, and ankles — over exhausting high-cortisol workouts.',
      'Never crash-diet before a booking: dehydration and caloric restriction dull skin, flatten hair, and sap on-set focus.',
      'Fuel multi-day shoots with balanced protein, complex carbohydrates, iron-rich greens, and steady electrolytes.',
      'Schedule active recovery (walking, stretching, Pilates) the day before a major campaign to avoid sore, stiff movement.',
    ],
    sections: [
      {
        id: 'training-for-posture',
        heading: '01. Training for Posture, Alignment & Endurance',
        paragraphs: [
          'Standing under studio lights for eight hours — or hiking to an alpine ridge in Pokhara or Mustang wearing heavy winter coats — demands real athletic endurance. A smart weekly routine balances 2–3 sessions of functional resistance or Pilates with low-impact cardio (brisk walking, swimming, cycling) and daily mobility.',
          'Focus on muscles that support graceful posture: lower traps and rhomboids (so shoulders sit open and relaxed), deep transverse abdominis (protecting the lower back during arched editorial poses), and ankle stability for long runway rehearsals.',
        ],
        checklist: [
          '2× weekly core, glute, and upper-back conditioning (Pilates, resistance bands, or controlled weights).',
          '2× weekly low-stress Zone 2 cardio for circulation, stamina, and luminous skin tone.',
          'Daily 5-minute hip-flexor and hamstring release to counteract sitting and travel.',
          'Avoid heavy leg workouts or unfamiliar high-intensity classes 24 hours before full-day shoots.',
        ],
      },
      {
        id: 'sustainable-nourishment',
        heading: '02. Nourishing Without Restrictive Extremes',
        paragraphs: [
          'At House of Fashion Nepal, we actively discourage unhealthy restriction. A model who skips meals loses alertness, micro-expression nuance, and skin radiance by hour three on set. Traditional Nepalese whole foods offer an exceptional foundation when balanced thoughtfully: lentils (dal) and seasonal saag for iron and plant protein, eggs or grilled poultry/paneer, millet (kodo) or buckwheat (phapar), and fresh seasonal fruit.',
          'Keep steady blood sugar during long travel or fitting days by carrying simple whole snacks — roasted almonds, fruit, yogurt, or seed bars — so you are never forced into skipping meals.',
        ],
        studioNote:
          'House of Fashion Nepal Ethics Pledge: Measurements should reflect your healthy, sustainable natural frame. Never alter your health to chase an unsustainable sample size — speak openly with your booker about board fit.',
      },
    ],
  },
  {
    id: 'post-06',
    slug: 'polaroid-digitals-comp-cards-usage-rights',
    title: 'Digitals, Comp Cards & Navigating Modeling Contracts Ethically in Nepal',
    subtitle:
      'Everything aspiring and working models need to know about natural-light snapshots, honest measurements, usage licensing, and spotting scouting scams.',
    category: 'Casting & Career',
    excerpt:
      'From shooting clean window-light digitals at home to understanding day fees versus commercial buyout rights, master the business fundamentals of a safe modeling career.',
    coverImage: AGENCY_ASSETS.AGENCY_STUDIO,
    coverAlt:
      'Minimalist daylight casting studio space at House of Fashion Nepal',
    authorName: 'Anjali Gurung',
    authorRole: 'Head of Scouting & New Faces',
    publishedAt: '2026-11-08',
    updatedAt: '2026-11-16',
    readTimeMinutes: 8,
    featured: false,
    tags: [
      'model digitals',
      'Polaroids',
      'modeling contracts Nepal',
      'usage rights',
      'scouting safety',
    ],
    keyTakeaways: [
      'Reputable agencies never charge upfront fees to apply, attend an interview, or sign representation.',
      'Update natural-light digitals every 3–4 months — or immediately after any haircut, color change, or measurement shift.',
      'Always distinguish between your shoot-day fee and commercial usage rights (billboards, TVC, digital ads, duration, territory).',
      'Treat casting rejection neutrally: 90% of casting decisions come down to garment size, height pairing, or client brief specificity.',
    ],
    sections: [
      {
        id: 'clean-digitals-checklist',
        heading: '01. How to Shoot Agency-Grade Digitals at Home',
        paragraphs: [
          'You do not need an expensive studio portfolio to get signed. In fact, casting directors across Nepal and international fashion weeks strongly prefer unretouched smartphone digitals taken in soft natural window light. Digitals show how you look right now — hair texture, skin tone, posture, and proportion.',
          'Stand two meters facing a bright window (never with the window behind you) in front of a plain light-colored wall. Ask a friend to shoot at chest level with zero beauty filters, portrait blur, or dramatic shadows.',
        ],
        checklist: [
          '1. Clean front-facing headshot (relaxed neutral expression, hair neatly away from face).',
          '2. Natural smiling headshot (warm, authentic commercial expression).',
          '3. Left and right 90-degree side profiles.',
          '4. Full-length head-to-toe shot in fitted monochrome basics (front and three-quarter angle).',
        ],
      },
      {
        id: 'contracts-and-usage',
        heading: '02. Understanding Day Rates vs. Usage Rights',
        paragraphs: [
          'One of the most empowering career milestones for a model is learning how commercial licensing works. Your shoot-day fee pays for your time and craft on set (typically up to 8 hours). Usage rights pay for where, how, and how long the client publishes your likeness — such as social media ads, city billboards, retail packaging, or broadcast TV commercials.',
          'Before stepping onto any commercial set, confirm four written terms through your agency: working hours & overtime rate, exact media channels, territory (Nepal, South Asia, or worldwide), and licensing duration (e.g., 6 months or 12 months).',
        ],
      },
      {
        id: 'scouting-safety',
        heading: '03. Red Flags & Protecting Your Career Integrity',
        paragraphs: [
          'Protect yourself from predatory casting messages. Legitimate agencies operate from verifiable studio addresses, communicate via official domain emails, never demand cash for mandatory portfolio shoots before signing, and welcome a trusted companion or written contract review period before you commit.',
          'Equally vital is emotional resilience: modeling involves frequent "not this brief" responses. Separate a casting decision from your personal worth, show up consistently, and keep investing in your craft and education outside the industry.',
        ],
      },
    ],
  },
  {
    id: 'post-07',
    slug: 'shoot-day-model-kit-set-etiquette',
    title: 'The Essential Model Bag & On-Set Etiquette for Studio and Location Calls',
    subtitle:
      'What seasoned professionals pack for every commercial, studio, and outdoor Nepal booking — plus the subtle set habits that earn repeat client requests.',
    category: 'On-Set & Travel',
    excerpt:
      'Being well-prepared and calm on set turns a first booking into a multi-season client relationship. Here is the complete 14-item shoot-day kit and call-sheet etiquette guide.',
    coverImage: AGENCY_ASSETS.BLOG_MODEL_KIT,
    coverAlt:
      'Organized flat-lay of a fashion model shoot-day leather tote, sunglasses, hydration bottle, wooden brush, and neutral knitwear on raw linen',
    authorName: 'Siddhartha Malla',
    authorRole: 'Senior Booking Director',
    publishedAt: '2026-11-11',
    updatedAt: '2026-11-17',
    readTimeMinutes: 5,
    featured: false,
    tags: [
      'model bag checklist',
      'shoot day kit',
      'set etiquette',
      'location shoots Nepal',
      'call sheet',
    ],
    keyTakeaways: [
      'Arrive 10–15 minutes early — on set, "on time" means already checked in and ready for hair and makeup.',
      'Pack skin-tone seamless undergarments, clear deodorant, lip balm, hairbrush, and a button-down shirt to protect styling.',
      'For outdoor shoots in Pokhara, Nagarkot, or Mustang, pack thermal base layers, warm socks, and a windproof outer layer between takes.',
      'Keep phones silent in your bag during active frames and never post unreleased client garments before campaign launch.',
    ],
    sections: [
      {
        id: 'essential-model-bag',
        heading: '01. The 14-Item Model Shoot-Day Kit',
        paragraphs: [
          'A thoughtful, compact tote saves wardrobe teams and producers countless minutes. Keep a dedicated inner pouch permanently packed so you can grab it for last-minute bookings without forgetting essentials.',
        ],
        checklist: [
          'Seamless skin-tone undergarments (strapless bra/briefs or compression shorts matching your skin tone).',
          'Loose button-down shirt or zip hoodie so you can change without disturbing hair and makeup.',
          'Neutral closed-toe heels or clean minimal sneakers (per call sheet) plus neutral socks.',
          'Clear fragrance-free deodorant, hydrating lip balm, facial mist, and blotting sheets.',
          'Wide-tooth wooden comb, snag-free hair ties, and bobby pins matching your hair color.',
          'Refillable insulated water bottle, compact high-protein snacks, and portable power bank.',
          'For mountain or winter shoots across Nepal: thermal innerwear, hand warmers, and slip-on warm boots for between takes.',
        ],
      },
      {
        id: 'set-etiquette',
        heading: '02. Set Habits That Earn Repeat Bookings',
        paragraphs: [
          'Clients remember how smoothly a shoot felt just as vividly as how the final images look. Greet the entire crew — lighting assistants, stylists, hair/makeup artists, and runners — with warmth and respect. Stay attentive during wardrobe changes so production stays ahead of daylight schedules.',
          'Crucially, treat every unreleased collection as strictly confidential. Never film behind-the-scenes clips of upcoming garments, celebrity co-talent, or moodboards without explicit written clearance from the client or producer.',
        ],
        studioNote:
          'If anything on set feels unsafe, overly cold, or outside your agreed wardrobe/hours brief, step aside calmly and call your House of Fashion Nepal booker immediately — we are on call throughout every booking.',
      },
    ],
  },
  {
    id: 'post-08',
    slug: 'hair-health-backstage-heat-monsoon-care',
    title: 'Protecting Hair & Nail Health Between Backstage Heat Styling & Monsoon Humidity',
    subtitle:
      'Practical care strategies for keeping hair glossy, scalp calm, and nails clean-cut through frequent curling irons, sleek buns, and seasonal climate shifts.',
    category: 'Skincare & Beauty',
    excerpt:
      'Backstage styling puts serious stress on strands and cuticles. Learn how models prep hair before call time, prevent heat breakage, and recover swiftly after runway week.',
    coverImage: AGENCY_ASSETS.MODEL_NIYAMA,
    coverAlt:
      'Close-up editorial portrait highlighting luminous natural skin and sleek healthy hair',
    authorName: 'Niyama Shakya',
    authorRole: 'Editorial & Campaign Model',
    publishedAt: '2026-11-15',
    updatedAt: '2026-11-18',
    readTimeMinutes: 5,
    featured: false,
    tags: [
      'hair care for models',
      'backstage beauty',
      'heat protection',
      'monsoon hair care',
      'nail grooming',
    ],
    keyTakeaways: [
      'Unless briefed otherwise, arrive on set with freshly washed, completely dry, product-free hair.',
      'Clarify product build-up gently after runway shows using a sulfate-free detox shampoo followed by a lipid-rich mask.',
      'Keep nails neatly shaped, clean, and bare (or sheer clear coat) for castings and beauty/jewelry bookings.',
      'Never dramatically cut, bleach, or dye your hair without consulting your booking director first.',
    ],
    sections: [
      {
        id: 'pre-set-hair-prep',
        heading: '01. Arriving Ready for the Hair Chair',
        paragraphs: [
          'Unless your call sheet specifies "day-two texture," wash your hair the evening before or morning of the shoot and arrive completely dry with zero heavy oils, leave-in waxes, or dry shampoo. Heavy home oils resist curling irons and force stylists to use hotter tool temperatures to hold a shape.',
          'Always consult your agent before making major changes to hair length, bangs, or color — clients book you based on the look represented in your current portfolio and digitals.',
        ],
      },
      {
        id: 'post-show-recovery',
        heading: '02. Recovery After Runway & Monsoon Humidity',
        paragraphs: [
          'After high-tension sleek buns, teasing, or multiple heat passes, detangle gently from ends upward in the shower while coated in conditioner — never rip a fine-tooth comb through dry hairsprayed roots. Once every two weeks, use a gentle clarifying wash to remove urban dust and silicone build-up, followed by a nourishing mask.',
          'During Nepal’s humid monsoon months, sleep on a smooth satin or silk pillowcase and blot wet hair with a cotton T-shirt or microfiber towel rather than rough terrycloth to keep cuticles smooth and frizz-free.',
        ],
        checklist: [
          'Use a thermal protectant mist whenever styling hair personally between bookings.',
          'Massage warm lightweight oil into mid-lengths and ends on off-days — rinse cleanly before shoot weeks.',
          'Trim split ends every 8–10 weeks to maintain crisp silhouettes in backlit studio shots.',
          'Keep fingernails and toenails neatly buffed, hydrated with cuticle oil, and free of bright polish.',
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== currentPost.slug && p.category === currentPost.category,
  );
  const others = BLOG_POSTS.filter(
    (p) => p.slug !== currentPost.slug && p.category !== currentPost.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatBlogDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
