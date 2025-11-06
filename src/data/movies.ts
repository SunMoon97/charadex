
export interface Movie {
  id: number;
  title: string;
  // original (original_title from TMDB) and localizedTitle (title field from TMDB)
  originalTitle?: string;
  localizedTitle?: string;
  year: number;
  posterUrl: string;
  industry: 'hollywood' | 'bollywood' | 'other';
}

// Default movies in case API fails
export const defaultMovies: Movie[] = [
  {
    id: 27205,
    title: "Inception",
    year: 2010,
    posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    industry: "hollywood"
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: 2008,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    industry: "hollywood"
  },
  {
    id: 20453,
    title: "3 Idiots",
    year: 2009,
    posterUrl: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg",
    industry: "bollywood"
  },
  {
    id: 871111,
    title: "RRR",
    year: 2022,
    posterUrl: "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg",
    industry: "other"
  },
  {
    id: 864692,
    title: "Pathaan",
    year: 2023,
    posterUrl: "https://image.tmdb.org/t/p/w500/m1b9toKYyCVqFKjz5Lt0jFfxH9y.jpg",
    industry: "bollywood"
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    year: 2019,
    posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    industry: "hollywood"
  },
  {
    id: 360814,
    title: "Dangal",
    year: 2016,
    posterUrl: "https://image.tmdb.org/t/p/w500/aJ11CeHnnK5taiVBWoaH5bYDC8x.jpg",
    industry: "bollywood"
  },
  {
    id: 496243,
    title: "Parasite",
    year: 2019,
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    industry: "other"
  },
  {
    id: 297222,
    title: "PK",
    year: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/b73RAeOdVeFgpHVYnE8gZePHGfg.jpg",
    industry: "bollywood"
  },
  {
    id: 157336,
    title: "Interstellar",
    year: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    industry: "hollywood"
  }
];