import { useEffect, useRef, useCallback } from "react";
import { useSimulationStore } from "../store/simulationStore";
import { useCircuitStore } from "../store/circuitStore";
import Simulator from "../@core/Simulator";

export function useSimulation() {
  const {
    simulator,
    state,
    isInitialized,
    initialize,
    start,
    pause,
    resume,
    stop,
    step,
    updateState,
  } = useSimulationStore();

  const { components } = useCircuitStore();
  const animationFrameRef = useRef<number | null>(null);

  // Initialize simulator when components change
  useEffect(() => {
    if (!isInitialized) {
      const sim = new Simulator();
      
      // Add all components to simulator
      components.forEach((comp) => {
        sim.addComponent(comp.component);
      });

      sim.assignVoltageSourceIndices();
      initialize(sim);
    }
  }, [components, isInitialized, initialize]);

  // Run simulation loop
  useEffect(() => {
    if (!state.isRunning || state.isPaused || !simulator) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const runStep = () => {
      if (!simulator || !state.isRunning || state.isPaused) return;

      const stepsPerFrame = 10;
      step(state.dt, stepsPerFrame);

      animationFrameRef.current = requestAnimationFrame(runStep);
    };

    animationFrameRef.current = requestAnimationFrame(runStep);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, simulator, step, state.dt]);

  const handleStart = useCallback(
    (dt?: number) => {
      start(dt);
    },
    [start]
  );

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  return {
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentTime: state.currentTime,
    step: state.step,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    stop: handleStop,
    updateState,
    simulator,
  };
}

