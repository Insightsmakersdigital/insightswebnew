interface Props {
  name: string;
  company: string;
  rating: number;
  quote: string;
  metaOrder?: "person-first" | "rating-first";
}

export default function Testimonial({ name, company, rating, quote, metaOrder = "person-first" }: Props) {
  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className={["testimonial-card reveal", metaOrder === "rating-first" && "rating-first"].filter(Boolean).join(" ")}>
      <div className="testimonial-person">
        <span className="testimonial-avatar" aria-hidden="true">
          {initials}
        </span>
        <div>
          <p className="testimonial-name">{name}</p>
          <p className="testimonial-company">{company}</p>
        </div>
      </div>
      <blockquote className="testimonial-quote">{quote}</blockquote>
      <div className="testimonial-rating">
        <span className="testimonial-stars" aria-hidden="true">
          {stars}
        </span>
        <span className="testimonial-score">{rating.toFixed(1)}/5</span>
      </div>
    </figure>
  );
}
