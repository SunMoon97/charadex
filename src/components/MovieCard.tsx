import { motion } from 'framer-motion';

import type { Movie } from '../data/movies';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      layout
      className="relative rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="group relative w-[300px] h-[450px]">
        <motion.img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          layoutId="moviePoster"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h2
            className="text-3xl font-bold mb-1"
            layoutId="movieTitle"
          >
            {movie.localizedTitle}
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg mb-2"
            layoutId="movieYear"
          >
            {movie.year}
          </motion.p>
          <motion.span
            className={`text-sm px-3 py-1 rounded-full ${
              movie.industry === 'hollywood' ? 'bg-blue-500/50' :
              movie.industry === 'bollywood' ? 'bg-orange-500/50' :
              'bg-purple-500/50'
            }`}
          >
            {movie.industry.charAt(0).toUpperCase() + movie.industry.slice(1)}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}