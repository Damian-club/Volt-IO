import { MousePointer2, Cable, Trash2, Grid3x3, RotateCcw, Save, Upload, Play, Pause, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface ToolbarProps {
  tool: 'select' | 'wire' | 'delete';
  onToolChange: (tool: 'select' | 'wire' | 'delete') => void;
  gridVisible: boolean;
  onGridToggle: () => void;
  onClear: () => void;
  isRunning?: boolean;
  isPaused?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function Toolbar({ 
  tool, 
  onToolChange, 
  gridVisible, 
  onGridToggle, 
  onClear,
  isRunning = false,
  isPaused = false,
  onStart,
  onPause,
  onResume,
  onStop,
}: ToolbarProps) {
  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
      <div className="text-slate-100">
        <span className="mr-2">Volt I/O</span>
      </div>
      
      <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />
      
      <TooltipProvider>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === 'select' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onToolChange('select')}
                className={tool === 'select' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'}
              >
                <MousePointer2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Seleccionar (V)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === 'wire' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onToolChange('wire')}
                className={tool === 'wire' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'}
              >
                <Cable className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Conectar (W)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === 'delete' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onToolChange('delete')}
                className={tool === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eliminar (D)</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onGridToggle}
              className={`${gridVisible ? 'text-blue-400' : 'text-slate-300'} hover:text-slate-100 hover:bg-slate-800`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid (G)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1" />

      <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />

      <TooltipProvider>
        <div className="flex gap-1">
          {!isRunning ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onStart}
                  className="text-green-400 hover:text-green-300 hover:bg-slate-800"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start Simulation</TooltipContent>
            </Tooltip>
          ) : isPaused ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onResume}
                  className="text-green-400 hover:text-green-300 hover:bg-slate-800"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resume Simulation</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPause}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-slate-800"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pause Simulation</TooltipContent>
            </Tooltip>
          )}

          {isRunning && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onStop}
                  className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                >
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop Simulation</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-8 bg-slate-700 mx-2" />

      <TooltipProvider>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Limpiar todo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Guardar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cargar</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
