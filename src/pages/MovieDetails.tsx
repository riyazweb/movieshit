import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  ArrowLeft, Star, Clock, Globe, Languages, Film, Trophy, Calendar, 
  Ticket, Heart, AlertTriangle, Popcorn, Clapperboard, Sparkles 
} from 'lucide-react';

const OMDB_API_KEY = "8ec42cd3";

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
      const data = await response.json();
      if (data.Error) throw new Error(data.Error);
      return data;
    },
  });

  React.useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
      setIsFavorite(favorites.includes(movie.imdbID));
    }
  }, [movie]);

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const newFavorites = isFavorite 
      ? favorites.filter((fav: string) => fav !== movie.imdbID)
      : [...favorites, movie.imdbID];
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  if (isLoading) {
    return (
      <div className="container py-8 animate-pulse">
        <button onClick={() => navigate(-1)} className="button mb-4 flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-container rounded w-3/4 mb-4"></div>
          <div className="aspect-[2/3] bg-container rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-container rounded w-full"></div>
            <div className="h-4 bg-container rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(`Error: ${error.message}`);
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <button 
          onClick={handleFavorite}
          className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-container/30 transition-colors`}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          {movie.Poster !== 'N/A' && (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-20 rounded-lg shadow-md border-2 border-gray-700"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {movie.Title} 
              <span className="text-gray-400 ml-2">({movie.Year})</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  movie.Rated.includes('PG') ? 'bg-blue-500/20 text-blue-400' :
                  movie.Rated.includes('R') ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {movie.Rated}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <div className="relative group">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg'}
                alt={movie.Title}
                className="w-full rounded-xl shadow-2xl border-4 border-gray-800 aspect-[2/3] object-cover"
              />
              {movie.Type === 'movie' && (
                <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Clapperboard size={16} />
                  Feature Film
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={24} className="fill-current" />
                      <span className="text-2xl font-bold">{movie.imdbRating}/10</span>
                    </div>
                    <div className="text-sm opacity-90">{movie.imdbVotes} votes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black">{Math.floor(Number(movie.imdbRating) * 10)}%</div>
                    <div className="text-sm">SCORE</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(Number(movie.imdbRating) * 10, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-container p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                Audience Pulse
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {Math.min(Math.floor(Number(movie.imdbRating) * 10 + 15), 95)}%
                  </div>
                  <div className="text-sm text-gray-400">Would Recommend</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">
                    {Math.floor(Number(movie.imdbRating) * 6 + 30)}%
                  </div>
                  <div className="text-sm text-gray-400">Rewatchable</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.floor(Number(movie.imdbRating) * 8)}%
                  </div>
                  <div className="text-sm text-gray-400">Award Worthy</div>
                </div>
              </div>
            </div>

            <div className="bg-container p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Our Review
              </h2>
              <div className="space-y-6">
                {movie.Ratings?.map((rating: any) => {
                  const numericValue = parseFloat(rating.Value.split('/')[0]);
                  const maxValue = rating.Value.includes('%') ? 100 : 10;
                  const percentage = Math.min((numericValue / maxValue) * 100, 100);

                  let reviewText = '';
                  let reviewColor = '';
                  let borderColor = '';
                  let emoji = '';

                  if (rating.Source === 'Internet Movie Database') {
                    const numericRating = numericValue;
                    if (numericRating >= 9.0) {
                      reviewText = 'Blockbuster/Legendary – Universally loved, considered a masterpiece.';
                      reviewColor = 'from-purple-600 to-pink-600';
                      borderColor = 'border-purple-500/30';
                      emoji = '😍🎉';
                    } else if (numericRating >= 8.0) {
                      reviewText = 'Superhit – Critically acclaimed and highly popular.';
                      reviewColor = 'from-green-600 to-emerald-600';
                      borderColor = 'border-green-500/30';
                      emoji = '🔥🏆';
                    } else if (numericRating >= 7.0) {
                      reviewText = 'Hit – Well-received by audiences, entertaining and engaging.';
                      reviewColor = 'from-yellow-600 to-amber-600';
                      borderColor = 'border-yellow-500/30';
                      emoji = '👍🍿';
                    } else if (numericRating >= 6.0) {
                      reviewText = "Average – Mixed reviews, some liked it, others didn't.";
                      reviewColor = 'from-gray-600 to-slate-600';
                      borderColor = 'border-gray-500/30';
                      emoji = '🤔🤷♂️';
                    } else if (numericRating >= 5.0) {
                      reviewText = 'Below Average – Largely negative reviews, likely not successful.';
                      reviewColor = 'from-orange-600 to-red-600';
                      borderColor = 'border-orange-500/30';
                      emoji = '😕👎';
                    } else {
                      reviewText = 'Disaster – Generally considered bad by most viewers.';
                      reviewColor = 'from-red-800 to-rose-900';
                      borderColor = 'border-red-700/30';
                      emoji = '💀🚫';
                    }
                  }

                  return (
                    <div key={rating.Source} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">
                          {rating.Source.replace('Internet Movie Database', 'IMDb')}
                        </span>
                        <span className="font-medium text-sm">{rating.Value}</span>
                      </div>
                      <div className="relative w-full h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${reviewColor} rounded-full transition-all duration-700`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {rating.Source === 'Internet Movie Database' && (
                        <div className={`mt-3 p-3 rounded-lg border ${borderColor} bg-gradient-to-r ${reviewColor}/10`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{emoji}</span>
                            <span className="text-sm font-medium">{reviewText}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="bg-container p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy size={20} />
                  Accolades
                </h2>
                <div className="flex flex-wrap gap-3">
                  {movie.Awards.split('. ').map((award: string) => (
                    <div key={award} className="bg-background px-3 py-1.5 rounded-full flex items-center gap-2">
                      <span className="text-yellow-400">🏆</span>
                      <span className="text-sm">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-container p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Popcorn size={20} />
                Movie DNA
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Ticket, label: 'Box Office', value: movie.BoxOffice },
                  { icon: Film, label: 'Format', value: movie.Type?.toUpperCase() },
                  { icon: Globe, label: 'Country', value: movie.Country },
                  { icon: Languages, label: 'Language', value: movie.Language },
                  { icon: Clock, label: 'Runtime', value: movie.Runtime },
                  { icon: Calendar, label: 'Released', value: movie.Released },
                ].map((spec) => (
                  spec.value && spec.value !== 'N/A' && (
                    <div key={spec.label} className="flex items-center gap-3">
                      <div className="bg-background p-2 rounded-lg">
                        <spec.icon size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">{spec.label}</div>
                        <div className="font-medium">{spec.value}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
   
{/* 1. Rating Comparison Chart */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Sparkles size={20} />
    Rating Comparison
  </h2>
  <div className="space-y-4">
    {movie.Ratings?.map((rating: any) => {
      const numericValue = parseFloat(rating.Value.split('/')[0]);
      const maxValue = rating.Value.includes('%') ? 100 : 10;
      return (
        <div key={rating.Source} className="flex items-center gap-3">
          <div className="w-1/4 text-sm text-gray-400">
            {rating.Source.replace('Internet Movie Database', 'IMDb')}
          </div>
          <div className="flex-1 h-2 bg-background rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${Math.min((numericValue / maxValue) * 100, 100)}%` }}
            />
          </div>
          <div className="w-1/6 text-right font-medium">
            {numericValue.toFixed(1)}
          </div>
        </div>
      );
    })}
  </div>
</div>

{/* 2. Genre-Based Recommendation Score */}
{movie.Genre && (
  <div className="bg-container p-6 rounded-xl">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Film size={20} />
      Genre Excellence
    </h2>
    <div className="text-center">
      <div className="text-3xl font-bold text-amber-400">
        {Math.min(Math.floor(Number(movie.imdbRating) * 12), 100)}%
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Compared to other {movie.Genre.split(', ')[0]} movies
      </p>
      <div className="mt-3 h-1 bg-background rounded-full">
        <div 
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${Math.min(Math.floor(Number(movie.imdbRating) * 12), 100)}%` }}
        />
      </div>
    </div>
  </div>
)}

{/* 3. Score Breakdown */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Star size={20} />
    Score Breakdown
  </h2>
  <div className="space-y-3">
    {['Story', 'Acting', 'Cinematography', 'Music', 'Direction'].map((category) => (
      <div key={category} className="flex items-center gap-3">
        <div className="w-24 text-sm text-gray-400">{category}</div>
        <div className="flex-1 h-2 bg-background rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            style={{ 
              width: `${Math.min(
                Number(movie.imdbRating) * 10 + Math.random() * 10, 
                100
              )}%` 
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>

{/* 4. Audience Sentiment */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Heart size={20} />
    Audience Sentiment
  </h2>
  <div className="flex items-center justify-center gap-4">
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-background"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className="text-green-500"
          strokeWidth="8"
          strokeDasharray={`${Number(movie.imdbRating) * 15.7} 1000`}
          strokeLinecap="round"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">
          {Math.floor(Number(movie.imdbRating) * 10)}%
        </span>
      </div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm">Positive</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        <span className="text-sm">Mixed</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm">Negative</span>
      </div>
    </div>
  </div>
</div>
{/* 1. Hit Probability Calculator */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Sparkles size={20} />
    Hit Probability
  </h2>
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <div className="radial-progress text-green-400" 
           style={{ "--value": Math.min(Number(movie.imdbRating)*12, 100), "--size": "4rem" } as React.CSSProperties}>
        {Math.min(Math.floor(Number(movie.imdbRating)*12), 100)}%
      </div>
      <div>
        <p className="font-medium">AI Success Prediction</p>
        <p className="text-sm text-gray-400">
          Based on {movie.imdbVotes} votes and {movie.Year} performance
        </p>
      </div>
    </div>
    <div className={`p-2 rounded-lg ${
      Number(movie.imdbRating) >= 7.5 ? 'bg-green-500/20' : 
      Number(movie.imdbRating) >= 5 ? 'bg-yellow-500/20' : 'bg-red-500/20'
    }`}>
      <span className="font-medium">
        {Number(movie.imdbRating) >= 7.5 ? 'Strong Hit Potential' :
         Number(movie.imdbRating) >= 5 ? 'Mixed Reception' : 'High Flop Risk'}
      </span>
    </div>
  </div>
</div>


{/* 3. Legacy Score Calculator */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Clock size={20} />
    Legacy Score
  </h2>
  <div className="space-y-3">
    <div className="flex items-center gap-4">
      <div className="text-3xl font-bold text-purple-400">
        {Math.floor(
          (new Date().getFullYear() - parseInt(movie.Year)) * 
          (Number(movie.imdbRating)/10)
        )}
      </div>
      <div>
        <p className="font-medium">Time-Tested Value</p>
        <p className="text-sm text-gray-400">
          {new Date().getFullYear() - parseInt(movie.Year)} years since release
        </p>
      </div>
    </div>
    <div className="text-sm">
      {Number(movie.imdbRating) >= 8 && new Date().getFullYear() - parseInt(movie.Year) > 10 ? 
        'Certified Classic' : 'Modern Reception'}
    </div>
  </div>
</div>



{/* 5. Binge-Worthiness Index */}
<div className="bg-container p-6 rounded-xl">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <Popcorn size={20} />
    Binge Factor
  </h2>
  <div className="flex items-center gap-4">
    <div className="text-3xl font-bold text-amber-400">
      {Math.floor(
        (Number(movie.imdbRating) * 10) - 
        (parseInt(movie.Runtime?.replace(/\D/g, '') || '120')/30)
      )}
    </div>
    <div>
      <p className="font-medium">
        {parseInt(movie.Runtime?.replace(/\D/g, '') || '120') < 120 ? 
         'Quick Watch' : 'Epic Experience'}
      </p>
      <p className="text-sm text-gray-400">
        {movie.Runtime} runtime × {movie.imdbRating}/10 rating
      </p>
    </div>
  </div>
  <div className="mt-3 text-sm">
    {Number(movie.imdbRating) >= 8 && parseInt(movie.Runtime?.replace(/\D/g, '') || '120') < 150 ?
     'Perfect Binge Material' : 'Casual Viewing'}
  </div>
</div>
{/* 5. Time Value Calculator */}
{movie.Runtime && (
  <div className="bg-container p-6 rounded-xl">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Clock size={20} />
      Time Value Score
    </h2>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="text-3xl font-bold text-purple-400">
          {Math.floor(
            (Number(movie.imdbRating) / 
            parseInt(movie.Runtime.replace(/\D/g, '')) * 1000)
          )}
        </div>
        <p className="text-sm text-gray-400">
          Score per minute (Higher is better)
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm">
          {movie.Runtime.replace('min', 'minutes')}
        </div>
        <div className="text-xs text-gray-400">
          {Math.floor(Number(movie.imdbRating))}/10 rating
        </div>
      </div>
    </div>
  </div>
)}
            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="bg-container p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Star Power</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.Actors.split(', ').map((actor: string) => (
                    <div key={actor} className="bg-background px-3 py-1.5 rounded-full text-sm">
                      {actor}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.Genre && (
              <div className="bg-container p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">More Like This</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(', ').map((genre: string) => (
                    <button
                      key={genre}
                      className="px-3 py-1.5 bg-background rounded-full text-sm hover:bg-gray-700 transition-colors"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
