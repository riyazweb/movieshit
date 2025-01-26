import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { toast } from "sonner";

const OMDB_API_KEY = "8ec42cd3";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["movies", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { Search: [] };
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      if (data.Error) throw new Error(data.Error);
      return data;
    },
    enabled: !!searchQuery,
  });

  return (
    <div className="min-h-screen bg-black px-4 pb-40 sm:pb-8 overflow-x-hidden">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-4xl font-bold text-white sm:mb-12 sm:text-6xl">
          🎬 Movie Discovery
        </h1>

        <div className="mb-8 sm:mb-16">
          {searchQuery ? (
            <MovieGrid 
              movies={searchResults?.Search || []} 
              loading={searchLoading}
            />
          ) : (
            <section className="mx-auto w-full">
              <h2 className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl">
                📈 Rating System
              </h2>
              
              <div className="grid w-full grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    emoji: "🏆",
                    range: "9.0+", 
                    title: "Blockbuster", 
                    desc: "Cinematic masterpiece" 
                  },
                  { 
                    emoji: "⭐",
                    range: "8.0-8.9", 
                    title: "Superhit", 
                    desc: "Critically acclaimed" 
                  },
                  { 
                    emoji: "🎬",
                    range: "7.0-7.9", 
                    title: "Hit", 
                    desc: "Audience favorite" 
                  },
                  { 
                    emoji: "🎭",
                    range: "6.0-6.9", 
                    title: "Average/Above", 
                    desc: "Mixed reactions" 
                  },
                  { 
                    emoji: "😐",
                    range: "5.0-5.9", 
                    title: "Below Average", 
                    desc: "Disappointing" 
                  },
                  { 
                    emoji: "💣",
                    range: "Below 5.0", 
                    title: "Not Recommended", 
                    desc: "Critical failure" 
                  },
                ].map((rating) => (
                  <div 
                    key={rating.title}
                    className="w-full min-w-0 rounded-xl bg-white p-4 shadow-xl sm:p-6"
                  >
                    <div className="mb-2 text-6xl sm:text-7xl">{rating.emoji}</div>
                    <div className="mb-1 text-2xl font-black text-black sm:text-3xl">
                      {rating.range}
                    </div>
                    <div className="mb-1 text-3xl font-bold text-black sm:text-4xl">
                      {rating.title}
                    </div>
                    <div className="text-lg text-gray-600 sm:text-xl">{rating.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Fixed Search Container - Moved Down */}
        <div className="fixed bottom-0 left-0 right-0 bg-black p-4 pb-6 sm:static sm:bg-transparent sm:p-0">
          <div className="mx-auto max-w-2xl">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;