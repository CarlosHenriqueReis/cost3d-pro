import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Printer as PrinterIcon } from 'lucide-react';
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
      toast.success('Impressora atualizada!');
    } else {
      updatedPrinters = [...printers, newPrinter];
      toast.success('Impressora adicionada!');
    }

    savePrinters(updatedPrinters);
    setPrinters(updatedPrinters);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedPrinters = printers.filter(p => p.id !== id);
    savePrinters(updatedPrinters);
    setPrinters(updatedPrinters);
    toast.success('Impressora removida');
  };

  const getDepreciationPerHour = (printer: PrinterProfile) => {
    return (printer.acquisitionCost / printer.estimatedLifespanHours).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-8 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
              <PrinterIcon className="w-8 h-8 text-primary" />
              Minhas Impressoras
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Seus equipamentos cadastrados</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-110 bg-gradient-to-r from-primary to-accent"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-4">
          {printers.length === 0 ? (
            <Card className="glass-card border-white/10">
              <CardContent className="py-12 text-center">
                <PrinterIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhuma impressora cadastrada</p>
                <p className="text-sm text-muted-foreground mt-1">Clique no + para adicionar</p>
              </CardContent>
            </Card>
          ) : (
            printers.map((printer, index) => (
              <Card key={printer.id} className="glass-card border-white/10 hover:border-primary/30 transition-all hover:glow-border group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-accent/50 group-hover:animate-pulse" />
                        <h3 className="font-bold text-lg text-foreground">{printer.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Custo:</span>
                          <span className="text-sm font-medium">R$ {printer.acquisitionCost.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Consumo:</span>
                          <span className="text-sm font-medium">{printer.powerConsumptionWatts}W</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-2xl font-bold text-primary">
                            R$ {getDepreciationPerHour(printer)}
                          </span>
                          <span className="text-xs text-muted-foreground">/hora</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Depreciação por hora de uso</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(printer)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(printer.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingPrinter ? 'Editar Impressora' : 'Nova Impressora'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da impressora
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ender 3 V2"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Custo de Aquisição (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.acquisitionCost}
                  onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                  placeholder="Ex: 1500.00"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power">Consumo de Energia (W)</Label>
                <Input
                  id="power"
                  type="number"
                  value={formData.powerConsumptionWatts}
                  onChange={(e) => setFormData({ ...formData, powerConsumptionWatts: e.target.value })}
                  placeholder="Ex: 350"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifespan">Vida Útil Estimada (horas)</Label>
                <Input
                  id="lifespan"
                  type="number"
                  value={formData.estimatedLifespanHours}
                  onChange={(e) => setFormData({ ...formData, estimatedLifespanHours: e.target.value })}
                  placeholder="Ex: 20000"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30">
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
