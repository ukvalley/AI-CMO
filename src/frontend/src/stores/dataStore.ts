/**
 * Data Store
 *
 * Central data management for all modules with auto-save functionality.
 * Implements the window.storage API for cloud persistence.
 */

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type {
  BusinessProfile,
  Founder,
  Employee,
  Product,
  ProductCategory,
  ICP,
  Persona,
  Brand,
  BrandAsset,
  Stationery,
  WebsitePlanner,
  Blog,
  BlogSystem,
  LandingPageSystem,
  SeoSystem,
  HrSystem,
  Newsletter,
  FAQ,
  FAQCategoryItem,
  ContentItem,
  LandingPage,
  Banner,
  VideoContent,
  VideoCategoryInfo,
  VideoPlaylist,
  StoryCampaign,
  SalesScript,
  SalesCollateral,
  CollateralCategoryInfo,
  Book,
  Course,
  CourseCategory,
  CourseChapter,
  CourseLesson,
  SEOPage,
  Ad,
  PRItem,
  EmailTemplate,
  LoyaltyProgramme,
  MembershipPlan,
  ReferralProgramme,
  Testimonial,
  JobPosting,
  Competitor,
  SOP,
  Event,
  LegalDocument,
  // Blog Content OS
  BlogStrategy,
  BlogContentTypeConfig,
  BlogCalendar,
  BlogSEOConfig,
  BlogTitle,
  BlogPost,
  BlogContentChunk,
  BlogExport,
  BlogContentSystem,
  BlogStructure,
  BlogContentSection,
  // Newsletter Content OS
  NewsletterStrategy,
  NewsletterContentTypeConfig,
  NewsletterCalendar,
  NewsletterTitle,
  NewsletterPost,
  NewsletterExport,
  NewsletterContentSystem,
  // Landing Page Content OS
  LandingPageTemplate,
  LandingPageExport,
  // Social Media Content OS
  SocialMediaCalendar,
  SocialContentStrategy,
  SocialCalendarEntry,
  SocialCampaign,
  SocialContentTemplate,
  SocialHashtagBank,
  SocialCreative,
  SocialExport,
} from '@/types/entities';

// ============================================
// DATA STATE INTERFACE
// ============================================

interface ModuleData {
  // Foundation
  businessProfiles: BusinessProfile[];
  founders: Founder[];
  employees: Employee[];
  products: Product[];
  productCategories: ProductCategory[];
  icps: ICP[];
  personas: Persona[];
  competitors: Competitor[];

  // Brand
  brand: Brand | null;
  brandAssets: BrandAsset[];
  stationery: Stationery[];

  // Content
  websitePlanners: WebsitePlanner[];
  blogSystem: BlogSystem | null;
  blogs: Blog[];
  newsletters: Newsletter[];
  faqs: FAQ[];
  faqCategories: FAQCategoryItem[];
  contentItems: ContentItem[];
  stories: StoryCampaign[];
  testimonials: Testimonial[];

  // Blog Content OS
  blogContentSystem: BlogContentSystem | null;
  blogStrategies: BlogStrategy[];
  blogContentTypes: BlogContentTypeConfig[];
  blogCalendars: BlogCalendar[];
  blogSEOConfigs: BlogSEOConfig[];
  blogTitles: BlogTitle[];
  blogPosts: BlogPost[];
  blogContentChunks: BlogContentChunk[];
  blogExports: BlogExport[];
  blogStructures: BlogStructure[];
  blogContentSections: BlogContentSection[];

  // Newsletter Content OS
  newsletterContentSystem: any | null;
  newsletterStrategies: any[];
  newsletterContentTypes: any[];
  newsletterCalendars: any[];
  newsletterTitles: any[];
  newsletterPosts: any[];
  newsletterContentChunks: any[];
  newsletterExports: any[];

  // Sales
  landingPageSystem: LandingPageSystem | null;
  landingPages: LandingPage[];
  landingPageTemplates: LandingPageTemplate[];
  landingPageExports: LandingPageExport[];
  salesScripts: SalesScript[];
  salesCollateral: SalesCollateral[];
  collateralCategories: CollateralCategoryInfo[];
  videoContent: VideoContent[];
  videoCategories: VideoCategoryInfo[];
  videoPlaylists: VideoPlaylist[];
  banners: Banner[];
  books: Book[];

  // Marketing
  seoSystem: SeoSystem | null;
  seoPages: SEOPage[];
  ads: Ad[];
  prItems: PRItem[];
  emailTemplates: EmailTemplate[];
  events: Event[];

