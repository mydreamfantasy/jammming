import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import Playlist from "./Playlist";
import SearchResult from "./SearchResult";
import { useState } from "react";
import { savePlaylist } from "./api";

afterEach(cleanup);
vi.mock("./api", () => ({
  savePlaylist: vi.fn(),
}));

function PlaylistTestView() {
  const [list, setList] = useState([]);
  const results = [
    { id: "1", name: "Hysteria", artist: "Muse" },
    { id: "2", name: "Plug in", artist: "Muse" },
  ];

  return (
    <>
      <SearchResult results={results} setOnList={setList} />

      <section aria-label="Test playlist">
        <Playlist list={list} setList={setList} />
      </section>
    </>
  );
}
test("add new track to playlist", async () => {
  const user = userEvent.setup();

  render(<PlaylistTestView />);
  const playlist = screen.getByRole("region", { name: "Test playlist" });

  expect(within(playlist).queryByText("Hysteria")).not.toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Add Hysteria to playlist" }),
  );

  const track = within(playlist).getByText("Hysteria");

  expect(track).toBeInTheDocument();
});

test("delete track from playlist", async () => {
  function PlaylistTestView() {
    const [list, setList] = useState([
      { id: "1", name: "Hysteria", artist: "Muse" },
      { id: "2", name: "Plug in", artist: "Muse" },
    ]);

    return (
      <>
        <section aria-label="Test playlist">
          <Playlist list={list} setList={setList} />
        </section>
      </>
    );
  }
  const user = userEvent.setup();

  render(<PlaylistTestView />);
  const playlist = screen.getByRole("region", { name: "Test playlist" });

  await user.click(
    screen.getByRole("button", { name: "Remove Hysteria from playlist" }),
  );

  const track = within(playlist).getByText("Plug in");

  expect(track).toBeInTheDocument();
  expect(within(playlist).queryByText("Hysteria")).not.toBeInTheDocument();
});

test("enables Add to Spotify after the user enters a playlist name", async () => {
  function PlaylistTestView() {
    const [list, setList] = useState([
      { id: "1", name: "Hysteria", artist: "Muse" },
      { id: "2", name: "Plug in", artist: "Muse" },
    ]);

    return (
      <>
        <section aria-label="Test playlist">
          <Playlist list={list} setList={setList} />
        </section>
      </>
    );
  }
  const user = userEvent.setup();

  render(<PlaylistTestView />);

  const button = screen.getByRole("button", { name: "Add to Spotify" });
  const input = screen.getByRole("textbox", {
    name: "Playlist name",
  });
  expect(input).toHaveValue("");
  expect(button).toBeDisabled();
  await user.type(input, "My mix");
  expect(button).not.toBeDisabled();
});

test("enables Add to Spotify after the user enters a playlist name", async () => {
  function PlaylistTestView() {
    const [list, setList] = useState([
      { id: "1", name: "Hysteria", artist: "Muse" },
      { id: "2", name: "Plug in", artist: "Muse" },
    ]);

    return (
      <>
        <section aria-label="Test playlist">
          <Playlist list={list} setList={setList} />
        </section>
      </>
    );
  }
  const user = userEvent.setup();
  let finishSaving;

  const pendingSave = new Promise((resolve) => {
    finishSaving = resolve;
  });

  render(<PlaylistTestView />);

  const button = screen.getByRole("button", { name: "Add to Spotify" });
  const input = screen.getByRole("textbox", {
    name: "Playlist name",
  });
  savePlaylist.mockReturnValueOnce(pendingSave);
  await user.type(input, "My mix");
  await user.click(button);

  const savingButton = screen.getByRole("button", { name: "Saving..." });
  expect(savingButton).toBeDisabled();
  await finishSaving({ name: "My mix" });
});
