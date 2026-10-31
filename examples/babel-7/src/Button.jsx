export function Button({ label, onClick }) {
  return (
    <button data-test-id="submit-button" className="button" onClick={onClick}>
      {label}
    </button>
  );
}
