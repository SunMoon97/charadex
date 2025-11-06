import type { Movie } from '../data/movies';

// Read TMDB API key from Vite env (VITE_TMDB_API_KEY). Ensure you added it to your .env
const TMDB_API_KEY = (import.meta.env.VITE_TMDB_API_KEY as string) || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string;
  release_date: string;
  original_language: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
}
export const getMovies = async (industry: 'all' | 'hollywood' | 'bollywood' | 'other' = 'all') => {
  let language: string | undefined;
  let region: string | undefined;
  let originalLanguage: string | undefined;

  // Request English titles for display in all cases, but filter original language
  switch (industry) {
    case 'bollywood':
      // We want original Hindi movies but English titles
      language = 'en';
      region = 'IN';
      originalLanguage = 'hi';
      break;
    case 'hollywood':
      language = 'en';
      region = 'US';
      originalLanguage = 'en';
      break;
    case 'other':
      // international; request English titles
      language = 'en';
      region = undefined;
      originalLanguage = undefined;
      break;
    case 'all':
    default:
      language = 'en';
      region = undefined;
      originalLanguage = undefined;
  }

  if (!TMDB_API_KEY) {
    console.warn('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file. Falling back to empty results.');
    return [] as Movie[];
  }

  try {
    const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
    url.searchParams.set('api_key', TMDB_API_KEY);
  if (language) url.searchParams.set('language', language);
  if (region) url.searchParams.set('region', region);
  if (originalLanguage) url.searchParams.set('with_original_language', originalLanguage);
    url.searchParams.set('sort_by', 'popularity.desc');
    url.searchParams.set('include_adult', 'true');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data: TMDBResponse = await response.json();

    const mappedMovies: Movie[] = data.results.map((movie) => {
      // Safely parse year from release_date (may be empty)
      const year = movie.release_date && movie.release_date.length >= 4
        ? Number(movie.release_date.slice(0, 4)) || new Date().getFullYear()
        : new Date().getFullYear();

      // derive industry from original_language for consistency
      const derivedIndustry: Movie['industry'] = movie.original_language === 'hi'
        ? 'bollywood'
        : movie.original_language === 'en'
          ? 'hollywood'
          : 'other';

      // Keep both original_title and localized title. Prefer original_title for display when available.
      const localizedTitle = movie.title;
      const originalTitle = movie.original_title && movie.original_title.trim().length > 0
        ? movie.original_title
        : undefined;

  const displayTitle = originalTitle || localizedTitle || movie.title;

      return {
        id: movie.id,
        title: displayTitle,
        originalTitle,
        localizedTitle,
        posterUrl: movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : '',
        year,
        industry: derivedIndustry,
      } as Movie;
    });

    return mappedMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [] as Movie[];
  }
};

// Options for getRandomMovie
interface GetRandomMovieOpts {
  language?: string; // e.g. 'en'
  region?: string; // e.g. 'IN' or 'US'
  originalLanguage?: string; // filter original language e.g. 'hi' or 'en'
  includeAdult?: boolean; // include_adult param
  pageMax?: number; // max page number to randomly pick from (TMDB allows up to 500)
  attempts?: number; // how many times to retry if results are empty
}

/**
 * Fetches a random page from TMDB discover and returns a random movie from that page.
 * Keeps the existing query params and picks a random page between 1 and pageMax.
 * Returns a Movie mapped to the local Movie type, or null if nothing found after attempts.
 */
export const getRandomMovie = async (opts: GetRandomMovieOpts = {}) => {
  const {
    language = 'en',
    region,
    originalLanguage,
    includeAdult = false,
    pageMax = 500,
    attempts = 10,
  } = opts;

  if (!TMDB_API_KEY) {
    console.warn('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file. getRandomMovie will return null.');
    return null;
  }

  // helper to pick a random integer between min and max inclusive
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const page = Math.max(1, Math.min(pageMax, randInt(1, pageMax)));

    try {
      const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
      url.searchParams.set('api_key', TMDB_API_KEY);
      if (language) url.searchParams.set('language', language);
      if (region) url.searchParams.set('region', region);
      if (originalLanguage) url.searchParams.set('with_original_language', originalLanguage);
      url.searchParams.set('sort_by', 'popularity.desc');
      url.searchParams.set('include_adult', includeAdult ? 'true' : 'false');
      url.searchParams.set('page', String(page));

      const res = await fetch(url.toString());
      if (!res.ok) {
        // try again on next attempt
        console.warn(`TMDB discover request failed: ${res.status} ${res.statusText}`);
        continue;
      }

      const data: TMDBResponse = await res.json();
      const results = data?.results ?? [];
      if (!results || results.length === 0) {
        // try next attempt
        continue;
      }

      // pick a random movie from the page results
      const tm = results[Math.floor(Math.random() * results.length)];

      if (!tm) continue;

      const localizedTitle = tm.title;
      const originalTitle = tm.original_title && tm.original_title.trim().length > 0 ? tm.original_title : undefined;
      const displayTitle = localizedTitle || originalTitle || tm.title || 'Untitled';
      const posterUrl = tm.poster_path ? `${POSTER_BASE_URL}${tm.poster_path}` : '';
      const year = tm.release_date && tm.release_date.length >= 4 ? Number(tm.release_date.slice(0, 4)) || new Date().getFullYear() : new Date().getFullYear();
      const derivedIndustry: Movie['industry'] = tm.original_language === 'hi' ? 'bollywood' : tm.original_language === 'en' ? 'hollywood' : 'other';

      const mapped: Movie = {
        id: tm.id,
        title: displayTitle,
        originalTitle,
        localizedTitle,
        posterUrl,
        year,
        industry: derivedIndustry,
      } as Movie;

      return mapped;
    } catch (err) {
      console.error('Error fetching random TMDB page:', err);
      // continue to next attempt
      continue;
    }
  }

  // nothing found after attempts
  return null;
};