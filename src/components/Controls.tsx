import { motion } from 'framer-motion';

interface ControlsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  onShuffle: () => void;
  isLoading?: boolean;
}

export default function Controls({ duration, onDurationChange, onShuffle, isLoading = false }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Duration Slider */}
      <div className="flex flex-col items-center gap-3 w-80">
        <label className="text-gray-300 text-sm font-medium">Timer Duration</label>
        <div className="w-full px-2">
          <input
            type="range"
            min={5}
            max={300}
            step={5}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full appearance-none h-2 rounded-lg bg-gray-700 accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>5s</span>
            <span>1m</span>
            <span>2m</span>
            <span>3m</span>
            <span>5m</span>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2 mt-1">
          {[15,30,60,120,300].map((s) => (
            <button key={s} onClick={() => onDurationChange(s)} className="px-3 py-1 rounded-md bg-gray-700 text-sm text-gray-200 hover:bg-gray-600">{s >= 60 ? `${s/60}m` : `${s}s`}</button>
          ))}
        </div>
      </div>

      {/* Shuffle Button */}
      <motion.button
        className="px-8 py-4 rounded-full text-xl font-bold text-white
                   bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500
                   shadow-lg shadow-purple-500/20 hover:shadow-xl
                   hover:shadow-purple-500/30 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onShuffle}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Loading...' : '🎬 Shuffle Movie'}
      </motion.button>
    </div>
  );
}