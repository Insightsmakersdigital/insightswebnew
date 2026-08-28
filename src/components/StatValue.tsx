// Big display "stat" value -- plain text for non-numeric strings (e.g.
// "Mobile-first", "5B+"), or a count-up digit for pure integers, reusing
// the shared [data-count] animation SiteChrome already wires up site-wide.
interface Props {
  value: string;
  suffix?: string;
}

export default function StatValue({ value, suffix }: Props) {
  const isNumeric = /^\d+(\.\d+)?$/.test(value);
  return (
    <>
      {isNumeric ? (
        <strong data-count={value} className="counted">
          0
        </strong>
      ) : (
        value
      )}
      {suffix && <span className="stat-suffix">{suffix}</span>}
    </>
  );
}
