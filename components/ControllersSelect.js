export default function ControllersSelect({ index, controllers, onControllerChange }) {
  return (
    <div className="controllers-container">
      <label htmlFor={`controllers-${index}`} className="controllers-label">
        تعداد دسته:
      </label>
      <select
        id={`controllers-${index}`}
        value={controllers}
        onChange={(e) => onControllerChange(parseInt(e.target.value))}
        className="controllers-select"
      >
        {[1, 2, 3, 4].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
