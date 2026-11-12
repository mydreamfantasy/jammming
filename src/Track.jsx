import React from "react";

export default function Track({ item }) {
  return (
    <div className="track">
      <span className="track-art" aria-hidden="true">
        ♫
      </span>
      <div className="track-copy">
        <p className="track-name">{item.name}</p>
        <p className="track-info">{item.artist}</p>
      </div>
    </div>
  );
}
