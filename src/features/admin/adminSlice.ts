import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  type AdminSession,
  clearStoredAdminSession,
  getStoredAdminSession,
} from '../../services/adminAuthService.ts';
import type { ApplicationRecord } from '../../types/index.ts';

interface AdminState {
  authSession: AdminSession | null;
  loginDialogOpen: boolean;
  loginRedirectTo: string;
  rosterSearch: string;
  rosterAvailability: string;
  rosterStatus: string;
  editorOpen: boolean;
  editingModelId: string | null;
  onboardingApplication: ApplicationRecord | null;
  deleteTargetId: string | null;
}

const initialState: AdminState = {
  authSession: getStoredAdminSession(),
  loginDialogOpen: false,
  loginRedirectTo: '/admin',
  rosterSearch: '',
  rosterAvailability: 'All',
  rosterStatus: 'All',
  editorOpen: false,
  editingModelId: null,
  onboardingApplication: null,
  deleteTargetId: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminSession: (state, action: PayloadAction<AdminSession>) => {
      state.authSession = action.payload;
    },
    clearAdminSession: (state) => {
      clearStoredAdminSession();
      state.authSession = null;
      state.editorOpen = false;
      state.editingModelId = null;
      state.onboardingApplication = null;
      state.deleteTargetId = null;
    },
    openAdminLoginDialog: (state, action: PayloadAction<string | undefined>) => {
      state.loginDialogOpen = true;
      state.loginRedirectTo = action.payload || '/admin';
    },
    closeAdminLoginDialog: (state) => {
      state.loginDialogOpen = false;
    },
    setRosterSearch: (state, action: PayloadAction<string>) => {
      state.rosterSearch = action.payload;
    },
    setRosterAvailability: (state, action: PayloadAction<string>) => {
      state.rosterAvailability = action.payload;
    },
    setRosterStatus: (state, action: PayloadAction<string>) => {
      state.rosterStatus = action.payload;
    },
    openCreateModelEditor: (state) => {
      state.editorOpen = true;
      state.editingModelId = null;
      state.onboardingApplication = null;
    },
    openOnboardModelEditor: (state, action: PayloadAction<ApplicationRecord>) => {
      state.editorOpen = true;
      state.editingModelId = null;
      state.onboardingApplication = action.payload;
    },
    openEditModelEditor: (state, action: PayloadAction<string>) => {
      state.editorOpen = true;
      state.editingModelId = action.payload;
      state.onboardingApplication = null;
    },
    closeModelEditor: (state) => {
      state.editorOpen = false;
      state.editingModelId = null;
      state.onboardingApplication = null;
    },
    setDeleteTargetId: (state, action: PayloadAction<string | null>) => {
      state.deleteTargetId = action.payload;
    },
  },
});

export const {
  setAdminSession,
  clearAdminSession,
  openAdminLoginDialog,
  closeAdminLoginDialog,
  setRosterSearch,
  setRosterAvailability,
  setRosterStatus,
  openCreateModelEditor,
  openOnboardModelEditor,
  openEditModelEditor,
  closeModelEditor,
  setDeleteTargetId,
} = adminSlice.actions;

export default adminSlice.reducer;
