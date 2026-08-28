interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export default function RevealHeading({ text, as = "h2", className }: Props) {
  const Tag = as;
  const words = text.split(" ");

  return (
    <Tag className={["reveal-words", className].filter(Boolean).join(" ")}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="word-mask">
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
