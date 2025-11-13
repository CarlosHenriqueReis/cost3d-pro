import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFilaments, getPrinters, getSettings } from '@/lib/storage';
import { calculateCost, formatCurrency } from '@/lib/calculator';
import { Filament, PrinterProfile } from '@/types';

const Calculator = () => {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [printers, setPrinters] = useState<PrinterProfile[]>([]);
  const [selectedFilament, setSelectedFilament] = useState<string>('');
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  
  const [weightGrams, setWeightGrams] = useState<string>('');
  const [printTimeHours, setPrintTimeHours] = useState<string>('');
  const [postProcessingMinutes, setPostProcessingMinutes] = useState<string>('0');
  const [profitMargin, setProfitMargin] = useState<string>('30');

  const settings = getSettings();

  useEffect(() => {
    setFilaments(getFilaments());
    setPrinters(getPrinters());
  }, []);

  const filament = filaments.find(f => f.id === selectedFilament);
  const printer = printers.find(p => p.id === selectedPrinter);

  const result = filament && printer && weightGrams && printTimeHours
    ? calculateCost(
        parseFloat(weightGrams),
        parseFloat(printTimeHours),
        parseFloat(postProcessingMinutes || '0'),
        parseFloat(profitMargin || '0'),
        filament,
        printer,
        settings.energyCostKWh,
        settings.defaultLaborCostPerHour
      )
    : null;

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Custo3D Pro</h1>
          <p className="text-muted-foreground">Calculadora de Custos de Impressão 3D</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seleção de Equipamento</CardTitle>
            <CardDescription>Escolha o filamento e impressora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filament">Filamento</Label>
              <Select value={selectedFilament} onValueChange={setSelectedFilament}>
                <SelectTrigger id="filament">
                  <SelectValue placeholder="Selecione um filamento" />
                </SelectTrigger>
                <SelectContent>
                  {filaments.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Adicione filamentos na aba Filamentos
                    </div>
                  )}
                  {filaments.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.type} {f.color} - {f.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="printer">Impressora</Label>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger id="printer">
                  <SelectValue placeholder="Selecione uma impressora" />
                </SelectTrigger>
                <SelectContent>
                  {printers.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Adicione impressoras na aba Impressoras
                    </div>
                  )}
                  {printers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parâmetros da Impressão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weight">Peso da Peça (g)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                placeholder="Ex: 50"
              />
            </div>

            <div>
              <Label htmlFor="printTime">Tempo de Impressão (h)</Label>
              <Input
                id="printTime"
                type="number"
                step="0.1"
                value={printTimeHours}
                onChange={(e) => setPrintTimeHours(e.target.value)}
                placeholder="Ex: 2.5"
              />
            </div>

            <div>
              <Label htmlFor="postProcessing">Tempo de Pós-Processamento (min)</Label>
              <Input
                id="postProcessing"
                type="number"
                value={postProcessingMinutes}
                onChange={(e) => setPostProcessingMinutes(e.target.value)}
                placeholder="Ex: 15"
              />
            </div>

            <div>
              <Label htmlFor="margin">Margem de Lucro (%)</Label>
              <Input
                id="margin"
                type="number"
                step="1"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Resultado do Cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Custo de Material:</span>
                <span className="font-medium">{formatCurrency(result.materialCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Custo de Energia:</span>
                <span className="font-medium">{formatCurrency(result.energyCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Depreciação:</span>
                <span className="font-medium">{formatCurrency(result.depreciationCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mão de Obra:</span>
                <span className="font-medium">{formatCurrency(result.laborCost)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-semibold">
                <span>Custo Total:</span>
                <span>{formatCurrency(result.totalCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Preço de Venda:</span>
                <span>{formatCurrency(result.sellingPrice)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calculator;
