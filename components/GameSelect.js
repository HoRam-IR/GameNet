import { useState } from "react";

export default function GameSelect({ index, selectedOption, onOptionChange }) {
  const [options, setOptions] = useState(["Game 1", "Game 2", "Game 3"]); // Initial options
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption)) {
      setOptions((prev) => [...prev, newOption]);
      setNewOption("");
    }
  };

  const handleDeleteOption = (optionToDelete) => {
    setOptions((prev) => prev.filter((option) => option !== optionToDelete));
    if (selectedOption === optionToDelete) {
      onOptionChange("");
    }
  };

  return (
    <div className="dynamic-select-container">
      <label htmlFor={`dynamic-select-${index}`} className="dynamic-select-label">
        بازی درحال اجرا :
      </label>
      <select
        id={`dynamic-select-${index}`}
        value={selectedOption}
        onChange={(e) => onOptionChange(e.target.value)}
        className="dynamic-select"
      >
        <option value="">انتخاب بازی</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="manage-options">
        <input
          type="text"
          placeholder="اضافه کردن بازی"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          className="option-input"
        />
        <button onClick={handleAddOption} className="add-button">
          Add
        </button>
      </div>

      <ul className="options-list">
        {options.map((option, idx) => (
          <li key={idx} className="option-item">
            {option}
            <button onClick={() => handleDeleteOption(option)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
