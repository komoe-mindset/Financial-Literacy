interface HeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  copy: string;
  light?: boolean;
}

export function Heading({ id, eyebrow, title, copy, light = false }: HeadingProps) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      <p>{copy}</p>
    </div>
  );
}
