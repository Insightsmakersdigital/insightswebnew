import RevealHeading from "./RevealHeading";
import PillarAccordion from "./PillarAccordion";
import { PILLARS, PILLAR_HEADLINES, servicesByPillar } from "../data/site";

const pillarAccordionEntries = PILLARS.map((pillar) => ({
  pillar,
  headline: PILLAR_HEADLINES[pillar],
  list: servicesByPillar(pillar),
}));

// Was the OptionWheel (drag-to-spin on desktop, a separate tap accordion
// on mobile) -- now just PillarAccordion, the exact same "What we do"
// treatment /about already uses, at every width. One accordion component
// site-wide instead of two near-duplicates (the old ServiceAccordionMobile
// was already modeled after this one's visual language; this replaces it
// outright rather than keeping both).
export default function ServiceWheelSection() {
  return (
    <section className="wheel-section panel-light">
      <div className="wrap">
        <div className="eyebrow-row reveal">
          <span className="section-index">01</span>
          <p className="eyebrow">What we do</p>
        </div>
        <RevealHeading as="h2" text="Three disciplines, run as one." />
        <PillarAccordion entries={pillarAccordionEntries} />
      </div>
    </section>
  );
}
