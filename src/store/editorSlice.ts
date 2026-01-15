import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, PageSection, CompanyTheme, SectionContent } from '@/types';

interface EditorState {
  company: Company | null;
  sections: PageSection[];
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: EditorState = {
  company: null,
  sections: [],
  isDirty: false,
  isLoading: false,
  isSaving: false,
  error: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    setSections: (state, action: PayloadAction<PageSection[]>) => {
      state.sections = [...action.payload].sort((a, b) => a.order - b.order);
    },
    updateTheme: (state, action: PayloadAction<Partial<CompanyTheme>>) => {
      if (state.company) {
        state.company.theme = { ...state.company.theme, ...action.payload };
        state.isDirty = true;
      }
    },
    updateCompanyField: (state, action: PayloadAction<{ field: keyof Company; value: string | boolean }>) => {
      if (state.company) {
        (state.company as Record<string, unknown>)[action.payload.field] = action.payload.value;
        state.isDirty = true;
      }
    },
    updateSectionContent: (state, action: PayloadAction<{ sectionId: string; content: Partial<SectionContent> }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.content = { ...section.content, ...action.payload.content };
        state.isDirty = true;
      }
    },
    updateSectionTitle: (state, action: PayloadAction<{ sectionId: string; title: string }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.title = action.payload.title;
        state.isDirty = true;
      }
    },
    toggleSectionVisibility: (state, action: PayloadAction<string>) => {
      const section = state.sections.find(s => s.id === action.payload);
      if (section) {
        section.is_visible = !section.is_visible;
        state.isDirty = true;
      }
    },
    reorderSections: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const activeIndex = state.sections.findIndex(s => s.id === activeId);
      const overIndex = state.sections.findIndex(s => s.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = state.sections.splice(activeIndex, 1);
        state.sections.splice(overIndex, 0, removed);
        // Update order values
        state.sections.forEach((section, index) => {
          section.order = index;
        });
        state.isDirty = true;
      }
    },
    addSection: (state, action: PayloadAction<PageSection>) => {
      state.sections.push(action.payload);
      state.sections.sort((a, b) => a.order - b.order);
      state.isDirty = true;
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(s => s.id !== action.payload);
      // Update order values
      state.sections.forEach((section, index) => {
        section.order = index;
      });
      state.isDirty = true;
    },
    markClean: (state) => {
      state.isDirty = false;
    },
    resetEditor: () => initialState,
  },
});

export const {
  setLoading,
  setSaving,
  setError,
  setCompany,
  setSections,
  updateTheme,
  updateCompanyField,
  updateSectionContent,
  updateSectionTitle,
  toggleSectionVisibility,
  reorderSections,
  addSection,
  removeSection,
  markClean,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