  // Social Media Content OS
  socialMediaCalendar: SocialMediaCalendar | null;
  socialContentStrategies: SocialContentStrategy[];
  socialCalendarEntries: SocialCalendarEntry[];
  socialContentTemplates: SocialContentTemplate[];
  socialHashtagBanks: SocialHashtagBank[];
  socialCreatives: SocialCreative[];
  socialCampaigns: SocialCampaign[];
  socialExports: SocialExport[];

  // Programs
  courses: Course[];
  courseCategories: CourseCategory[];
  courseChapters: CourseChapter[];
  courseLessons: CourseLesson[];
  loyaltyProgrammes: LoyaltyProgramme[];
  membershipPlans: MembershipPlan[];
  referralProgrammes: ReferralProgramme[];
  sops: SOP[];

  // Ops
  hrSystem: HrSystem | null;
  jobPostings: JobPosting[];
  legalDocuments: LegalDocument[];
}

interface DataState {
  data: Record<string, ModuleData>; // Keyed by companyId
  activeCompanyId: string | null;
  lastSaved: string | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

// ============================================
// DEFAULT EMPTY DATA
// ============================================

const createEmptyModuleData = (): ModuleData => ({
  businessProfiles: [],
  founders: [],
  employees: [],
  products: [],
  productCategories: [],
  icps: [],
  personas: [],
  competitors: [],
  brand: null,
  brandAssets: [],
  stationery: [],
  websitePlanners: [],
  blogSystem: null,
  blogs: [],
  newsletters: [],
  faqs: [],
  faqCategories: [],
  contentItems: [],
  stories: [],
  testimonials: [],

  // Blog Content OS
  blogContentSystem: null,
  blogStrategies: [],
  blogContentTypes: [],
  blogCalendars: [],
  blogSEOConfigs: [],
  blogTitles: [],
  blogPosts: [],
  blogContentChunks: [],
  blogExports: [],
  blogStructures: [],
  blogContentSections: [],

  // Newsletter Content OS
  newsletterContentSystem: null,
  newsletterStrategies: [],
  newsletterContentTypes: [],
  newsletterCalendars: [],
  newsletterTitles: [],
  newsletterPosts: [],
  newsletterContentChunks: [],
  newsletterExports: [],

  landingPageSystem: null,
  landingPages: [],
  landingPageTemplates: [],
  landingPageExports: [],
  salesScripts: [],
  salesCollateral: [],
  collateralCategories: [],
  videoContent: [],
  videoCategories: [],
  videoPlaylists: [],
  banners: [],
  books: [],
  seoSystem: null,
  seoPages: [],
  ads: [],
  prItems: [],
  emailTemplates: [],
  events: [],

  // Social Media Content OS
  socialMediaCalendar: null,
  socialContentStrategies: [],
  socialCalendarEntries: [],
  socialContentTemplates: [],
  socialHashtagBanks: [],
  socialCreatives: [],
  socialCampaigns: [],
  socialExports: [],
  courses: [],
  courseCategories: [],
  courseChapters: [],
  courseLessons: [],
  loyaltyProgrammes: [],
  membershipPlans: [],
  referralProgrammes: [],
  sops: [],
  hrSystem: null,
  jobPostings: [],
  legalDocuments: [],
});

// ============================================
// STORE INTERFACE
// ============================================

interface DataStore extends DataState {
  // Company switching
  setActiveCompany: (companyId: string) => void;

  // Generic CRUD operations
  getItems: <K extends keyof ModuleData>(module: K) => ModuleData[K];
  setItems: <K extends keyof ModuleData>(module: K, items: ModuleData[K]) => void;
  addItem: <K extends keyof ModuleData>(
    module: K,
    item: ModuleData[K] extends Array<infer U> ? Omit<U, 'id' | 'createdAt' | 'updatedAt' | 'companyId'> : never
  ) => string;
  updateItem: <K extends keyof ModuleData>(
    module: K,
    id: string,
    updates: Partial<ModuleData[K] extends Array<infer U> ? U : never>
  ) => void;
  deleteItem: <K extends keyof ModuleData>(module: K, id: string) => void;

  // Bulk operations
  importData: (companyId: string, jsonData: string) => void;
  exportData: (companyId: string) => string;
  resetData: (companyId: string) => void;

  // Stats
  getStats: () => Record<string, number>;
}

// ============================================
// AUTO-SAVE DELAY (2 seconds)
// ============================================

const AUTO_SAVE_DELAY = 2000;

export const useDataStore = create<DataStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        data: {},
        activeCompanyId: null,
        lastSaved: null,
        isSaving: false,
        hasUnsavedChanges: false,

        // Company switching
        setActiveCompany: (companyId) => {
          set({ activeCompanyId: companyId });
        },

        // Generic CRUD
        getItems: (module) => {
          const { data, activeCompanyId } = get();
          if (!activeCompanyId) return [] as unknown as ModuleData[typeof module];
          const companyData = data[activeCompanyId] || createEmptyModuleData();
          return companyData[module];
        },

