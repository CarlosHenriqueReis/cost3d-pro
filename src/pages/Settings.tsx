import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSettings, saveSettings } from '@/lib/storage';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Zap, DollarSign, Info } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    energyCostKWh: '0.92',
    defaultLaborCostPerHour: '25.00',
  });

  useEffect(() => {
    const settings = getSettings();
    setFormData({
      energyCostKWh: settings.energyCostKWh.toString(),
      defaultLaborCostPerHour: settings.defaultLaborCostPerHour.toString(),
    });
  }, []);

  const handleSave = () => {
    if (!formData.energyCostKWh || !formData.defaultLaborCostPerHour) {
      toast.error('Preencha todos os campos');
      return;
    }

    saveSettings({
      energyCostKWh: parseFloat(formData.energyCostKWh),
      defaultLaborCostPerHour: parseFloat(formData.defaultLaborCostPerHour),
    });

    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-8 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Personalize seu app</p>
        </div>

        <Card className="glass-card mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Custos Padrão
            </CardTitle>
            <CardDescription>Configure os valores utilizados nos cálculos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="energy" className="flex items-center gap-2 text-sm font-medium">
                <Zap className="w-4 h-4 text-primary" />
                Custo de Energia (R$/kWh)
              </Label>
              <Input
                id="energy"
                type="number"
                step="0.01"
                value={formData.energyCostKWh}
                onChange={(e) => setFormData({ ...formData, energyCostKWh: e.target.value })}
                placeholder="Ex: 0.92"
                className="bg-input h-12 text-lg"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Valor médio cobrado pela concessionária de energia
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labor" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-primary" />
                Valor Padrão Mão de Obra (R$/h)
              </Label>
              <Input
                id="labor"
                type="number"
                step="0.01"
                value={formData.defaultLaborCostPerHour}
                onChange={(e) => setFormData({ ...formData, defaultLaborCostPerHour: e.target.value })}
                placeholder="Ex: 25.00"
                className="bg-input h-12 text-lg"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Custo por hora de pós-processamento (lixamento, pintura, etc)
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 transition-all"
            >
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-xl">Sobre o App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Versão:</span>
              <span className="font-semibold text-primary">1.0</span>
            </div>
            <div className="h-px bg-white/10" />
            <p className="text-muted-foreground">
              <strong className="text-foreground gradient-text">Custo3D Pro</strong> - Calculadora profissional de custos de impressão 3D
            </p>
            <div className="h-px bg-white/10" />
            <p className="text-xs text-muted-foreground">
              Desenvolvido com React, TypeScript e Tailwind CSS
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
