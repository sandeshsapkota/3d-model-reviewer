import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import { useNavigationContext } from "@/ModelsReviewer/context/NavigationProvider.tsx";

const SceneLoader = () => {
  const { progress, active } = useProgress();
  const { activeModel } = useNavigationContext();
  const [shouldRender, setShouldRender] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const isFirstLoad = useRef(true);
  const visitedModels = useRef<Set<string>>(new Set());

  const lastModel = useRef(activeModel);

  // Handle Visibility and Transitions
  useEffect(() => {
    const isNewModel = activeModel && !visitedModels.current.has(activeModel);
    const modelChanged = activeModel !== lastModel.current;
    
    // Rule 1: Always show on first startup
    // Rule 2: Show on navigation if it's a new model we haven't seen yet
    if (isFirstLoad.current || (modelChanged && isNewModel)) {
      setShouldRender(true);
      setOpacity(1);
      lastModel.current = activeModel;
    }

    // Hide logic
    if (progress === 100 && !active) {
      // Record this model as visited once the load is fully confirmed
      if (activeModel) visitedModels.current.add(activeModel);
      
      const timer = setTimeout(() => {
        setOpacity(0);
        const hideTimer = setTimeout(() => {
          setShouldRender(false);
          isFirstLoad.current = false;
        }, 1000); 
        return () => clearTimeout(hideTimer);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active, progress, activeModel]);

  if (!shouldRender && !active) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-zinc-50/95 backdrop-blur-md"
      style={{
        opacity,
        transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: opacity === 0 ? 'none' : 'auto'
      }}
    >
      <div className="relative flex flex-col items-center max-w-md w-full px-12">
        {/* Animated Icon */}
        <div className="mb-16 relative">
          <div className="w-24 h-24 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-3xl rotate-45 animate-[spin_8s_linear_infinite]"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl rotate-45 flex items-center justify-center shadow-2xl shadow-indigo-200">
              <div className="-rotate-45 text-white font-bold text-2xl tracking-tighter">3D</div>
            </div>
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-purple-500 rounded-full shadow-lg border-4 border-zinc-50 animate-bounce"></div>
            <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-indigo-400 rounded-full shadow-lg border-2 border-zinc-50 animate-pulse delay-75"></div>
          </div>
        </div>

        {isFirstLoad.current && (
          <>
            {/* Minimal Progress Indicator */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="inline-flex items-center justify-center px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                <span className="text-[11px] font-bold text-indigo-600 tracking-[0.2em] uppercase">
                  {Math.round(progress)}% Loaded
                </span>
              </div>
            </div>

            {/* Progress bar container */}
            <div className="w-full h-1 bg-zinc-200/50 rounded-full overflow-hidden relative shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] animate-in fade-in zoom-in-95 duration-1000">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] transition-all duration-300 ease-out animate-[gradient_3s_linear_infinite]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Decorative ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
      `}</style>
    </div>
  );
};

export default SceneLoader;
