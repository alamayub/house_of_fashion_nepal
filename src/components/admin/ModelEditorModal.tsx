import { AnimatePresence, motion } from 'motion/react';
import { ImagePlus, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { AGENCY_ASSETS } from '../../data/assets.ts';
import {
  useCreateModelMutation,
  useUpdateModelMutation,
} from '../../features/models/modelsApi.ts';
import { MODEL_STATUS_LIST } from '../../constants/modelStatus.ts';
import type {
  AgeGroup,
  ApplicationRecord,
  AvailabilityStatus,
  ExperienceLevel,
  Model,
  ModelStatus,
  ModelVideo,
} from '../../types/index.ts';
import { detectVideoProvider, parseVideoEmbedUrl } from '../../utils/videoEmbed.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';

const ALL_CATEGORIES = [
  'Female Models',
  'Male Models',
  'Fashion Models',
  'Commercial Models',
  'Fitness Models',
  'Petite Models',
  'Plus-size Models',
  'New Faces',
  'Runway',
  'Editorial',
  'Video',
];

const STOCK_COVER_CHOICES = [
  { label: 'Editorial Studio Portrait', url: AGENCY_ASSETS.MODEL_AANYA },
  { label: 'Menswear Overcoat', url: AGENCY_ASSETS.MODEL_AARAV },
  { label: 'Commercial Beauty', url: AGENCY_ASSETS.MODEL_SANJANA },
  { label: 'Natural New Face', url: AGENCY_ASSETS.MODEL_TARA },
  { label: 'Streetwear Studio', url: AGENCY_ASSETS.MODEL_SAMIR },
  { label: 'Couture Raw Silk', url: AGENCY_ASSETS.MODEL_MAYA },
];

type EditorTab = 'profile' | 'stats' | 'photos' | 'videos';

interface ModelEditorModalProps {
  isOpen: boolean;
  model: Model | null;
  onboardingApplication?: ApplicationRecord | null;
  onOnboardComplete?: (applicationId: string) => void;
  onClose: () => void;
}

function inferAgeGroup(dob?: string): AgeGroup {
  if (!dob) return '18-22';
  const birthYear = new Date(dob).getFullYear();
  if (Number.isNaN(birthYear)) return '18-22';
  const age = new Date().getFullYear() - birthYear;
  if (age >= 28) return '28+';
  if (age >= 23) return '23-27';
  return '18-22';
}

export function ModelEditorModal({
  isOpen,
  model,
  onboardingApplication,
  onOnboardComplete,
  onClose,
}: ModelEditorModalProps) {
  const isEditing = Boolean(model);
  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [formError, setFormError] = useState<string | null>(null);

  const [createModel, { isLoading: isCreating }] = useCreateModelMutation();
  const [updateModel, { isLoading: isUpdating }] = useUpdateModelMutation();

  // Profile fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [location, setLocation] = useState('Kathmandu');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [status, setStatus] = useState<ModelStatus>('active');
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState<string[]>(['New Faces']);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('23-27');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Emerging');
  const [experience, setExperience] = useState('');
  const [nationality, setNationality] = useState('Nepalese');
  const [languagesText, setLanguagesText] = useState('Nepali, English');
  const [bio, setBio] = useState('');

  // Stats fields
  const [height, setHeight] = useState('176');
  const [weight, setWeight] = useState('');
  const [bust, setBust] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [shoeSize, setShoeSize] = useState('EU 39');
  const [dressSize, setDressSize] = useState('');
  const [eyeColor, setEyeColor] = useState('Dark Brown');
  const [hairColor, setHairColor] = useState('Black');
  const [skinTone, setSkinTone] = useState('Warm Medium');
  const [bodyType, setBodyType] = useState('Editorial');

  // Photos fields
  const [coverImage, setCoverImage] = useState<string>(AGENCY_ASSETS.MODEL_TARA);
  const [gallery, setGallery] = useState<string[]>([AGENCY_ASSETS.MODEL_TARA]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Videos fields
  const [videos, setVideos] = useState<ModelVideo[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState('Runway Walk');

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('profile');
    setFormError(null);

    if (model) {
      setName(model.name);
      setGender(model.gender);
      setLocation(model.location);
      setAvailability(model.availability);
      setStatus(model.status || 'active');
      setFeatured(model.featured);
      setCategories(model.category);
      setAgeGroup(model.ageGroup);
      setExperienceLevel(model.experienceLevel);
      setExperience(model.experience);
      setNationality(model.nationality || 'Nepalese');
      setLanguagesText(model.languages.join(', '));
      setBio(model.bio);

      setHeight(String(model.height));
      setWeight(model.weight !== undefined ? String(model.weight) : '');
      setBust(model.bust !== undefined ? String(model.bust) : '');
      setChest(model.chest !== undefined ? String(model.chest) : '');
      setWaist(model.waist !== undefined ? String(model.waist) : '');
      setHips(model.hips !== undefined ? String(model.hips) : '');
      setShoeSize(model.shoeSize || '');
      setDressSize(model.dressSize || '');
      setEyeColor(model.eyeColor || '');
      setHairColor(model.hairColor || '');
      setSkinTone(model.skinTone || '');
      setBodyType(model.bodyType || '');

      setCoverImage(model.coverImage);
      setGallery(model.gallery);
      setVideos(model.videos || []);
    } else if (onboardingApplication) {
      const catList = Array.from(
        new Set(
          [onboardingApplication.category, 'New Faces'].filter(Boolean),
        ),
      );
      setName(onboardingApplication.fullName);
      setGender(onboardingApplication.gender || 'Female');
      setLocation(onboardingApplication.location.split(',')[0]?.trim() || 'Kathmandu');
      setAvailability('available');
      setStatus('active');
      setFeatured(false);
      setCategories(catList);
      setAgeGroup(inferAgeGroup(onboardingApplication.dateOfBirth));
      setExperienceLevel('New Face');
      setExperience(onboardingApplication.experience || 'New Development Board');
      setNationality('Nepalese');
      setLanguagesText('Nepali, English');
      setBio(onboardingApplication.introduction || '');

      setHeight(String(onboardingApplication.height || 176));
      setWeight(onboardingApplication.weight ? String(onboardingApplication.weight) : '');
      setBust('');
      setChest('');
      setWaist('');
      setHips('');
      setShoeSize('EU 39');
      setDressSize('');
      setEyeColor('Dark Brown');
      setHairColor('Black');
      setSkinTone('Warm Medium');
      setBodyType('Editorial');

      const defaultAsset =
        onboardingApplication.gender === 'Male'
          ? AGENCY_ASSETS.MODEL_AARAV
          : AGENCY_ASSETS.MODEL_TARA;
      setCoverImage(defaultAsset);
      setGallery([defaultAsset]);
      setVideos([]);
    } else {
      setName('');
      setGender('Female');
      setLocation('Kathmandu');
      setAvailability('available');
      setStatus('active');
      setFeatured(false);
      setCategories(['New Faces', 'Female Models']);
      setAgeGroup('18-22');
      setExperienceLevel('New Face');
      setExperience('1 Year · Nepal Editorial');
      setNationality('Nepalese');
      setLanguagesText('Nepali, English');
      setBio('');

      setHeight('176');
      setWeight('');
      setBust('');
      setChest('');
      setWaist('');
      setHips('');
      setShoeSize('EU 39');
      setDressSize('');
      setEyeColor('Dark Brown');
      setHairColor('Jet Black');
      setSkinTone('Warm Olive');
      setBodyType('Editorial');

      setCoverImage(AGENCY_ASSETS.MODEL_TARA);
      setGallery([AGENCY_ASSETS.MODEL_TARA]);
      setVideos([]);
    }
  }, [isOpen, model, onboardingApplication]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result);
        setGallery((prev) => [...prev, dataUrl]);
        if (!coverImage) {
          setCoverImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoUrl = () => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;
    setGallery((prev) => [...prev, trimmed]);
    if (!coverImage) setCoverImage(trimmed);
    setNewPhotoUrl('');
  };

  const handleAddEmbedVideo = () => {
    setFormError(null);
    if (!videoTitle.trim() || !videoUrl.trim()) {
      setFormError('Enter both a video title and a YouTube/Vimeo URL.');
      return;
    }
    const provider = detectVideoProvider(videoUrl.trim());
    if (provider === 'upload' || !parseVideoEmbedUrl(videoUrl.trim(), provider)) {
      setFormError('Please provide a valid YouTube or Vimeo link.');
      return;
    }
    setVideos((prev) => [
      {
        id: `vid-${Date.now()}`,
        title: videoTitle.trim(),
        type: provider,
        url: videoUrl.trim(),
        category: videoCategory,
        poster: coverImage,
      },
      ...prev,
    ]);
    if (!categories.includes('Video')) {
      setCategories((prev) => [...prev, 'Video']);
    }
    setVideoTitle('');
    setVideoUrl('');
  };

  const handleUploadVideoClip = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setVideos((prev) => [
      {
        id: `vid-${Date.now()}`,
        title: videoTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
        type: 'upload',
        url: objectUrl,
        category: videoCategory,
        poster: coverImage,
      },
      ...prev,
    ]);
    if (!categories.includes('Video')) {
      setCategories((prev) => [...prev, 'Video']);
    }
    setVideoTitle('');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Model full name is required.');
      setActiveTab('profile');
      return;
    }

    const numericHeight = Number(height);
    if (Number.isNaN(numericHeight) || numericHeight < 145 || numericHeight > 215) {
      setFormError('Height must be between 145 cm and 215 cm.');
      setActiveTab('stats');
      return;
    }

    const finalCategories =
      videos.length > 0 && !categories.includes('Video')
        ? [...categories, 'Video']
        : categories.length > 0
          ? categories
          : ['New Faces'];

    const payload = {
      name: name.trim(),
      gender,
      category: finalCategories,
      location: location.trim() || 'Kathmandu',
      availability,
      status,
      featured,
      ageGroup,
      experienceLevel,
      experience: experience.trim() || 'Nepal Roster',
      nationality: nationality.trim() || 'Nepalese',
      languages: languagesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      bio: bio.trim() || `${name.trim()} is represented by House of Fashion Nepal.`,
      height: numericHeight,
      weight: weight ? Number(weight) : undefined,
      bust: bust ? Number(bust) : undefined,
      chest: chest ? Number(chest) : undefined,
      waist: waist ? Number(waist) : undefined,
      hips: hips ? Number(hips) : undefined,
      shoeSize: shoeSize.trim() || undefined,
      dressSize: dressSize.trim() || undefined,
      eyeColor: eyeColor.trim() || undefined,
      hairColor: hairColor.trim() || undefined,
      skinTone: skinTone.trim() || undefined,
      bodyType: bodyType.trim() || undefined,
      coverImage: coverImage || gallery[0] || AGENCY_ASSETS.MODEL_TARA,
      gallery: gallery.length > 0 ? gallery : [coverImage || AGENCY_ASSETS.MODEL_TARA],
      videos,
    };

    try {
      if (isEditing && model) {
        await updateModel({
          id: model.id,
          slug: model.slug,
          ...payload,
        }).unwrap();
      } else {
        await createModel(payload).unwrap();
        if (onboardingApplication && onOnboardComplete) {
          onOnboardComplete(onboardingApplication.id);
        }
      }

      onClose();
    } catch {
      setFormError('Unable to save model profile right now. Please verify required fields and try again.');
    }
  };

  const labelClass = 'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/65 mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F5F1EA] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? `Edit ${model?.name}` : 'Create Model Profile'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F4] text-[#101010] w-full max-w-4xl border border-[#101010]/20 my-2 sm:my-6 flex flex-col max-h-[92dvh]"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#101010]/15 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#632B37]">
                  {isEditing
                    ? `Editing ${model?.id}`
                    : onboardingApplication
                      ? `Onboarding ${onboardingApplication.id}`
                      : 'New Talent Onboarding'}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl truncate">
                  {isEditing
                    ? model?.name
                    : onboardingApplication
                      ? `Onboard ${onboardingApplication.fullName}`
                      : 'Create Model Profile'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close model editor"
                className="w-10 h-10 shrink-0 flex items-center justify-center text-[#101010]/60 hover:text-[#101010] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Tabs */}
            <div className="px-4 sm:px-6 border-b border-[#101010]/15 flex items-center gap-4 sm:gap-6 overflow-x-auto">
              {(
                [
                  { id: 'profile', label: 'Profile & Bio' },
                  { id: 'stats', label: 'Statistics' },
                  { id: 'photos', label: `Photos (${gallery.length})` },
                  { id: 'videos', label: `Videos (${videos.length})` },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3.5 text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      isActive
                        ? 'text-[#101010]'
                        : 'text-[#101010]/50 hover:text-[#101010]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="model-editor-active-tab"
                        transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#632B37]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="ed-name" className={labelClass}>
                        Full Name *
                      </label>
                      <input
                        id="ed-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Alina Tamang"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-gender" className={labelClass}>
                        Gender / Board *
                      </label>
                      <SearchableSelect
                        id="ed-gender"
                        value={gender}
                        onChange={setGender}
                        options={[
                          { value: 'Female', label: 'Female' },
                          { value: 'Male', label: 'Male' },
                          { value: 'Non-Binary', label: 'Non-Binary' },
                        ]}
                        searchPlaceholder="Search gender / board..."
                        tone="ivory"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-location" className={labelClass}>
                        Base City *
                      </label>
                      <input
                        id="ed-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <label htmlFor="ed-status" className={labelClass}>
                        Roster Status
                      </label>
                      <SearchableSelect
                        id="ed-status"
                        value={status}
                        onChange={(val) => setStatus(val as ModelStatus)}
                        options={MODEL_STATUS_LIST.map((item) => ({
                          value: item.value,
                          label: item.label,
                          hint: item.hint,
                        }))}
                        searchPlaceholder="Search status..."
                        tone="ivory"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-availability" className={labelClass}>
                        Booking Availability
                      </label>
                      <SearchableSelect
                        id="ed-availability"
                        value={availability}
                        onChange={(val) => setAvailability(val as AvailabilityStatus)}
                        options={[
                          { value: 'available', label: 'Available' },
                          { value: 'booked', label: 'Booked / On Option' },
                          { value: 'unavailable', label: 'Unavailable' },
                        ]}
                        searchPlaceholder="Search availability..."
                        tone="ivory"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-ageGroup" className={labelClass}>
                        Age Bracket
                      </label>
                      <SearchableSelect
                        id="ed-ageGroup"
                        value={ageGroup}
                        onChange={(val) => setAgeGroup(val as AgeGroup)}
                        options={[
                          { value: '18-22', label: '18–22' },
                          { value: '23-27', label: '23–27' },
                          { value: '28+', label: '28+' },
                        ]}
                        searchPlaceholder="Search age bracket..."
                        tone="ivory"
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-expLevel" className={labelClass}>
                        Board Tier
                      </label>
                      <SearchableSelect
                        id="ed-expLevel"
                        value={experienceLevel}
                        onChange={(val) => setExperienceLevel(val as ExperienceLevel)}
                        options={[
                          { value: 'New Face', label: 'New Face' },
                          { value: 'Emerging', label: 'Emerging' },
                          { value: 'Established', label: 'Established' },
                          { value: 'Principal', label: 'Principal' },
                        ]}
                        searchPlaceholder="Search board tier..."
                        tone="ivory"
                      />
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>Categories &amp; Divisions</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {ALL_CATEGORIES.map((cat) => {
                        const checked = categories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-2 text-xs text-left border transition-colors cursor-pointer ${
                              checked
                                ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                                : 'bg-[#F5F1EA] text-[#101010]/75 border-[#101010]/15 hover:border-[#101010]'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="ed-experience" className={labelClass}>
                        Experience Summary
                      </label>
                      <input
                        id="ed-experience"
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., 3 Years · Kathmandu & Delhi"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-languages" className={labelClass}>
                        Languages (Comma-Separated)
                      </label>
                      <input
                        id="ed-languages"
                        type="text"
                        value={languagesText}
                        onChange={(e) => setLanguagesText(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-nationality" className={labelClass}>
                        Nationality
                      </label>
                      <input
                        id="ed-nationality"
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ed-bio" className={labelClass}>
                      Editorial Biography
                    </label>
                    <textarea
                      id="ed-bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief agency biography highlighting notable campaigns and aesthetic profile."
                      className={inputClass}
                    />
                  </div>

                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#632B37]"
                    />
                    <span className="text-xs uppercase tracking-[0.14em] text-[#101010]/80">
                      Feature this model on Homepage Showcase
                    </span>
                  </label>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <p className="text-xs text-[#101010]/65">
                    Only publish measurements that the model has explicitly consented to display publicly. Leave optional fields blank to withhold them.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    <div>
                      <label htmlFor="ed-height" className={labelClass}>
                        Height (cm) *
                      </label>
                      <input
                        id="ed-height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-weight" className={labelClass}>
                        Weight (kg)
                      </label>
                      <input
                        id="ed-weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Optional"
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-bust" className={labelClass}>
                        Bust (cm)
                      </label>
                      <input
                        id="ed-bust"
                        type="number"
                        value={bust}
                        onChange={(e) => setBust(e.target.value)}
                        placeholder="Optional"
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-chest" className={labelClass}>
                        Chest (cm)
                      </label>
                      <input
                        id="ed-chest"
                        type="number"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                        placeholder="Optional"
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-waist" className={labelClass}>
                        Waist (cm)
                      </label>
                      <input
                        id="ed-waist"
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        placeholder="Optional"
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-hips" className={labelClass}>
                        Hips (cm)
                      </label>
                      <input
                        id="ed-hips"
                        type="number"
                        value={hips}
                        onChange={(e) => setHips(e.target.value)}
                        placeholder="Optional"
                        className={`${inputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-shoe" className={labelClass}>
                        Shoe Size
                      </label>
                      <input
                        id="ed-shoe"
                        type="text"
                        value={shoeSize}
                        onChange={(e) => setShoeSize(e.target.value)}
                        placeholder="EU 39"
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-dress" className={labelClass}>
                        Dress / Suit Size
                      </label>
                      <input
                        id="ed-dress"
                        type="text"
                        value={dressSize}
                        onChange={(e) => setDressSize(e.target.value)}
                        placeholder="EU 34 / S"
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-eye" className={labelClass}>
                        Eye Color
                      </label>
                      <input
                        id="ed-eye"
                        type="text"
                        value={eyeColor}
                        onChange={(e) => setEyeColor(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-hair" className={labelClass}>
                        Hair Color
                      </label>
                      <input
                        id="ed-hair"
                        type="text"
                        value={hairColor}
                        onChange={(e) => setHairColor(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-skin" className={labelClass}>
                        Skin Tone
                      </label>
                      <input
                        id="ed-skin"
                        type="text"
                        value={skinTone}
                        onChange={(e) => setSkinTone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-bodyType" className={labelClass}>
                        Body Type
                      </label>
                      <input
                        id="ed-bodyType"
                        type="text"
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F5F1EA] border border-[#101010]/15">
                    <div>
                      <label htmlFor="ed-photoUrl" className={labelClass}>
                        Add Photo by URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="ed-photoUrl"
                          type="url"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="/images/..."
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          className="px-4 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.14em] shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className={labelClass}>Upload Local Portrait</span>
                      <label className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FAF8F4] border border-dashed border-[#101010]/30 text-xs uppercase tracking-[0.14em] cursor-pointer hover:border-[#632B37]">
                        <ImagePlus className="w-4 h-4" />
                        <span>Choose Image Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>Quick Studio Portrait Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {STOCK_COVER_CHOICES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (!gallery.includes(preset.url)) {
                              setGallery((prev) => [...prev, preset.url]);
                            }
                            setCoverImage(preset.url);
                          }}
                          className="px-3 py-1.5 text-xs border border-[#101010]/20 bg-[#F5F1EA] hover:border-[#632B37] cursor-pointer"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {gallery.map((imgUrl, idx) => {
                      const isCover = imgUrl === coverImage;
                      return (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className={`border p-2 space-y-2 ${
                            isCover ? 'border-[#632B37] bg-[#F5F1EA]' : 'border-[#101010]/15'
                          }`}
                        >
                          <EditorialImage
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            containerClassName="aspect-[3/4] w-full"
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => setCoverImage(imgUrl)}
                              className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] cursor-pointer ${
                                isCover ? 'text-[#632B37] font-semibold' : 'text-[#101010]/60 hover:text-[#101010]'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${isCover ? 'fill-current' : ''}`} />
                              <span>{isCover ? 'Cover' : 'Set Cover'}</span>
                            </button>

                            {gallery.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = gallery.filter((_, i) => i !== idx);
                                  setGallery(next);
                                  if (isCover && next[0]) {
                                    setCoverImage(next[0]);
                                  }
                                }}
                                aria-label="Remove photo"
                                className="text-[#101010]/50 hover:text-[#632B37] p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#F5F1EA] border border-[#101010]/15 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="ed-vid-title" className={labelClass}>
                          Video Title
                        </label>
                        <input
                          id="ed-vid-title"
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="Runway Walk / Showreel"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="ed-vid-cat" className={labelClass}>
                          Category
                        </label>
                        <SearchableSelect
                          id="ed-vid-cat"
                          value={videoCategory}
                          onChange={setVideoCategory}
                          options={[
                            { value: 'Runway Walk', label: 'Runway Walk' },
                            { value: 'Campaign Film', label: 'Campaign Film' },
                            { value: 'Commercial Showreel', label: 'Commercial Showreel' },
                            { value: 'Editorial Motion', label: 'Editorial Motion' },
                          ]}
                          searchPlaceholder="Search reel categories..."
                          tone="ivory"
                        />
                      </div>
                      <div>
                        <label htmlFor="ed-vid-url" className={labelClass}>
                          YouTube or Vimeo URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="ed-vid-url"
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://vimeo.com/..."
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={handleAddEmbedVideo}
                            className="px-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.14em] shrink-0 cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Embed</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] border border-dashed border-[#101010]/30 text-xs uppercase tracking-[0.14em] cursor-pointer hover:border-[#632B37]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Or Upload Short Video Clip (MP4 / WebM)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleUploadVideoClip}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  {videos.length === 0 ? (
                    <p className="text-sm text-[#101010]/60 py-6 text-center border border-[#101010]/10">
                      No videos attached yet. Adding a video automatically assigns the Video category.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#101010]/10 border border-[#101010]/15">
                      {videos.map((v) => (
                        <div
                          key={v.id}
                          className="p-4 flex items-center justify-between gap-4 bg-[#F5F1EA]"
                        >
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                              {v.category || 'Reel'} · {v.type.toUpperCase()}
                            </p>
                            <p className="font-serif text-xl truncate">{v.title}</p>
                            <p className="text-xs text-[#101010]/55 truncate">{v.url}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setVideos((prev) => prev.filter((item) => item.id !== v.id))
                            }
                            aria-label={`Remove ${v.title}`}
                            className="p-2 text-[#101010]/60 hover:text-[#632B37] cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <p className="text-xs text-[#632B37]" role="alert">
                  {formError}
                </p>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#101010]/15 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 sm:px-6 py-3 border border-[#101010]/25 text-xs uppercase tracking-[0.16em] hover:border-[#101010] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 sm:px-8 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isCreating || isUpdating
                    ? 'Saving Profile...'
                    : isEditing
                      ? 'Save Changes'
                      : 'Create Model'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
