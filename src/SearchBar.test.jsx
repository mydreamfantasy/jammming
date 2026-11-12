import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

afterEach(cleanup);

test("submits the search query when the user clicks Search", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} disabledButton={false} />);

  await user.type(screen.getByLabelText("Search for music"), "Muse");
  await user.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith("Muse");
});

test("blocked search button", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} disabledButton={true} />);
  const button = screen.getByRole("button", { name: "Searching..." });
  await user.type(screen.getByLabelText("Search for music"), "Muse");
  expect(button).toBeDisabled();
  await user.click(button);
  expect(onSearch).toHaveBeenCalledTimes(0);
});

test("submits the search query when the user presses Enter", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} disabledButton={false} />);

  await user.type(screen.getByLabelText("Search for music"), "Muse");
  await user.keyboard("{Enter}");

  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith("Muse");
});
