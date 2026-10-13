'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  LabId, MarketplaceApp, OutcomeContract, PortfolioAccount, RoadmapItem,
  ServiceDefinition, ServiceLayer, SlaMetric, TierId,
} from '@/lib/twinforge/types';

interface Filters {
  layer: ServiceLayer | 'all';
  tier: TierId | 'all';
  lab: LabId | 'all';
  query: string;
}

interface State {
  filters: Filters;
  selectedServiceId: string | null;
  selectedAccountId: string | null;
  selectedLabId: LabId | null;
  selectedMarketplaceAppId: string | null;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  hydrated: {
    services: ServiceDefinition[];
    labs: LabId[];
    portfolio: PortfolioAccount[];
    sla: SlaMetric[];
    outcomes: OutcomeContract[];
    marketplace: MarketplaceApp[];
    roadmap: RoadmapItem[];
  };
}

interface Actions {
  setFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  resetFilters: () => void;
  selectService: (id: string | null) => void;
  selectAccount: (id: string | null) => void;
  selectLab: (id: LabId | null) => void;
  selectMarketplaceApp: (id: string | null) => void;
  toggleSidebar: () => void;
  setHydrated: (partial: Partial<State['hydrated']>) => void;
  reset: () => void;
}

const initialFilters: Filters = {
  layer: 'all',
  tier: 'all',
  lab: 'all',
  query: '',
};

const initialState: State = {
  filters: initialFilters,
  selectedServiceId: null,
  selectedAccountId: null,
  selectedLabId: null,
  selectedMarketplaceAppId: null,
  sidebarOpen: true,
  theme: 'dark',
  hydrated: {
    services: [],
    labs: [],
    portfolio: [],
    sla: [],
    outcomes: [],
    marketplace: [],
    roadmap: [],
  },
};

export const useTwinForgeStore = create<State & Actions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setFilter: (k, v) => set((s) => ({
      filters: { ...s.filters, [k]: v },
    })),
    resetFilters: () => set({ filters: initialFilters }),

    selectService: (id) => set({ selectedServiceId: id }),
    selectAccount: (id) => set({ selectedAccountId: id }),
    selectLab: (id) => set({ selectedLabId: id }),
    selectMarketplaceApp: (id) => set({ selectedMarketplaceAppId: id }),

    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    setHydrated: (partial) => set((s) => ({
      hydrated: { ...s.hydrated, ...partial },
    })),

    reset: () => set({ ...initialState }),
  })),
);

/* ── selectors ──────────────────────────────────────────── */

export const selectSelectedService = (s: State) =>
  s.selectedServiceId
    ? s.hydrated.services.find((x) => x.id === s.selectedServiceId) ?? null
    : null;

export const selectSelectedAccount = (s: State) =>
  s.selectedAccountId
    ? s.hydrated.portfolio.find((x) => x.id === s.selectedAccountId) ?? null
    : null;

export const selectSelectedLab = (s: State) =>
  s.selectedLabId
    ? s.hydrated.labs.includes(s.selectedLabId)
      ? s.selectedLabId
      : null
    : null;

export const selectSelectedMarketplaceApp = (s: State) =>
  s.selectedMarketplaceAppId
    ? s.hydrated.marketplace.find((x) => x.id === s.selectedMarketplaceAppId) ?? null
    : null;
