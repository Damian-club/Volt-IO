type Props = {
  voltage: number;
  setVoltage: (v: number) => void;
  resistance: number;
  setResistance: (r: number) => void;
  timeStep: number;
  setTimeStep: (t: number) => void;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
};

export default function ControlsPanel({
  voltage,
  setVoltage,
  resistance,
  setResistance,
  timeStep,
  setTimeStep,
  isRunning,
  onRun,
  onStop,
  onClear,
}: Props) {
  return (
    <div id="controls">
      <h2>Circuit Simulator</h2>

      <h3>Add Components</h3>
      <label>Voltage (V):</label>
      <input
        type="number"
        value={voltage}
        step={0.1}
        onChange={(e) => setVoltage(parseFloat(e.target.value))}
      />
      <button className="btn-add" onClick={() => console.log("+ Voltage Source")}>
        + Voltage Source
      </button>

      <label>Resistance (Ω):</label>
      <input
        type="number"
        value={resistance}
        step={100}
        onChange={(e) => setResistance(parseFloat(e.target.value))}
      />
      <button className="btn-add" onClick={() => console.log("+ Resistor")}>
        + Resistor
      </button>

      <h3>Simulation</h3>
      {isRunning ? (
        <button className="btn-stop" onClick={onStop}>
          ⏸ Stop
        </button>
      ) : (
        <button className="btn-run" onClick={onRun}>
          ▶ Run
        </button>
      )}
      <button className="btn-clear" onClick={onClear}>
        Clear Circuit
      </button>

      <label>Time Step (ms):</label>
      <input
        type="number"
        value={timeStep}
        min={10}
        onChange={(e) => setTimeStep(parseInt(e.target.value))}
      />
    </div>
  );
}
