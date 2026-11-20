import type { ModelStatus } from '../types/index.ts';

export interface ModelStatusMeta {
  value: ModelStatus;
  label: string;
  hint: string;
  badgeClass: string;
  dotClass: string;
}

export const MODEL_STATUS_LIST: ModelStatusMeta[] = [
  {
    value: 'active',
    label: 'Active',
    hint: 'Visible on public roster & bookable',
    badgeClass: 'bg-[#101010] text-[#FAF8F4] border-[#101010]',
    dotClass: 'bg-emerald-600',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    hint: 'On hiatus · hidden from public site',
    badgeClass: 'bg-[#F5F1EA] text-[#101010]/75 border-[#101010]/25',
    dotClass: 'bg-[#101010]/45',
  },
  {
    value: 'on-hold',
    label: 'On Hold',
    hint: 'Contract or compliance review',
    badgeClass: 'bg-[#B6A48D]/25 text-[#101010] border-[#B6A48D]',
    dotClass: 'bg-amber-600',
  },
  {
    value: 'banned',
    label: 'Banned',
    hint: 'Suspended · blocked from bookings',
    badgeClass: 'bg-[#632B37] text-[#FAF8F4] border-[#632B37]',
    dotClass: 'bg-[#632B37]',
  },
  {
    value: 'left',
    label: 'Left Agency',
    hint: 'Former talent · departed roster',
    badgeClass: 'bg-[#FAF8F4] text-[#101010]/60 border-[#101010]/20',
    dotClass: 'bg-[#101010]/30',
  },
];

export const MODEL_STATUS_MAP: Record<ModelStatus, ModelStatusMeta> = {
  active: MODEL_STATUS_LIST[0],
  inactive: MODEL_STATUS_LIST[1],
  'on-hold': MODEL_STATUS_LIST[2],
  banned: MODEL_STATUS_LIST[3],
  left: MODEL_STATUS_LIST[4],
};

export const VALID_MODEL_STATUSES: ModelStatus[] = MODEL_STATUS_LIST.map(
  (item) => item.value,
);
