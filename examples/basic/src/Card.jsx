const testProps = { 'data-testid': 'card' };

export function Card({ title, children }) {
  return (
    <section {...testProps} className="card">
      <h2 data-testid="card-title">{title}</h2>
      {children}
    </section>
  );
}
