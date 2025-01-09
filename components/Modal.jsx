const Modal = ({ title, value, onChange, onSave, onCancel }) => (
  <div className="modal">
    <div className="modal-content">
      <h2>{title}</h2>
      <textarea value={value} onChange={onChange} placeholder="Write your note here..." />
      <div className="modal-actions">
        <button onClick={onSave} className="save-button">
          Save
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
