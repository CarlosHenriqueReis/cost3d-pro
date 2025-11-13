import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFilaments, saveFilaments } from '@/lib/storage';
import { Filament } from '@/types';
import { toast } from 'sonner';

const Filaments = () => {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    type: 'PLA' as Filament['type'],
    color: '',
    spoolPrice: '',
    spoolWeightGrams: '1000',
  });

  useEffect(() => {
    setFilaments(getFilaments());
  }, []);

  const handleOpenDialog = (filament?: Filament) => {
    if (filament) {
      setEditingFilament(filament);
      setFormData({
        brand: filament.brand,
        type: filament.type,
        color: filament.color,
        spoolPrice: filament.spoolPrice.toString(),
        spoolWeightGrams: filament.spoolWeightGrams.toString(),
      });
    } else {
      setEditingFilament(null);
      setFormData({
        brand: '',
        type: 'PLA',
        color: '',
        spoolPrice: '',
        spoolWeightGrams: '1000',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.brand || !formData.color || !formData.spoolPrice) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newFilament: Filament = {
      id: editingFilament?.id || `fil_${Date.now()}`,
      brand: formData.brand,
      type: formData.type,
      color: formData.color,
      spoolPrice: parseFloat(formData.spoolPrice),
      spoolWeightGrams: parseInt(formData.spoolWeightGrams),
    };

    let updatedFilaments;
    if (editingFilament) {
      updatedFilaments = filaments.map(f => f.id === editingFilament.id ? newFilament : f);
      toast.success('Filamento atualizado com sucesso');
    } else {
      updatedFilaments = [...filaments, newFilament];
      toast.success('Filamento adicionado com sucesso');
    }

    saveFilaments(updatedFilaments);
    setFilaments(updatedFilaments);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedFilaments = filaments.filter(f => f.id !== id);
    saveFilaments(updatedFilaments);
    setFilaments(updatedFilaments);
    toast.success('Filamento removido com sucesso');
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Filamentos</h1>
            <p className="text-sm text-muted-foreground">Gerencie seu inventário</p>
          </div>
          <Button onClick={() => handleOpenDialog()} size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {filaments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum filamento cadastrado. Clique em + para adicionar.
              </CardContent>
            </Card>
          ) : (
            filaments.map((filament) => (
              <Card key={filament.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {filament.type} {filament.color}
                      </h3>
                      <p className="text-sm text-muted-foreground">{filament.brand}</p>
                      <p className="text-sm text-primary mt-1">
                        R$ {(filament.spoolPrice / filament.spoolWeightGrams).toFixed(4)}/g
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R$ {filament.spoolPrice.toFixed(2)} / {filament.spoolWeightGrams}g
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(filament)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(filament.id)}
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
                {editingFilament ? 'Editar Filamento' : 'Adicionar Filamento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do filamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ex: Esun, Creality"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Filament['type'] })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="ABS">ABS</SelectItem>
                    <SelectItem value="PETG">PETG</SelectItem>
                    <SelectItem value="TPU">TPU</SelectItem>
                    <SelectItem value="NYLON">NYLON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ex: Preto, Branco, Azul"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço do Rolo (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.spoolPrice}
                  onChange={(e) => setFormData({ ...formData, spoolPrice: e.target.value })}
                  placeholder="Ex: 50.00"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso do Rolo (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.spoolWeightGrams}
                  onChange={(e) => setFormData({ ...formData, spoolWeightGrams: e.target.value })}
                  placeholder="Ex: 1000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingFilament ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Filaments;
