import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSettings, saveSettings } from '@/lib/storage';
import { toast } from 'sonner';

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

    toast.success('Configurações salvas com sucesso');
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground">Ajuste os parâmetros de cálculo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Custos Padrão</CardTitle>
            <CardDescription>Configure os valores utilizados nos cálculos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="energy">Custo de Energia (R$/kWh)</Label>
              <Input
                id="energy"
                type="number"
                step="0.01"
                value={formData.energyCostKWh}
                onChange={(e) => setFormData({ ...formData, energyCostKWh: e.target.value })}
                placeholder="Ex: 0.92"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio cobrado pela concessionária de energia
              </p>
            </div>

            <div>
              <Label htmlFor="labor">Valor Padrão Mão de Obra (R$/h)</Label>
              <Input
                id="labor"
                type="number"
                step="0.01"
                value={formData.defaultLaborCostPerHour}
                onChange={(e) => setFormData({ ...formData, defaultLaborCostPerHour: e.target.value })}
                placeholder="Ex: 25.00"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Custo por hora de pós-processamento (lixamento, pintura, etc)
              </p>
            </div>

            <Button onClick={handleSave} className="w-full">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sobre o App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Custo3D Pro</strong> v1.0</p>
            <p>Calculadora profissional de custos de impressão 3D</p>
            <p className="text-xs mt-4">
              Desenvolvido com React, TypeScript e Tailwind CSS
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
