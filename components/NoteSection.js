export default function NoteSection({ index, note, onNoteChange }) {
  return (
    <div className="note-section">
      <label htmlFor={`note-${index}`} className="note-label">
        Notes:
      </label>
      <textarea
        id={`note-${index}`}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="متن را اینجا بنویسید..."
        className="note-textarea"
      />
    </div>
  );
}
