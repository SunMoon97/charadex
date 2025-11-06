
interface ControlsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  isLoading?: boolean;
}

export default function Controls({ duration, onDurationChange }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Duration Slider */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[320px] px-4">
        <label className="text-gray-300 text-sm font-medium">Timer Duration</label>
        <div className="w-full">
          <input
            type="range"
            min={5}
            max={300}
            step={5}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full appearance-none h-2 rounded-lg bg-gray-700 accent-purple-500 cursor-pointer"
          />
          <div className="relative flex justify-between text-xs text-gray-400 mt-2">
            <span>5s</span>
            <span className="absolute left-[33%]">1m</span>
            <span className="absolute left-[66%]">3m</span>
            <span>5m</span>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {[15,30,60,120,300].map((s) => (
            <button 
              key={s} 
              onClick={() => onDurationChange(s)} 
              className="px-3 py-1.5 rounded-md bg-gray-700 text-sm text-gray-200 hover:bg-gray-600 transition-colors min-w-[48px]"
            >
              {s >= 60 ? `${s/60}m` : `${s}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Controls no longer render shuffle button here; shuffle is placed next to the poster for better mobile layout */}
    </div>
  );
}