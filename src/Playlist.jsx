import React, { useState } from "react";
import Track from "./Track";
import { savePlaylist } from "./api";
import SortableTrack from "./SortableTrack";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

export default function Playlist({ list, setList }) {
  console.log("🚀 ~ Playlist ~ list:", list);
  const onDelete = (id) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };
  const handleDragEnd = (event) => {
    if (event.canceled) return;

    setList((prevList) => move(prevList, event));
  };

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const playlist = await savePlaylist(name, list);
      console.log("Плейлист сохранён:", playlist.name);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsSaving(false);
      setName("");
      setList([]);
    }
  };
  return (
    <>
      {list.length > 0 ? (
        <div className="playlist-content">
          <input
            className="playlist-name"
            placeholder="Give your playlist a name"
            aria-label="Playlist name"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DragDropProvider onDragEnd={handleDragEnd}>
            <ul className="track-list">
              {list.map((item, index) => (
                <SortableTrack
                  key={item.id}
                  item={item}
                  onDelete={onDelete}
                  index={index}
                />
              ))}
            </ul>
          </DragDropProvider>

          <button
            className="spotify-button"
            onClick={handleSave}
            disabled={isSaving || !name.trim() || list.length === 0}
          >
            {isSaving ? "Saving..." : "Add to Spotify"}
          </button>
        </div>
      ) : null}
    </>
  );
}
