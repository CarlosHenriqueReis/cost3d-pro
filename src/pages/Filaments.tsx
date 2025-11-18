import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
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
      toast.success('Filamento atualizado!');
    } else {
      updatedFilaments = [...filaments, newFilament];
      toast.success('Filamento adicionado!');
    }

    saveFilaments(updatedFilaments);
    setFilaments(updatedFilaments);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedFilaments = filaments.filter(f => f.id !== id);
    saveFilaments(updatedFilaments);
    setFilaments(updatedFilaments);
    toast.success('Filamento removido');
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-8 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              Meus Filamentos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Seu inventário de materiais</p>
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
          {filaments.length === 0 ? (
            <Card className="glass-card border-white/10">
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhum filamento cadastrado</p>
                <p className="text-sm text-muted-foreground mt-1">Clique no + para adicionar</p>
              </CardContent>
            </Card>
          ) : (
            filaments.map((filament, index) => (
              <Card key={filament.id} className="glass-card border-white/10 hover:border-primary/30 transition-all hover:glow-border group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-primary/50 group-hover:animate-pulse" />
                        <h3 className="font-bold text-lg text-foreground">
                          {filament.type} {filament.color}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{filament.brand}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          R$ {(filament.spoolPrice / filament.spoolWeightGrams).toFixed(4)}
                        </span>
                        <span className="text-xs text-muted-foreground">/grama</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rolo: R$ {filament.spoolPrice.toFixed(2)} / {filament.spoolWeightGrams}g
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(filament)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(filament.id)}
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
                {editingFilament ? 'Editar Filamento' : 'Novo Filamento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do filamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ex: Esun, Creality"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as Filament['type'] })}>
                  <SelectTrigger id="type" className="bg-input/50 border-white/10 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="PLA">PLA</SelectItem>
                    <SelectItem value="ABS">ABS</SelectItem>
                    <SelectItem value="PETG">PETG</SelectItem>
                    <SelectItem value="TPU">TPU</SelectItem>
                    <SelectItem value="NYLON">NYLON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ex: Preto, Branco, Azul"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço do Rolo (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.spoolPrice}
                  onChange={(e) => setFormData({ ...formData, spoolPrice: e.target.value })}
                  placeholder="Ex: 50.00"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso do Rolo (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.spoolWeightGrams}
                  onChange={(e) => setFormData({ ...formData, spoolWeightGrams: e.target.value })}
                  placeholder="Ex: 1000"
                  className="bg-input/50 border-white/10 h-11"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30">
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
