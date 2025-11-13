import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPrinters, savePrinters } from '@/lib/storage';
import { PrinterProfile } from '@/types';
import { toast } from 'sonner';

const Printers = () => {
  const [printers, setPrinters] = useState<PrinterProfile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterProfile | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    acquisitionCost: '',
    powerConsumptionWatts: '',
    estimatedLifespanHours: '20000',
  });

  useEffect(() => {
    setPrinters(getPrinters());
  }, []);

  const handleOpenDialog = (printer?: PrinterProfile) => {
    if (printer) {
      setEditingPrinter(printer);
      setFormData({
        name: printer.name,
        acquisitionCost: printer.acquisitionCost.toString(),
        powerConsumptionWatts: printer.powerConsumptionWatts.toString(),
        estimatedLifespanHours: printer.estimatedLifespanHours.toString(),
      });
    } else {
      setEditingPrinter(null);
      setFormData({
        name: '',
        acquisitionCost: '',
        powerConsumptionWatts: '',
        estimatedLifespanHours: '20000',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.acquisitionCost || !formData.powerConsumptionWatts) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newPrinter: PrinterProfile = {
      id: editingPrinter?.id || `ptr_${Date.now()}`,
      name: formData.name,
      acquisitionCost: parseFloat(formData.acquisitionCost),
      powerConsumptionWatts: parseInt(formData.powerConsumptionWatts),
      estimatedLifespanHours: parseInt(formData.estimatedLifespanHours),
    };

    let updatedPrinters;
    if (editingPrinter) {
      updatedPrinters = printers.map(p => p.id === editingPrinter.id ? newPrinter : p);
      toast.success('Impressora atualizada com sucesso');
    } else {
      updatedPrinters = [...printers, newPrinter];
      toast.success('Impressora adicionada com sucesso');
    }

    savePrinters(updatedPrinters);
    setPrinters(updatedPrinters);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedPrinters = printers.filter(p => p.id !== id);
    savePrinters(updatedPrinters);
    setPrinters(updatedPrinters);
    toast.success('Impressora removida com sucesso');
  };

  const getDepreciationPerHour = (printer: PrinterProfile) => {
    return (printer.acquisitionCost / printer.estimatedLifespanHours).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Impressoras</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus equipamentos</p>
          </div>
          <Button onClick={() => handleOpenDialog()} size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {printers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma impressora cadastrada. Clique em + para adicionar.
              </CardContent>
            </Card>
          ) : (
            printers.map((printer) => (
              <Card key={printer.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{printer.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Custo: R$ {printer.acquisitionCost.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Consumo: {printer.powerConsumptionWatts}W
                      </p>
                      <p className="text-sm text-primary mt-1">
                        R$ {getDepreciationPerHour(printer)}/h depreciação
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(printer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(printer.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPrinter ? 'Editar Impressora' : 'Adicionar Impressora'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da impressora
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ender 3 V2"
                />
              </div>
              <div>
                <Label htmlFor="cost">Custo de Aquisição (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.acquisitionCost}
                  onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                  placeholder="Ex: 1500.00"
                />
              </div>
              <div>
                <Label htmlFor="power">Consumo de Energia (W)</Label>
                <Input
                  id="power"
                  type="number"
                  value={formData.powerConsumptionWatts}
                  onChange={(e) => setFormData({ ...formData, powerConsumptionWatts: e.target.value })}
                  placeholder="Ex: 350"
                />
              </div>
              <div>
                <Label htmlFor="lifespan">Vida Útil Estimada (horas)</Label>
                <Input
                  id="lifespan"
                  type="number"
                  value={formData.estimatedLifespanHours}
                  onChange={(e) => setFormData({ ...formData, estimatedLifespanHours: e.target.value })}
                  placeholder="Ex: 20000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingPrinter ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Printers;
