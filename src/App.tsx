import { useState } from "react";

import CanvasContainer from "./components/CanvasContainer";
import ControlsPanel from "./components/ControlsPanel";
import ConsolePanel from "./components/ConsolePanel";

import "./style.css";

export default function App() {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(1000);
  const [timeStep, setTimeStep] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  const handleRun = () => {
    setIsRunning(true);
    log("Simulation started.");
  };

  const handleStop = () => {
    setIsRunning(false);
    log("Simulation stopped.");
  };

  const handleClear = () => {
    log("Circuit cleared.");
  };

  return (
    <div className="app-container">
      <CanvasContainer />
      <ControlsPanel
        voltage={voltage}
        setVoltage={setVoltage}
        resistance={resistance}
        setResistance={setResistance}
        timeStep={timeStep}
        setTimeStep={setTimeStep}
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onClear={handleClear}
      />
      <ConsolePanel logs={logs} />
    </div>
  );
}
