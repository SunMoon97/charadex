import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-3">
        Charadex 🎭
      </h1>
      <p className="text-xl text-gray-300 font-medium tracking-wide">
        Act it out. Guess it right.
      </p>
    </motion.header>
  );
}