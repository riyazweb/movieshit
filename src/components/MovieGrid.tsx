import MovieCard from "./MovieCard";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  imdbRating?: string;
}

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
}

const MovieGrid = ({ movies, loading }: MovieGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-container aspect-[2/3] rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const filteredMovies = movies.filter(movie => 
    movie.Poster !== "N/A" && movie.Title && movie.Year
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {filteredMovies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          id={movie.imdbID}
          title={movie.Title}
          year={movie.Year}
          poster={movie.Poster}
          imdbRating={movie.imdbRating}
        />
      ))}
    </div>
  );
};

export default MovieGrid;