import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import MovieCard from './MovieCard';
import Timer from './Timer';
import Controls from './Controls';
import ParticleBackground from './ParticleBackground';
import { defaultMovies, type Movie } from '../data/movies';
import { getMovies, getRandomMovie } from '../services/tmdb';

type Industry = 'all' | 'hollywood' | 'bollywood' | 'other';

export default function AppLayout() {
  const [duration, setDuration] = useState(60);
  // start paused by default; user must press Start to begin
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('all');
  const [movies, setMovies] = useState<Movie[]>(defaultMovies);
  const [currentMovie, setCurrentMovie] = useState<Movie>(defaultMovies[0]);
  const [resetKey, setResetKey] = useState(0);

  type RandomOpts = { language?: string; region?: string; originalLanguage?: string; includeAdult?: boolean; pageMax?: number; attempts?: number };

    // use a ref to hold latest currentMovie so we don't need to add it to fetch effect deps
    const currentMovieRef = useRef<Movie | null>(currentMovie);

    useEffect(() => {
      currentMovieRef.current = currentMovie;
    }, [currentMovie]);

    // helper: pick a random movie from an array while avoiding repeats using usedIds
    const [usedIds, setUsedIds] = useState<number[]>([]);
    const usedIdsRef = useRef<number[]>(usedIds);
    // helper to update both state and ref synchronously to avoid races between setters and immediate reads
    const updateUsedIds = (updater: number[] | ((prev: number[]) => number[])) => {
      if (typeof updater === 'function') {
        setUsedIds(prev => {
          const next = (updater as (p: number[]) => number[])(prev);
          usedIdsRef.current = next;
          return next;
        });
      } else {
        usedIdsRef.current = updater;
        setUsedIds(updater);
      }
    };
    useEffect(() => { usedIdsRef.current = usedIds; }, [usedIds]);

    const pickRandom = (pool: Movie[], avoid?: Movie) => {
      if (!pool || pool.length === 0) return undefined;
      const unseen = pool.filter(m => !usedIdsRef.current.includes(m.id) && m.id !== avoid?.id);
      const candidates = unseen.length > 0 ? unseen : pool.filter(m => m.id !== avoid?.id);
      if (candidates.length === 0) return pool[Math.floor(Math.random() * pool.length)];
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    useEffect(() => {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const fetchedMovies = await getMovies(selectedIndustry);

          // If API returns nothing, fall back to defaults (optionally filtered by industry)
          let newMovies: Movie[] = [];
          if (fetchedMovies && fetchedMovies.length > 0) {
            newMovies = fetchedMovies;
          } else {
            newMovies = selectedIndustry === 'all'
              ? defaultMovies
              : defaultMovies.filter(m => m.industry === selectedIndustry);
          }

          setMovies(newMovies);

          // remove usedIds that no longer exist in the newMovies list
          updateUsedIds(prev => prev.filter(id => newMovies.some(m => m.id === id)));

          // pick a random current movie from the new set (avoid the previous current movie when possible)
          const random = pickRandom(newMovies, currentMovieRef.current || undefined);
          if (random) {
            setCurrentMovie(random);
            updateUsedIds(prev => Array.from(new Set([...prev, random.id])));
          }
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }, [selectedIndustry]);

    const filteredMovies = movies;

    const getLocalRandomMovie = (): Movie => {
      if (!filteredMovies || filteredMovies.length === 0) return defaultMovies[0];
      // if all movies have been used, reset usedIds (but keep current to avoid immediate repeat)
      const unseen = filteredMovies.filter(m => !usedIdsRef.current.includes(m.id));
      if (unseen.length === 0 && filteredMovies.length > 1) {
        // reset both ref and state immediately to avoid race with pickRandom
        updateUsedIds([]);
      }
      const picked = pickRandom(filteredMovies, currentMovieRef.current || undefined) || filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
      // mark as used (update ref + state)
      updateUsedIds(prev => Array.from(new Set([...prev, picked.id])));
      return picked;
    };

  const handleTimeUp = () => {
    setIsRunning(false);
  };

  const handleShuffle = async () => {
    // Reset timer display immediately (increment resetKey so Timer resets to full duration)
    setResetKey(k => k + 1);
    setIsRunning(false);
    setLoading(true);

    try {
      // Try to fetch a random movie directly from TMDB for more variety
      const opts: RandomOpts = {
        language: 'en',
        includeAdult: true,
        pageMax: 500,
        attempts: 3,
      };

      if (selectedIndustry === 'bollywood') {
        opts.region = 'IN';
        // prefer original Hindi language for selection but request English localized fields
        opts.originalLanguage = 'hi';
      } else if (selectedIndustry === 'hollywood') {
        opts.region = 'US';
        opts.originalLanguage = 'en';
      }

      const apiMovie = await getRandomMovie(opts);
      if (apiMovie) {
        setCurrentMovie(apiMovie);
        // mark as used
        updateUsedIds(prev => Array.from(new Set([...prev, apiMovie.id])));
      } else {
        // fallback to local pool selection
        const local = getLocalRandomMovie();
        setCurrentMovie(local);
      }
    } catch (err) {
      console.error('Shuffle failed, falling back to local selection', err);
      const local = getLocalRandomMovie();
      setCurrentMovie(local);
    } finally {
      // keep timer paused; user should press Start to begin
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full max-w-7xl mx-auto px-4 py-8 
                      flex flex-col items-center justify-center">
        <Header />
        
        {/* Industry Filter */}
  <div className="w-full flex flex-wrap justify-center gap-3 mb-8 px-4">
          {['all', 'hollywood', 'bollywood', 'other'].map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry as Industry)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedIndustry === industry
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {industry.charAt(0).toUpperCase() + industry.slice(1)}
            </button>
          ))}
        </div>

        {/* Game Area */}
        <motion.div 
          className="w-full flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16 mb-8 sm:mb-12 px-2 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Movie poster */}
          <div className="order-1">
            <MovieCard movie={currentMovie} />
          </div>

          {/* Shuffle button: show below poster on mobile and between poster and timer */}
          <div className="order-2 mt-4 md:mt-0 md:order-2 flex items-center justify-center">
            <button
              onClick={handleShuffle}
              disabled={loading}
              className="px-8 py-4 rounded-full text-lg font-bold text-white
                   bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500
                   shadow-lg shadow-purple-500/20 hover:shadow-xl
                   hover:shadow-purple-500/30 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Loading...' : '🎬 Shuffle Movie'}
            </button>
          </div>

          {/* Timer */}
          <div className="order-3 mt-6 md:mt-0">
            <Timer 
              duration={duration}
              onTimeUp={handleTimeUp}
              isRunning={isRunning}
              onStartToggle={(v) => setIsRunning(v)}
              resetKey={resetKey}
            />
          </div>
        </motion.div>
        
        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Controls
            duration={duration}
            onDurationChange={setDuration}
            isLoading={loading}
          />
        </motion.div>
      </div>
      {/* Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-6">
        <div className="w-full text-center mt-6">
          <small className="text-xs text-gray-400">Made with ❤️ for Auction Charcha</small>
        </div>
      </div>
    </div>
  );
}