import { Filament, PrinterProfile, AppSettings } from '@/types';

const STORAGE_KEYS = {
  FILAMENTS: 'custo3d_filaments',
  PRINTERS: 'custo3d_printers',
  SETTINGS: 'custo3d_settings',
};

// Filaments
export const getFilaments = (): Filament[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveFilaments = (filaments: Filament[]): void => {
  localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
};

// Printers
export const getPrinters = (): PrinterProfile[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRINTERS);
  return data ? JSON.parse(data) : [];
};

export const savePrinters = (printers: PrinterProfile[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(printers));
};

// Settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    energyCostKWh: 0.92,
    defaultLaborCostPerHour: 25.00,
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