        setItems: (module, items) => {
          const { activeCompanyId } = get();
          if (!activeCompanyId) return;

          set((state) => ({
            data: {
              ...state.data,
              [activeCompanyId]: {
                ...(state.data[activeCompanyId] || createEmptyModuleData()),
                [module]: items,
              },
            },
            hasUnsavedChanges: true,
          }));
        },

        addItem: (module, itemData) => {
          const { activeCompanyId, getItems, setItems } = get();
          if (!activeCompanyId) return '';

          const items = (getItems(module) || []) as unknown as Array<{ id: string }>;
          const newItem = {
            ...itemData,
            id: `${module.slice(0, -1)}-${Date.now()}`,
            companyId: activeCompanyId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setItems(module, [...items, newItem] as unknown as ModuleData[typeof module]);
          return newItem.id;
        },

        updateItem: (module, id, updates) => {
          const { getItems, setItems } = get();
          const items = (getItems(module) || []) as unknown as Array<{ id: string }>;
          const updatedItems = items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          );
          setItems(module, updatedItems as unknown as ModuleData[typeof module]);
        },

        deleteItem: (module, id) => {
          const { getItems, setItems } = get();
          const items = (getItems(module) || []) as unknown as Array<{ id: string }>;
          setItems(
            module,
            items.filter((item) => item.id !== id) as unknown as ModuleData[typeof module]
          );
        },

        // Import/Export
        importData: (companyId, jsonData) => {
          try {
            const parsed = JSON.parse(jsonData);
            set((state) => ({
              data: {
                ...state.data,
                [companyId]: { ...createEmptyModuleData(), ...parsed },
              },
              hasUnsavedChanges: true,
            }));
          } catch (error) {
            console.error('Failed to import data:', error);
          }
        },

        exportData: (companyId) => {
          const { data } = get();
          return JSON.stringify(data[companyId] || createEmptyModuleData(), null, 2);
        },

        resetData: (companyId) => {
          set((state) => ({
            data: {
              ...state.data,
              [companyId]: createEmptyModuleData(),
            },
            hasUnsavedChanges: true,
          }));
        },

        // Stats
        getStats: () => {
          const { data, activeCompanyId } = get();
          const defaultStats = {
            companies: 0, founders: 0, employees: 0, products: 0,
            competitors: 0, icps: 0, personas: 0,
            brand: 0, brandAssets: 0,
            blogs: 0, newsletters: 0, faqs: 0,
            landingPages: 0, salesScripts: 0, salesCollateral: 0,
            seoPages: 0,
            tasks: 0, generated: 0
          };
          if (!activeCompanyId) return defaultStats;

          const companyData = data[activeCompanyId] || createEmptyModuleData();
          const count = (arr: any) => Array.isArray(arr) ? arr.length : (arr ? 1 : 0);
          return {
            companies: Object.keys(data).length,
            founders: count(companyData.founders),
            employees: count(companyData.employees),
            products: count(companyData.products),
            competitors: count(companyData.competitors),
            icps: count(companyData.icps),
            personas: count(companyData.personas),
            brand: count(companyData.brand),
            brandAssets: count(companyData.brandAssets),
            blogs: count(companyData.blogs),
            newsletters: count(companyData.newsletters),
            faqs: count(companyData.faqs),
            landingPages: count(companyData.landingPages),
            salesScripts: count(companyData.salesScripts),
            salesCollateral: count(companyData.salesCollateral),
            seoPages: count(companyData.seoPages),
            tasks: 0,
            generated: 0,
          };
        },
      }),
      {
        name: 'ai-cmo-data',
        skipHydration: true,
        partialize: (state) => ({
          data: state.data,
          activeCompanyId: state.activeCompanyId,
          lastSaved: new Date().toISOString(),
        }),
      }
    )
  )
);

// ============================================
// AUTO-SAVE SUBSCRIPTION
// ============================================

let saveTimeout: NodeJS.Timeout | null = null;

useDataStore.subscribe(
  (state) => state.hasUnsavedChanges,
  (hasUnsavedChanges) => {
    if (hasUnsavedChanges) {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        // Simulate cloud save via window.storage
        if (typeof window !== 'undefined') {
          const state = useDataStore.getState();
          const win = window as unknown as { storage?: Record<string, string> };
          win.storage = {
            ...win.storage,
            'ai-cmo-backup': JSON.stringify(state.data),
          };
        }

        useDataStore.setState({
          isSaving: false,
          hasUnsavedChanges: false,
          lastSaved: new Date().toISOString(),
        });
      }, AUTO_SAVE_DELAY);
    }
  }
);
