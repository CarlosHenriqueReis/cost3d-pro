import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFilaments, getPrinters, getSettings } from '@/lib/storage';
import { calculateCost, formatCurrency } from '@/lib/calculator';
import { Filament, PrinterProfile } from '@/types';
import { Sparkles, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.png';

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
    <div className="min-h-screen bg-background pb-24 px-4 pt-8 animate-fade-in">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex flex-col items-center gap-3 mb-3">
            <img src={logo} alt="Custo3D Pro" className="w-20 h-20" />
            <h1 className="text-3xl font-bold gradient-text">Calculadora de Custos</h1>
          </div>
          <p className="text-muted-foreground">Calcule seus custos de impressão</p>
        </div>

        {/* Equipment Selection */}
        <Card className="glass-card border-white/10 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Equipamento
            </CardTitle>
            <CardDescription>Selecione filamento e impressora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filament" className="text-sm font-medium">Filamento</Label>
              <Select value={selectedFilament} onValueChange={setSelectedFilament}>
                <SelectTrigger id="filament" className="bg-input/50 border-white/10 h-12">
                  <SelectValue placeholder="Escolha o filamento" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {filaments.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      Adicione filamentos na aba Filamentos
                    </div>
                  )}
                  {filaments.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="cursor-pointer">
                      <span className="font-medium">{f.type} {f.color}</span> - {f.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="printer" className="text-sm font-medium">Impressora</Label>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger id="printer" className="bg-input/50 border-white/10 h-12">
                  <SelectValue placeholder="Escolha a impressora" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {printers.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      Adicione impressoras na aba Impressoras
                    </div>
                  )}
                  {printers.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parameters */}
        <Card className="glass-card border-white/10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Parâmetros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">Peso da Peça (g)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                placeholder="Ex: 50"
                className="bg-input/50 border-white/10 h-12 text-lg focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="printTime" className="text-sm font-medium">Tempo de Impressão (h)</Label>
              <Input
                id="printTime"
                type="number"
                step="0.1"
                value={printTimeHours}
                onChange={(e) => setPrintTimeHours(e.target.value)}
                placeholder="Ex: 2.5"
                className="bg-input/50 border-white/10 h-12 text-lg focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postProcessing" className="text-sm font-medium">Pós-Processamento (min)</Label>
              <Input
                id="postProcessing"
                type="number"
                value={postProcessingMinutes}
                onChange={(e) => setPostProcessingMinutes(e.target.value)}
                placeholder="Ex: 15"
                className="bg-input/50 border-white/10 h-12 text-lg focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin" className="text-sm font-medium">Margem de Lucro (%)</Label>
              <Input
                id="margin"
                type="number"
                step="1"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                placeholder="Ex: 30"
                className="bg-input/50 border-white/10 h-12 text-lg focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="glass-card border-primary/30 glow-border animate-scale-in bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" />
                Resultado do Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Material:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.materialCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Energia:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.energyCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Depreciação:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.depreciationCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mão de Obra:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.laborCost)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Custo Total:</span>
                <span className="font-bold text-lg">{formatCurrency(result.totalCost)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                <span className="font-bold text-lg">Preço de Venda:</span>
                <span className="font-bold text-2xl text-primary drop-shadow-[0_0_10px_rgba(0,123,255,0.5)]">
                  {formatCurrency(result.sellingPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calculator;
