import React, { useState, useEffect } from "react";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./Row.css";
const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    console.log(movie?.name);
    try {
      if (trailerUrl) {
        setTrailerUrl("");
      } else {
        const trailerURL = await movieTrailer(
          movie?.title || movie?.name || "",
          { id: true }
        );
        console.log("Trailer URL:", trailerURL);

        if (trailerURL !== null) {
          const isVideoId = /^[a-zA-Z0-9_-]{11}$/.test(trailerURL);
          if (isVideoId) {
            setTrailerUrl(trailerURL);
          } else {
            const urlParams = new URLSearchParams(new URL(trailerURL).search);
            setTrailerUrl(urlParams.get("v"));
          }
        } else {
          console.log("No trailer found for the movie");
          // Optionally, you can show a message to the user or handle this case differently
        }
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailerUrl(""); // Clear trailer URL in case of an error
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            onClick={() => handleClick(movie)}
            key={movie.id}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
