export interface Filament {
  id: string;
  brand: string;
  type: 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'NYLON';
  color: string;
  spoolPrice: number;
  spoolWeightGrams: number;
}

export interface PrinterProfile {
  id: string;
  name: string;
  acquisitionCost: number;
  powerConsumptionWatts: number;
  estimatedLifespanHours: number;
}

export interface AppSettings {
  energyCostKWh: number;
  defaultLaborCostPerHour: number;
}

export interface CalculationResult {
  materialCost: number;
  energyCost: number;
  depreciationCost: number;
  laborCost: number;
  totalCost: number;
  sellingPrice: number;
  profitMargin: number;
}
