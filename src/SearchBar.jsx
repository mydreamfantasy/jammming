import React, { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, disabledButton }) {
  const [search, setSearch] = useState("");
  const onHandleSumbit = (event) => {
    event.preventDefault();
    onSearch(search);
  };

  return (
    <form className={styles.form} onSubmit={onHandleSumbit}>
      <span className={styles.icon} aria-hidden="true">
        ⌕
      </span>
      <input
        id="search"
        name="search"
        placeholder="Search for a song, artist, or album"
        aria-label="Search for music"
        className={styles.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={disabledButton || !search.trim()}
      >
        {disabledButton ? `Searching...` : `Search`}
      </button>
    </form>
  );
}
