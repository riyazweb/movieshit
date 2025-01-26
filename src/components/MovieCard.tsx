import { Link } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  year: string;
  poster: string;
  imdbRating?: string;
}

const MovieCard = ({ id, title, year, poster, imdbRating }: MovieCardProps) => {
  if (poster === "N/A" || !title || !year) return null;

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8.0) return "text-green-500";
    if (numRating >= 7.0) return "text-yellow-500";
    if (numRating >= 6.0) return "text-orange-500";
    return "text-red-500";
  };

  const getRatingCategory = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 9.0) return "Blockbuster/Legendary";
    if (numRating >= 8.0) return "Superhit";
    if (numRating >= 7.0) return "Hit";
    if (numRating >= 6.0) return "Average/Above Average";
    if (numRating >= 5.0) return "Below Average";
    return "Not Recommended";
  };

  return (
    <Link to={`/movie/${id}`} className="movie-card animate-fade-in">
      <div className="relative aspect-[2/3]">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
          <div className="absolute bottom-0 p-4 w-full">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-300">{year}</p>
              {imdbRating && (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className={`${getRatingColor(imdbRating)}`}>{imdbRating}</span>
                  </div>
                  <span className="text-xs text-gray-400">{getRatingCategory(imdbRating)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;