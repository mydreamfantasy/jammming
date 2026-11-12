import React from "react";
import Track from "./Track";

export default function SearchResult({ results, setOnList }) {
  const onAdd = (item) => {
    setOnList((prev) => {
      if (prev.find((list) => list.id === item.id)) {
        return prev;
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <ul className="track-list">
      {results.map((item) => (
        <li key={item.id} className="track-row">
          <Track item={item} />
          <button className="track-action" aria-label={`Add ${item.name} to playlist`} onClick={() => onAdd(item)}>+</button>
        </li>
      ))}
    </ul>
  );
}
