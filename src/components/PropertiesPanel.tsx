import { type CircuitComponent3D } from '../@types/circuit.types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { Trash2 } from 'lucide-react';
import { useComponentSelection } from '../hooks/useComponentSelection';

interface PropertiesPanelProps {
  components: CircuitComponent3D[];
  onUpdate: (id: string, properties: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

export function PropertiesPanel({ components, onUpdate, onDelete }: PropertiesPanelProps) {
  const { selectedComponent } = useComponentSelection();

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Select a component to edit properties</p>
      </div>
    );
  }

  const updatePosition = (axis: 0 | 1 | 2, value: number) => {
    const newPosition = [...selectedComponent.position] as [number, number, number];
    newPosition[axis] = value;
    // Position is handled by moveComponent, not updateComponentProperties
    // This would need to be handled differently
  };

  const updateProperty = (key: string, value: any) => {
    onUpdate(selectedComponent.id, {
      [key]: value,
    });
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-slate-100">Properties</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Type</span>
            <span className="text-sm text-slate-100 capitalize">{selectedComponent.type}</span>
          </div>
        </div>

        {(selectedComponent.type === 'resistor' || selectedComponent.type === 'capacitor' || selectedComponent.type === 'coil') && (
          <div className="space-y-2">
            <Label htmlFor="value" className="text-slate-300">
              Value {selectedComponent.type === 'resistor' ? '(Ω)' : selectedComponent.type === 'capacitor' ? '(F)' : '(H)'}
            </Label>
            <Input
              id="value"
              type="number"
              value={selectedComponent.properties.value || ''}
              onChange={(e) => updateProperty('value', parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-slate-100"
              placeholder={selectedComponent.type === 'resistor' ? '1000' : selectedComponent.type === 'capacitor' ? '1e-6' : '1e-3'}
            />
          </div>
        )}

        {selectedComponent.type === 'voltageSource' && (
          <div className="space-y-2">
            <Label htmlFor="vdc" className="text-slate-300">DC Voltage (V)</Label>
            <Input
              id="vdc"
              type="number"
              value={selectedComponent.properties.Vdc || ''}
              onChange={(e) => updateProperty('Vdc', parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        )}

        {selectedComponent.type === 'led' && (
          <div className="space-y-2">
            <Label htmlFor="forwardVoltage" className="text-slate-300">Forward Voltage (V)</Label>
            <Input
              id="forwardVoltage"
              type="number"
              value={selectedComponent.properties.forwardVoltage || ''}
              onChange={(e) => updateProperty('forwardVoltage', parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        )}

        {selectedComponent.type === 'switch' && (
          <div className="space-y-2">
            <Label htmlFor="closed" className="text-slate-300">State</Label>
            <select
              id="closed"
              value={selectedComponent.properties.closed ? 'closed' : 'open'}
              onChange={(e) => updateProperty('closed', e.target.value === 'closed')}
              className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-slate-100"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}

        <Separator className="bg-slate-800" />

        <div className="space-y-4">
          <h3 className="text-sm text-slate-400">Position</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">X</Label>
                <span className="text-xs text-slate-400">{selectedComponent.position[0].toFixed(1)}</span>
              </div>
              <Slider
                value={[selectedComponent.position[0]]}
                onValueChange={([value]) => updatePosition(0, value)}
                min={-10}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">Y</Label>
                <span className="text-xs text-slate-400">{selectedComponent.position[1].toFixed(1)}</span>
              </div>
              <Slider
                value={[selectedComponent.position[1]]}
                onValueChange={([value]) => updatePosition(1, value)}
                min={-10}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">Z</Label>
                <span className="text-xs text-slate-400">{selectedComponent.position[2].toFixed(1)}</span>
              </div>
              <Slider
                value={[selectedComponent.position[2]]}
                onValueChange={([value]) => updatePosition(2, value)}
                min={-10}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDelete(selectedComponent.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Component
        </Button>
      </div>
    </div>
  );
}
