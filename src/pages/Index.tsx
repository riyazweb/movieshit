import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { toast } from "sonner";
import React from 'react';

const OMDB_API_KEY = "8ec42cd3";

// Function to get movie rating categories
const getRatingCategory = (rating: string) => {
  const numRating = parseFloat(rating);
  if (numRating >= 9.0) return "Blockbuster/Legendary";
  if (numRating >= 8.0) return "Superhit";
  if (numRating >= 7.0) return "Hit";
  if (numRating >= 6.0) return "Average/Above Average";
  if (numRating >= 5.0) return "Below Average";
  return "Not Recommended";
};

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
      console.log("OMDB API Response:", data);

      const fetchMovieByID = async (imdbID: string) => {
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`
          );
          const data = await response.json();
          console.log("OMDB API Response for IMDb ID:", data);
        } catch (error) {
          console.error("Error fetching movie data:", error);
        }
      };

      fetchMovieByID("tt27957740");

      if (data.Error) {
        throw new Error(data.Error);
      }
      return data;
    },
    enabled: !!searchQuery,
  });

  const formatMoviesForGrid = (movies: any[]) => {
    if (!movies) return [];
    return movies
      .filter(movie => movie.Poster !== "N/A" && movie.Title && movie.Year)
      .map(movie => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        imdbRating: movie.imdbRating,
      }));
  };

  return (
    <div className="container py-8">
      <h1 className="text-6xl font-bold text-center mb-12 text-white">
        Movie Discovery
      </h1>
      <SearchBar onSearch={setSearchQuery} />
      
      {searchQuery ? (
        <MovieGrid movies={searchResults?.Search || []} loading={searchLoading} />
      ) : (
        <div className="space-y-16">
          <section className="mt-16 bg-container/50 p-8 rounded-xl">
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Rating System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-container rounded-lg">
                <div className="text-yellow-500 text-xl mb-2">9.0+</div>
                <div className="font-semibold">Blockbuster/Legendary</div>
                <p className="text-sm text-gray-400">Universally loved masterpiece</p>
              </div>
              <div className="p-4 bg-container rounded-lg">
                <div className="text-yellow-500 text-xl mb-2">8.0-8.9</div>
                <div className="font-semibold">Superhit</div>
                <p className="text-sm text-gray-400">Critically acclaimed</p>
              </div>
              <div className="p-4 bg-container rounded-lg">
                <div className="text-yellow-500 text-xl mb-2">7.0-7.9</div>
                <div className="font-semibold">Hit</div>
                <p className="text-sm text-gray-400">Well-received by audiences</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Index;
