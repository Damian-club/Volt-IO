import { type CircuitComponent } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { Trash2, X } from 'lucide-react';

interface PropertiesPanelProps {
  component: CircuitComponent;
  onUpdate: (updates: Partial<CircuitComponent>) => void;
  onDelete: () => void;
}

export function PropertiesPanel({ component, onUpdate, onDelete }: PropertiesPanelProps) {
  const updatePosition = (axis: 0 | 1 | 2, value: number) => {
    const newPosition = [...component.position] as [number, number, number];
    newPosition[axis] = value;
    onUpdate({ position: newPosition });
  };

  const updateRotation = (axis: 0 | 1 | 2, value: number) => {
    const newRotation = [...component.rotation] as [number, number, number];
    newRotation[axis] = value;
    onUpdate({ rotation: newRotation });
  };

  const updateProperty = (key: string, value: string) => {
    onUpdate({
      properties: {
        ...component.properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-slate-100">Propiedades</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Tipo</span>
            <span className="text-sm text-slate-100 capitalize">{component.type}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label" className="text-slate-300">Etiqueta</Label>
            <Input
              id="label"
              value={component.properties.label || ''}
              onChange={(e) => updateProperty('label', e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        </div>

        {(component.type === 'resistor' || component.type === 'capacitor') && (
          <div className="space-y-2">
            <Label htmlFor="value" className="text-slate-300">
              Valor {component.type === 'resistor' ? '(Ω)' : '(F)'}
            </Label>
            <Input
              id="value"
              value={component.properties.value || ''}
              onChange={(e) => updateProperty('value', e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-100"
              placeholder={component.type === 'resistor' ? '1kΩ' : '100μF'}
            />
          </div>
        )}

        {component.type === 'led' && (
          <div className="space-y-2">
            <Label htmlFor="color" className="text-slate-300">Color</Label>
            <select
              id="color"
              value={component.properties.color || 'red'}
              onChange={(e) => updateProperty('color', e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-slate-100"
            >
              <option value="red">Rojo</option>
              <option value="green">Verde</option>
              <option value="blue">Azul</option>
              <option value="yellow">Amarillo</option>
              <option value="white">Blanco</option>
            </select>
          </div>
        )}

        <Separator className="bg-slate-800" />

        <div className="space-y-4">
          <h3 className="text-sm text-slate-400">Posición</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">X</Label>
                <span className="text-xs text-slate-400">{component.position[0].toFixed(1)}</span>
              </div>
              <Slider
                value={[component.position[0]]}
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
                <span className="text-xs text-slate-400">{component.position[1].toFixed(1)}</span>
              </div>
              <Slider
                value={[component.position[1]]}
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
                <span className="text-xs text-slate-400">{component.position[2].toFixed(1)}</span>
              </div>
              <Slider
                value={[component.position[2]]}
                onValueChange={([value]) => updatePosition(2, value)}
                min={-10}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="space-y-4">
          <h3 className="text-sm text-slate-400">Rotación (grados)</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">X</Label>
                <span className="text-xs text-slate-400">{Math.round(component.rotation[0] * 180 / Math.PI)}°</span>
              </div>
              <Slider
                value={[component.rotation[0] * 180 / Math.PI]}
                onValueChange={([value]) => updateRotation(0, value * Math.PI / 180)}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">Y</Label>
                <span className="text-xs text-slate-400">{Math.round(component.rotation[1] * 180 / Math.PI)}°</span>
              </div>
              <Slider
                value={[component.rotation[1] * 180 / Math.PI]}
                onValueChange={([value]) => updateRotation(1, value * Math.PI / 180)}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">Z</Label>
                <span className="text-xs text-slate-400">{Math.round(component.rotation[2] * 180 / Math.PI)}°</span>
              </div>
              <Slider
                value={[component.rotation[2] * 180 / Math.PI]}
                onValueChange={([value]) => updateRotation(2, value * Math.PI / 180)}
                min={0}
                max={360}
                step={15}
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
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Componente
        </Button>
      </div>
    </div>
  );
}
