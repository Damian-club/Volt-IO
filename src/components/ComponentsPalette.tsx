import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { type ComponentType, COMPONENT_METADATA } from '../@types/component-metadata.types';

interface ComponentsPaletteProps {
  onAddComponent: (type: ComponentType) => void;
}

const COMPONENT_CATEGORIES = [
  {
    name: 'Componentes Pasivos',
    components: [
      { type: 'resistor' as ComponentType, label: 'Resistor', icon: '⎍', color: '#D4A574' },
      { type: 'capacitor' as ComponentType, label: 'Capacitor', icon: '║', color: '#6B8E23' },
      { type: 'coil' as ComponentType, label: 'Inductor', icon: '◉', color: '#16A085' },
    ],
  },
  {
    name: 'Fuentes de Energía',
    components: [
      { type: 'voltageSource' as ComponentType, label: 'Voltage Source', icon: '🔋', color: '#4A90E2' },
    ],
  },
  {
    name: 'Semiconductores',
    components: [
      { type: 'led' as ComponentType, label: 'LED', icon: '◆', color: '#E74C3C' },
      { type: 'diode' as ComponentType, label: 'Diode', icon: '▶', color: '#9B59B6' },
      { type: 'transistor_npn' as ComponentType, label: 'NPN Transistor', icon: '▶', color: '#34495E' },
      { type: 'transistor_mosfet' as ComponentType, label: 'MOSFET', icon: '▶', color: '#34495E' },
    ],
  },
  {
    name: 'Control',
    components: [
      { type: 'switch' as ComponentType, label: 'Switch', icon: '⚡', color: '#F39C12' },
    ],
  },
];

export function ComponentsPalette({ onAddComponent }: ComponentsPaletteProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-slate-100">Componentes</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {COMPONENT_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-xs text-slate-400 mb-2 px-1">
                {category.name}
              </h3>
              <div className="space-y-1">
                {category.components.map((component) => (
                  <Button
                    key={component.type}
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-slate-100 hover:bg-slate-800 h-auto py-3"
                    onClick={() => onAddComponent(component.type)}
                  >
                    <span 
                      className="text-xl mr-3 w-8 h-8 flex items-center justify-center rounded"
                      style={{ backgroundColor: `${component.color}33`, color: component.color }}
                    >
                      {component.icon}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{component.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
              {idx < COMPONENT_CATEGORIES.length - 1 && (
                <Separator className="mt-4 bg-slate-800" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <p>Click para agregar al circuito</p>
        <p className="mt-1">Arrastra para posicionar</p>
      </div>
    </div>
  );
}
