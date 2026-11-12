import { useState } from "react";
import "./App.css";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import Playlist from "./Playlist";
import { authorize, searchTracks } from "./api";

function App() {
  const [results, setResults] = useState([]);
  const [list, setList] = useState([]);
  const [noTracks, setNoTracks] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (search) => {
    setError("");
    setNoTracks(false);
    setIsSearching(true);
    try {
      const tracks = await searchTracks(search);

      const results = tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        uri: track.uri,
      }));

      setResults(results);
      setIsSearching(false);
    } catch (error) {
      console.error("Не удалось найти треки:", error.message);
      setNoTracks(true);
      setError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="div">
      <header className="app-header">
        <a className="brand" href="./" aria-label="Jammming home">
          <span className="brand-mark" aria-hidden="true">
            ♫
          </span>
          Jammming<span className="brand-dot">.</span>
        </a>
        <span className="header-note">
          A little more you. A little more music.
        </span>
      </header>
      <button onClick={authorize}>Connect Spotify</button>
      <section className="hero">
        <span className="eyebrow">YOUR NEXT FAVORITE PLAYLIST</span>
        <h1>
          Find your sound.
          <br />
          <span>Make it yours.</span>
        </h1>
        <p>
          Discover the tracks you love and bring them together in one place.
        </p>
        <SearchBar onSearch={handleSearch} disabledButton={isSearching} />
        {error && <p role="alert">{error}</p>}
      </section>
      <div className="results">
        <section className="panel search-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">DISCOVER</span>
              <h2>Search results</h2>
            </div>
            <span className="section-icon" aria-hidden="true">
              ↗
            </span>
          </div>
          {noTracks ? (
            <p>No tracks. Try </p>
          ) : (
            <SearchResult results={results} setOnList={setList} />
          )}
        </section>
        <section className="panel playlist-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">CURATED BY YOU</span>
              <h2>Your playlist</h2>
            </div>
            <span className="section-icon" aria-hidden="true">
              ♫
            </span>
          </div>
          <Playlist list={list} setList={setList} />
        </section>
      </div>
      <footer>GOOD MUSIC. GREAT COMPANY. YOUR PLAYLIST.</footer>
    </div>
  );
}

export default App;
