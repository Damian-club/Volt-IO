import { type CircuitComponent } from '../App';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ComponentsPaletteProps {
  onAddComponent: (type: CircuitComponent['type']) => void;
}

const COMPONENT_CATEGORIES = [
  {
    name: 'Componentes Pasivos',
    components: [
      { type: 'resistor' as const, label: 'Resistor', icon: '⎍', color: '#D4A574' },
      { type: 'capacitor' as const, label: 'Capacitor', icon: '║', color: '#6B8E23' },
    ],
  },
  {
    name: 'Fuentes de Energía',
    components: [
      { type: 'battery' as const, label: 'Batería', icon: '🔋', color: '#4A90E2' },
    ],
  },
  {
    name: 'Semiconductores',
    components: [
      { type: 'led' as const, label: 'LED', icon: '◆', color: '#E74C3C' },
      { type: 'transistor' as const, label: 'Transistor', icon: '▶', color: '#9B59B6' },
      { type: 'chip' as const, label: 'Chip IC', icon: '▪', color: '#34495E' },
    ],
  },
  {
    name: 'Conexiones',
    components: [
      { type: 'wire' as const, label: 'Cable', icon: '─', color: '#95A5A6' },
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
