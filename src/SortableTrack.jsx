import Track from "./Track";
import { useSortable } from "@dnd-kit/react/sortable";

export default function SortableTrack({ item, onDelete, index }) {
  const { id, name } = item;
  const { ref } = useSortable({ id, index });
  return (
    <li className="track-row" ref={ref}>
      <Track item={item} />

      <button
        className="track-action remove-action"
        aria-label={`Remove ${item.name} from playlist`}
        onClick={() => onDelete(item.id)}
      >
        -
      </button>
    </li>
  );
}
