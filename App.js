import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/movies.json")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error loading movies.json", err));
  }, []);
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎥 Movie List</h1>

      {/* Search Bar */}
      <input type="text" placeholder="Search by movie title..." value={search} onChange={(e) => setSearch(e.target.value)}
       style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* Movies Grid */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`}key={movie.id}
              style={{
                width: "200px",
                textDecoration: "none",
                color: "black",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <img src={movie.posterUrl} alt={movie.title}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h3>{movie.title}</h3>
                <p style={{ fontSize: "14px", color: "gray" }}>
                  {movie.language} • {movie.duration} mints
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
}

// Movie Detail Page
function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch("/movies.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m) => m.id === parseInt(id));
        setMovie(found);
      });
  }, [id]);

  if (!movie) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        ⬅ Back to Movies
      </Link>
      <h1>{movie.title}</h1>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "10px" }}
      />
      <p style={{ marginTop: "10px" }}>{movie.description}</p>
      <p>
        <b>Language:</b> {movie.language}
      </p>
      <p>
        <b>Duration:</b> {movie.duration} min
      </p>
    </div>
  );
}

// Main App with Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}
