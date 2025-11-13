import { Filament, PrinterProfile, CalculationResult } from '@/types';

export const calculateCost = (
  weightGrams: number,
  printTimeHours: number,
  postProcessingMinutes: number,
  profitMarginPercent: number,
  filament: Filament,
  printer: PrinterProfile,
  energyCostKWh: number,
  laborCostPerHour: number
): CalculationResult => {
  // Material cost
  const pricePerGram = filament.spoolPrice / filament.spoolWeightGrams;
  const materialCost = weightGrams * pricePerGram;

  // Energy cost
  const powerInKW = printer.powerConsumptionWatts / 1000;
  const energyCost = printTimeHours * powerInKW * energyCostKWh;

  // Depreciation cost
  const depreciationPerHour = printer.acquisitionCost / printer.estimatedLifespanHours;
  const depreciationCost = printTimeHours * depreciationPerHour;

  // Labor cost
  const postProcessingHours = postProcessingMinutes / 60;
  const laborCost = postProcessingHours * laborCostPerHour;

  // Total cost
  const totalCost = materialCost + energyCost + depreciationCost + laborCost;

  // Selling price with profit margin
  const sellingPrice = totalCost * (1 + profitMarginPercent / 100);

  return {
    materialCost,
    energyCost,
    depreciationCost,
    laborCost,
    totalCost,
    sellingPrice,
    profitMargin: profitMarginPercent,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
