// Single source of truth for company identity + content, sourced from
// content.txt (the sitemap/content reference doc). Kept as one data file
// so the homepage teasers and the dedicated /services, /work pages stay
// in sync instead of repeating the same names/copy in multiple places.

export const SITE_NAME = "Insights Marketers";
export const SITE_SHORT = "INSIGHTS";
export const SITE_DESCRIPTION =
  "Insights Marketers is a Kerala-based digital marketing, branding, and web development studio. You work with us, not an account manager.";

export const FOUNDERS = [
  { name: "Nived A. Sumithran", role: "Chief Executive Officer" },
  { name: "Nuhman Daris", role: "Chief Marketing Officer" },
];

export const CONTACT = {
  email: "hello@insightsmarketers.com",
  phones: ["+91 00000 00001", "+91 00000 00002", "+91 00000 00003"],
  whatsapp: "https://wa.me/910000000001",
};

// The roster's real facts (who's named, who isn't) -- the single source
// both /team's roster wall and /about's ledger read from, so "3 of 13
// named publicly" can't drift out of sync between the two pages. Photo
// seeds and per-seat bio lines are presentation-only and stay local to
// the team page, not duplicated here.
export interface RosterSeat {
  role: string | null;
  name?: string;
  filled: boolean;
}

export const ROSTER: RosterSeat[] = [
  { role: "CEO", name: "Nived A. Sumithran", filled: true },
  { role: "CMO", name: "Nuhman Daris", filled: true },
  // Placeholder name -- swap for the real hire's name once they're
  // announced; the seat itself and its role are real.
  { role: "Tech Lead", name: "Arjun Menon", filled: true },
  { role: "Content Writer", filled: false },
  { role: "Creative Head", filled: false },
  { role: "Graphic Designer", filled: false },
  { role: "Video Editor", filled: false },
  { role: "Project Manager", filled: false },
  { role: "Social Media Manager", filled: false },
  { role: "Business Development Head", filled: false },
  { role: "Performance Marketing", filled: false },
  { role: "Sales Head", filled: false },
  // No role, on purpose: the founder dictating this roster said, live,
  // "one more dude I forgot what he does" -- not smoothed into a
  // placeholder title.
  { role: null, filled: false },
];

export interface ServiceStat {
  value: string;
  label: string;
  suffix?: string;
}

// A running sentence woven from alternating plain-text runs and
// interactive "term" buttons -- each term carries its own floating-card
// content (number/title/description) rather than pointing at a separate
// deliverables list, so the sentence stays the single source of truth
// for the "What's included" section.
export type IncludedSegment =
  | { kind: "text"; text: string }
  | { kind: "term"; term: string; title: string; description: string };

export interface ServiceStep {
  title: string;
  body: string;
  detail: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceProof {
  eyebrow: string;
  heading: string;
  body: string;
  quote: string;
  quoteAttribution?: string;
  stats: [ServiceStat, ServiceStat, ServiceStat];
}

export interface Service {
  slug: string;
  title: string;
  headline: string;
  pillar: "Marketing" | "Branding" | "Build";
  description: string;
  highlights: [string, string, string];
  quickFacts: [ServiceStat, ServiceStat, ServiceStat];
  includedSentence: IncludedSegment[];
  approach: ServiceStep[];
  proof: ServiceProof;
  faqs: ServiceFaq[];
}

export const SERVICES: Service[] = [
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    headline: "Turn Followers Into Customers",
    pillar: "Marketing",
    description:
      "Reaches over 5 billion social media users worldwide through tailored content strategy, paid social advertising campaigns, community engagement, and performance auditing. Designed to build brand awareness, generate qualified leads, and build an active customer community.",
    highlights: ["Content strategy", "Paid campaigns", "Community growth"],
    quickFacts: [
      { value: "5B+", label: "people active on social media worldwide" },
      { value: "2", label: "hours the average user spends on social daily" },
      { value: "3", label: "platforms, chosen deliberately, not all nine" },
    ],
    includedSentence: [
      { kind: "text", text: "We start with an " },
      { kind: "term", term: "audit", title: "Social Audit", description: "A full read of your profiles and competitors before we post." },
      { kind: "text", text: " of where you already stand, build a " },
      { kind: "term", term: "content strategy", title: "Content Strategy & Creation", description: "A real calendar, tailored per platform, not one caption resized." },
      { kind: "text", text: " your audience will stop for, and grow a " },
      { kind: "term", term: "community", title: "Community Management", description: "Genuine engagement that turns followers into regulars." },
      { kind: "text", text: " that sticks around, backed by " },
      { kind: "term", term: "paid advertising", title: "Paid Social Advertising", description: "Targeted campaigns on the platforms your buyers actually use." },
      { kind: "text", text: ", " },
      { kind: "term", term: "weekly reporting", title: "Performance Tracking & Reporting", description: "Reach, engagement, conversion, reported plainly, every week." },
      { kind: "text", text: ", and " },
      { kind: "term", term: "platforms", title: "Platform Strategy", description: "Two or three platforms chosen on purpose, not all nine." },
      { kind: "text", text: " chosen on purpose, not habit." },
    ],
    approach: [
      { title: "Understand the audience", body: "We map who you're trying to reach: demographics, behaviour, and where they spend their time.", detail: "Audience & platform brief" },
      { title: "Choose the right platforms", body: "We commit to the two or three that match your audience, not all nine at once.", detail: "2–3 platform strategy" },
      { title: "Build and publish", body: "Content goes out on a real calendar, tailored per platform, in one consistent voice.", detail: "Weekly content calendar" },
      { title: "Measure and refine", body: "Weekly reviews of what's landing, so the strategy follows the data, not the assumptions.", detail: "Weekly performance review" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Built for enquiries, not vanity metrics",
      body: "Likes are easy to buy and easy to ignore. We plan every post and campaign around one question: does it move someone closer to becoming a customer? Then we report against that.",
      quote: "Fast, structured, and refreshingly honest.",
      quoteAttribution: "Sarah Thomas, Beyond Borders",
      stats: [
        { value: "4", label: "step process, every campaign" },
        { value: "Weekly", label: "reporting on reach, engagement, conversion" },
        { value: "2–3", label: "platforms, chosen deliberately" },
      ],
    },
    faqs: [
      { question: "Which social platforms will you manage for my brand?", answer: "Only the ones your audience uses. During the social audit we identify where your buyers spend time and commit budget and content there, instead of spreading a thin effort across every platform that exists." },
      { question: "How is social media marketing different from just posting content?", answer: "Posting is one output. Social media marketing is the strategy behind it: audience research, platform selection, paid amplification, community management, and reporting, all built around business goals like leads and sales, not just activity." },
      { question: "Do you also run paid social campaigns, or just organic content?", answer: "Both. Organic content builds the brand voice and community; paid social campaigns target the audience most likely to convert. We use them together rather than treating either as optional." },
      { question: "How do you measure whether a social campaign is actually working?", answer: "Through regular reporting on reach, engagement, and conversion, tracked against the goals we set at the start, not generic industry benchmarks. You'll always know which posts and campaigns are driving results." },
    ],
  },
  {
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    headline: "Rank Higher. Grow Organically.",
    pillar: "Marketing",
    description:
      "Delivers compounding organic search growth by optimizing website architecture, conducting high-intent keyword research, fixing technical bottlenecks, executing on-page/local SEO (Google Business Profile), and building high-authority backlinks.",
    highlights: ["Keyword research", "Technical fixes", "Backlink growth"],
    quickFacts: [
      { value: "3–6", label: "months before rankings typically compound" },
      { value: "Compounding", label: "returns, SEO gets cheaper the longer you invest" },
      { value: "100", label: "white-hat, algorithm-safe technique", suffix: "%" },
    ],
    includedSentence: [
      { kind: "text", text: "Growth starts with " },
      { kind: "term", term: "keyword research", title: "Keyword Research & Strategy", description: "The terms your buyers search, not just the highest-volume ones." },
      { kind: "text", text: " aimed at real buyer intent, followed by " },
      { kind: "term", term: "on-page fixes", title: "On-Page Optimization", description: "Structure and content tuned so search engines understand you faster." },
      { kind: "text", text: " and a " },
      { kind: "term", term: "technical audit", title: "Technical SEO Audit & Fix", description: "A full crawl to find and fix what's capping your rankings." },
      { kind: "text", text: " that clears whatever's quietly holding you back, then " },
      { kind: "term", term: "local SEO", title: "Local SEO & Google Business Profile", description: "Google Business Profile and citations, so nearby searches find you." },
      { kind: "text", text: ", " },
      { kind: "term", term: "link building", title: "Link Building", description: "High-authority backlinks that build the trust rankings compound on." },
      { kind: "text", text: ", and " },
      { kind: "term", term: "content", title: "SEO Content Marketing", description: "Blog and landing pages built to target real, high-intent searches." },
      { kind: "text", text: " built to keep compounding long after we're done." },
    ],
    approach: [
      { title: "Audit", body: "A full technical and content crawl to see exactly where the site is losing search visibility today.", detail: "Technical + content audit" },
      { title: "Research", body: "Keyword and competitor research to define which searches are actually worth winning.", detail: "Keyword & competitor map" },
      { title: "Fix and build", body: "On-page fixes, technical repairs, and new content, shipped, not just listed.", detail: "4–8 weeks to implement" },
      { title: "Report and compound", body: "Monthly reporting on rankings and traffic, with the strategy adjusted as the site climbs.", detail: "Monthly ranking report" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Growth that keeps paying after the invoice",
      body: "Paid traffic stops the day you stop paying. Organic search keeps working quietly in the background, and every fixed page and earned link stays an asset that keeps compounding.",
      quote: "Enquiries started coming from searches we didn't even know we were ranking for.",
      quoteAttribution: "Educ Kshetra",
      stats: [
        { value: "3", label: "disciplines under one plan: on-page, technical, local" },
        { value: "Monthly", label: "ranking and traffic reporting" },
        { value: "Compounding", label: "growth that outlasts the campaign" },
      ],
    },
    faqs: [
      { question: "How long does SEO take to show results?", answer: "Most sites see measurable ranking movement in 3–6 months, with growth compounding from there. SEO isn't instant; it's an asset you build, which is exactly what makes it cheaper than paid ads over time." },
      { question: "What's the difference between on-page and technical SEO?", answer: "On-page SEO is about content and structure: headings, keywords, internal linking. Technical SEO is about the site's underlying health: speed, crawlability, mobile performance. Both are covered in every engagement, since ranking growth needs both working together." },
      { question: "Do you handle local SEO for businesses that serve a specific area?", answer: "Yes. Google Business Profile optimization and local citation building are part of the core service, so you show up in the map pack and local search results your nearby customers use." },
      { question: "Will you tell me what keywords you're targeting and why?", answer: "Always. Every keyword is chosen for actual buyer intent, not just search volume, and you'll see the reasoning in the strategy before we start building content against it." },
    ],
  },
  {
    slug: "search-engine-marketing",
    title: "Search Engine Marketing",
    headline: "Instant Visibility, Measurable ROI",
    pillar: "Marketing",
    description:
      "Instant search visibility through targeted Pay-Per-Click (PPC) campaigns on search engines like Google Ads. Focuses on high-converting keyword targeting, compelling ad copy, and continuous ROI optimization so every rupee spent drives measurable leads.",
    highlights: ["PPC campaigns", "Ad copywriting", "ROI optimization"],
    quickFacts: [
      { value: "Same-day", label: "visibility at the top of search results" },
      { value: "Pay-per-click", label: "you only pay when someone actually clicks" },
      { value: "24/7", label: "your ads stay visible around the clock" },
    ],
    includedSentence: [
      { kind: "text", text: "Every campaign starts with " },
      { kind: "term", term: "paid search", title: "Paid Search Advertising", description: "PPC campaigns built to appear where your buyers are already searching." },
      { kind: "text", text: " built around " },
      { kind: "term", term: "keyword research", title: "Keyword Research & Analysis", description: "The highest-intent terms your budget should be spent on." },
      { kind: "text", text: " that actually converts, " },
      { kind: "term", term: "ad creation", title: "Ad Creation & Optimization", description: "Copy written to earn the click, then tested until it's the best version." },
      { kind: "text", text: " that earns the click, and a " },
      { kind: "term", term: "landing page", title: "Landing Page Alignment", description: "Ad and page kept in sync, so the click converts instead of bouncing." },
      { kind: "text", text: " that doesn't waste it, all backed by " },
      { kind: "term", term: "campaign management", title: "Campaign Management & Reporting", description: "Continuous adjustment, with reporting on what each rupee produced." },
      { kind: "text", text: " and " },
      { kind: "term", term: "conversion tracking", title: "Conversion Tracking", description: "Every click tied to a measurable outcome, not just an impression." },
      { kind: "text", text: " you can see in real time." },
    ],
    approach: [
      { title: "Initial consultation", body: "We start with your business goals and budget, not a generic campaign template.", detail: "Goals & budget brief" },
      { title: "Strategy & keyword plan", body: "A targeting plan built around the searches most likely to convert, at a cost that fits your margins.", detail: "Keyword & bid strategy" },
      { title: "Launch", body: "Campaigns go live with tested ad copy and a conversion-ready landing page.", detail: "Live within 1–2 weeks" },
      { title: "Monitor & optimize", body: "Continuous adjustment to bids, targeting, and copy, so performance keeps improving.", detail: "Weekly performance review" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Instant visibility, with the numbers to prove it",
      body: "SEO builds the house. SEM puts up the billboard pointing straight to the door. When you need visibility now (a launch, a seasonal push, a competitive market), paid search is the fastest lever available, and every click is measurable.",
      quote: "Search Engine Marketing puts you at the front of the queue while the rest of your strategy catches up.",
      stats: [
        { value: "Same-day", label: "top-of-page visibility" },
        { value: "Pay-per-click", label: "budget spent only on real interest" },
        { value: "Continuous", label: "bid and copy optimization" },
      ],
    },
    faqs: [
      { question: "How is SEM different from SEO?", answer: "SEO earns visibility organically over months; SEM buys it instantly through paid ads. We use SEM when a business needs traffic now, like a launch or a seasonal push, and SEO to build lasting, compounding visibility alongside it." },
      { question: "How much should I budget for a Google Ads campaign?", answer: "It depends on your industry's cost-per-click and how competitive your keywords are. We'll walk through realistic numbers in the first consultation rather than quoting a one-size-fits-all figure." },
      { question: "Will you write the ad copy, or do I need to provide it?", answer: "We write and test the ad copy as part of the service, refining it against real click and conversion data rather than guessing what will land." },
      { question: "How do I know my ad spend is actually working?", answer: "Through detailed campaign reporting that ties spend directly to clicks, leads, and conversions, not just impressions. You'll always be able to see what each rupee produced." },
    ],
  },
  {
    slug: "content-marketing",
    title: "Content Marketing",
    headline: "Stories That Build Authority",
    pillar: "Marketing",
    description:
      "Strategic research, creation, and distribution of valuable blogs, newsletters, and digital media. Establishes long-term brand authority, boosts organic site traffic, and converts curious readers into loyal customers.",
    highlights: ["Blogs & newsletters", "Brand authority", "Traffic growth"],
    quickFacts: [
      { value: "7", label: "step process, from research to reporting" },
      { value: "8", label: "content formats under one strategy" },
      { value: "Compounding", label: "traffic that keeps working after publish day" },
    ],
    includedSentence: [
      { kind: "text", text: "It starts with " },
      { kind: "term", term: "blogs", title: "Blogs & Website Content", description: "Search-optimized writing that answers what your buyers are asking." },
      { kind: "text", text: " built to answer real questions, then " },
      { kind: "term", term: "newsletters", title: "Social & Newsletter Content", description: "Content adapted for how each channel is consumed." },
      { kind: "text", text: " and social content adapted for how each channel is read, backed by " },
      { kind: "term", term: "case studies", title: "Case Studies & Testimonials", description: "Real client outcomes written up as proof, not just claims." },
      { kind: "text", text: " and " },
      { kind: "term", term: "guest posts", title: "Guest Posts & Brochures", description: "Content built for beyond your own channels: placements and print." },
      { kind: "text", text: ", tracked through " },
      { kind: "term", term: "analytics", title: "Content Analytics & Reporting", description: "Page views and conversion tracked by piece, not just by month." },
      { kind: "text", text: ", and moved by a real " },
      { kind: "term", term: "publishing", title: "Content Publishing & Distribution", description: "A managed process so content actually reaches an audience." },
      { kind: "text", text: " process." },
    ],
    approach: [
      { title: "Research", body: "Topic and keyword research, competitor analysis, and a clear read on who we're writing for.", detail: "Topic & keyword brief" },
      { title: "Strategy", body: "Objectives, audience, formats, and a distribution plan, decided before a single word is written.", detail: "Content calendar & plan" },
      { title: "Create & publish", body: "Content built to align with your site and brand from the start, not bolted on after design is finished.", detail: "Consistent publishing schedule" },
      { title: "Analyze & report", body: "Performance tracked against traffic, engagement, and conversion, refined as the data comes in.", detail: "Monthly performance report" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Content that works long after it's published",
      body: "A blog post can keep bringing in traffic years after you hit publish. An ad stops the moment the budget does. Content is the slower, cheaper trade for that staying power.",
      quote: "Content is the one channel that keeps paying you back after you've stopped paying for it.",
      stats: [
        { value: "8", label: "content formats under one strategy" },
        { value: "Research-led", label: "every piece starts with real keyword data" },
        { value: "Ongoing", label: "reporting on traffic and conversion" },
      ],
    },
    faqs: [
      { question: "What types of content do you create?", answer: "Blogs, website copy, social content, newsletters, case studies, testimonials, guest posts, brochures, and anchor video scripts. Whatever mix fits your audience and goals, planned under one strategy instead of nine disconnected efforts." },
      { question: "How does content marketing help SEO?", answer: "Every piece of content is an opportunity to rank for a search your buyers are already making. Consistent, keyword-informed publishing is one of the most reliable ways to grow organic traffic over time." },
      { question: "How often should we be publishing?", answer: "Consistency matters more than volume. A realistic, sustainable cadence beats a burst of content that stops after a month. We set a calendar based on your resources and goals, then hold to it." },
      { question: "How do you measure whether content is actually working?", answer: "We track page views, organic traffic, engagement, and conversion rate per piece, so you can see exactly which topics and formats are earning attention and which need to change." },
    ],
  },
  {
    slug: "branding",
    title: "Corporate Branding & Identity",
    headline: "Brands People Remember",
    pillar: "Branding",
    description:
      "End-to-end brand identity creation, including market research, audience positioning, logo design, value propositions, corporate style guides, and brand storytelling. Transforms businesses into distinct, recognizable names.",
    highlights: ["Logo & identity", "Positioning", "Style guides"],
    quickFacts: [
      { value: "1", label: "style guide, consistent everywhere your brand shows up" },
      { value: "3", label: "pillars: strategy, identity, storytelling" },
      { value: "4", label: "months, typically, from research to public launch" },
    ],
    includedSentence: [
      { kind: "text", text: "Every identity starts with " },
      { kind: "term", term: "research", title: "Market & Competitor Research", description: "A clear read of your industry, so positioning isn't guesswork." },
      { kind: "text", text: " into where the real gaps are, sharpens into " },
      { kind: "term", term: "positioning", title: "Brand Positioning & Messaging", description: "A value proposition that says clearly why you're the right choice." },
      { kind: "text", text: " and a " },
      { kind: "term", term: "logo", title: "Logo & Visual Identity", description: "A visual system that represents your values at a glance, at any size." },
      { kind: "text", text: " that actually looks like you, gets written down in a " },
      { kind: "term", term: "style guide", title: "Brand Style Guide", description: "One reference for colour, type, and tone, consistent everywhere." },
      { kind: "text", text: " your team can keep using, and carries through " },
      { kind: "term", term: "storytelling", title: "Brand Storytelling", description: "A narrative that connects, not just a tagline people forget." },
      { kind: "text", text: " and " },
      { kind: "term", term: "reputation management", title: "Brand Reputation Management", description: "Consistent communication that protects your name, online and off." },
      { kind: "text", text: " long after launch." },
    ],
    approach: [
      { title: "Research", body: "Market and competitor research to understand the landscape you're branding into.", detail: "Market & competitor findings" },
      { title: "Position", body: "A clear audience and value proposition, defined before any visual work starts.", detail: "Positioning & messaging brief" },
      { title: "Design", body: "Logo, visual identity, and style guide, built to be consistent across every touchpoint.", detail: "Logo, identity & style guide" },
      { title: "Roll out", body: "Brand assets applied consistently across web, social, and print, ready for your team to keep using.", detail: "Applied to every touchpoint" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "A brand people remember, not just recognize",
      body: "People remember the whole experience, not just the logo: a consistent look, a clear voice, a story that holds up across every touchpoint.",
      quote: "They didn't just redesign our logo — they rebuilt how every campus presents itself, online and off.",
      quoteAttribution: "Arena Animation",
      stats: [
        { value: "3", label: "campuses rebranded under one identity" },
        { value: "60", label: "more enquiries after the relaunch", suffix: "%" },
        { value: "4", label: "months from strategy to public launch" },
      ],
    },
    faqs: [
      { question: "What's the difference between branding and just getting a new logo?", answer: "A logo is one output. Branding is the strategy underneath it: market research, positioning, messaging, and a style guide, all of which make the logo, and everything else with your name on it, actually mean something to your audience." },
      { question: "Do you handle corporate rebranding for an established business?", answer: "Yes. Rebranding starts with an in-depth study of your current brand and where it's falling short, then builds a coherent repositioning from there, rather than starting from a blank page." },
      { question: "Will I get a usable style guide at the end, not just design files?", answer: "Every branding engagement ends with a style guide covering colour, typography, logo usage, and tone, a real reference your team can use to stay consistent long after the project wraps." },
      { question: "How long does a full branding project take?", answer: "A typical brand identity project runs around four months from initial research to public launch, depending on scope. We'll give you a realistic timeline once we understand what you need." },
    ],
  },
  {
    slug: "package-designing",
    title: "Package Designing",
    headline: "Packaging That Sells Itself",
    pillar: "Branding",
    description:
      "Structural and visual packaging design engineered to command shelf presence. Combines aesthetic appeal with print-ready dielines and functional usability while maintaining multi-product range consistency.",
    highlights: ["Shelf-ready design", "Print dielines", "Range consistency"],
    quickFacts: [
      { value: "3", label: "seconds is about how long shelf packaging has to work" },
      { value: "Print-ready", label: "dielines handed off, not just mockups" },
      { value: "1", label: "consistent system across your whole product range" },
    ],
    includedSentence: [
      { kind: "text", text: "Good packaging starts with " },
      { kind: "term", term: "dielines", title: "Structural & Dieline Design", description: "Print-ready structural design, engineered for the shelf and the line." },
      { kind: "text", text: " engineered for the shelf, not just a screen, layered with " },
      { kind: "term", term: "visual design", title: "Visual Packaging Design", description: "Packaging that reflects your brand without shouting on the shelf." },
      { kind: "text", text: " that stands out without shouting, held to " },
      { kind: "term", term: "range consistency", title: "Range Consistency", description: "A system that scales, so a new SKU never looks like another brand." },
      { kind: "text", text: " across every SKU, carried through " },
      { kind: "term", term: "print production", title: "Print Production Support", description: "Guidance through print, so what's approved is what actually ships." },
      { kind: "text", text: ", checked for " },
      { kind: "term", term: "usability", title: "Functional Usability Review", description: "Tested for how it opens, closes, and stacks, not just how it looks." },
      { kind: "text", text: ", and grounded in " },
      { kind: "term", term: "shelf analysis", title: "Competitive Shelf Analysis", description: "A look at what's already there, so yours doesn't blend in." },
      { kind: "text", text: " before anything ships." },
    ],
    approach: [
      { title: "Brief & research", body: "Understanding the product, the shelf it competes on, and what competitors are already doing.", detail: "Shelf & competitor analysis" },
      { title: "Structural design", body: "Dielines engineered for the format and production method before any visual design starts.", detail: "Engineered dielines" },
      { title: "Visual design", body: "Brand identity applied to the structure, tested at actual scale, not just on a screen.", detail: "Full packaging artwork" },
      { title: "Production handoff", body: "Print-ready files and production guidance, so the packaging that ships matches what was approved.", detail: "Print-ready files" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Packaging that sells before anyone reads the label",
      body: "You have about three seconds before a shopper decides whether to pick your product up or scroll past it. Structure and visual identity have to work together in that window, or the shelf does the deciding for you.",
      quote: "Packaging is the one piece of marketing every single customer holds in their hands.",
      stats: [
        { value: "Shelf-ready", label: "structural and visual design, one team" },
        { value: "Print-ready", label: "dielines, not just concepts" },
        { value: "Range-wide", label: "consistency across every SKU" },
      ],
    },
    faqs: [
      { question: "Do you design the structural packaging (dielines) or just the visual artwork?", answer: "Both. Package design here covers the physical structure (print-ready dielines engineered for your format) and the visual identity applied to it, so the two are designed together rather than handed to separate vendors." },
      { question: "Can you keep packaging consistent across a whole product range?", answer: "Yes. Range consistency is one of the core goals. A new SKU should read as clearly part of your brand as the first one did, which means designing the system, not just a single package." },
      { question: "Will the files you deliver be ready for print production?", answer: "Yes. Every packaging project ends with print-ready dielines and production guidance, not just a visual concept that still needs to be engineered by someone else." },
      { question: "How do you make sure the packaging works, not just looks good?", answer: "We review usability alongside aesthetics (how it opens, stacks, and holds up in transit), since packaging that looks great but frustrates the customer undermines the brand it's meant to support." },
    ],
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    headline: "Visuals That Command Attention",
    pillar: "Branding",
    description:
      "Custom visual assets including corporate logos, marketing collateral, business cards, brochures, infographics, and social media graphics tailored to enhance brand perception.",
    highlights: ["Marketing collateral", "Infographics", "Social graphics"],
    quickFacts: [
      { value: "6", label: "asset types, one consistent visual system" },
      { value: "100", label: "custom, no stock templates", suffix: "%" },
      { value: "1", label: "style guide, applied everywhere" },
    ],
    includedSentence: [
      { kind: "text", text: "It starts with a " },
      { kind: "term", term: "logo", title: "Logo & Brand Marks", description: "An unforgettable mark that holds up from a card to a billboard." },
      { kind: "text", text: " built to anchor everything else, extends into " },
      { kind: "term", term: "branding materials", title: "Branding Materials", description: "Business cards, letterheads, and brochures built for the boardroom." },
      { kind: "text", text: " for the boardroom, " },
      { kind: "term", term: "social graphics", title: "Social Media Graphics", description: "Visuals built for how each platform displays them." },
      { kind: "text", text: " for the feed, " },
      { kind: "term", term: "infographics", title: "Infographics & Presentations", description: "Complex data turned into graphics people actually read." },
      { kind: "text", text: " that make data worth reading, marketing " },
      { kind: "term", term: "collateral", title: "Marketing Collateral", description: "Flyers and campaign assets consistent with everything else you own." },
      { kind: "text", text: " for every campaign, and " },
      { kind: "term", term: "packaging graphics", title: "Packaging Graphics", description: "Product-ready artwork that reflects your identity on the shelf." },
      { kind: "text", text: " that carry the same identity onto the shelf." },
    ],
    approach: [
      { title: "Understand the brief", body: "Your brand goals and audience, first, so every design decision has a reason behind it.", detail: "Brand & audience brief" },
      { title: "Concept", body: "Initial directions explored and refined with your feedback from the start.", detail: "Initial design directions" },
      { title: "Design", body: "Assets built to your style guide, so everything reads as the same brand.", detail: "Final, on-brand assets" },
      { title: "Deliver", body: "Final files handed off in every format you'll need, print and digital.", detail: "Files in every format needed" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Design that's consistent everywhere your brand shows up",
      body: "The gap between a brand that looks put-together and one that looks scattered is consistency. Every asset is built against the same style guide, so nothing looks like it wandered in from a different company.",
      quote: "Every piece, from the menu to the signage, finally looks like it belongs to the same restaurant.",
      quoteAttribution: "La Via Deux",
      stats: [
        { value: "6", label: "asset types, one consistent system" },
        { value: "100", label: "custom, no stock templates", suffix: "%" },
        { value: "1", label: "style guide, applied everywhere" },
      ],
    },
    faqs: [
      { question: "What kinds of graphic design work do you take on?", answer: "Logos, business cards, brochures, social media graphics, infographics, presentations, and general marketing collateral. Anything that needs to carry your brand consistently, designed under one visual system rather than piecemeal." },
      { question: "Will my designs actually follow our brand guidelines?", answer: "Yes. Every asset is built against your brand's style guide (or the one we create for you), so a social graphic and a printed brochure read as unmistakably the same brand." },
      { question: "Do you design for both print and digital?", answer: "Both, and often at the same time. A brochure and its digital equivalent are designed to feel like the same piece, not two separate projects." },
      { question: "How many revisions are included?", answer: "We build feedback into the concept stage from the start rather than treating revisions as an afterthought. The goal is a design you're genuinely happy with, not just technically approved." },
    ],
  },
  {
    slug: "website-development",
    title: "Website Development",
    headline: "A Website That Wins You Business",
    pillar: "Build",
    description:
      "High-performance, mobile-responsive, and SEO-optimized website engineering. Handles full UX/UI design, front-end and back-end development, e-commerce integration, multi-device testing, and post-launch maintenance to convert visitors into paying clients.",
    highlights: ["UX/UI design", "Full-stack build", "E-commerce ready"],
    quickFacts: [
      { value: "Mobile-first", label: "every build, tested on real devices" },
      { value: "SEO-ready", label: "structured to rank from day one" },
      { value: "Post-launch", label: "maintenance included, not an afterthought" },
    ],
    includedSentence: [
      { kind: "text", text: "Every build starts with " },
      { kind: "term", term: "UX/UI design", title: "UX/UI Design", description: "A site designed around how people navigate and decide, not just look." },
      { kind: "text", text: " around how people actually decide, carried through front-end and back-end " },
      { kind: "term", term: "development", title: "Front-End & Back-End Development", description: "Custom-built for performance, not a bloated template stitched together." },
      { kind: "text", text: ", extended into " },
      { kind: "term", term: "e-commerce", title: "E-Commerce Integration", description: "Stores built to convert, from product pages through checkout." },
      { kind: "text", text: " where you need it, checked with " },
      { kind: "term", term: "device testing", title: "Multi-Device Testing", description: "Every build tested on real devices and screens before it goes live." },
      { kind: "text", text: " before launch, and backed by ongoing " },
      { kind: "term", term: "maintenance", title: "Ongoing Maintenance & Support", description: "Support after launch, because a website is infrastructure, not a one-off." },
      { kind: "text", text: ", on WordPress or fully " },
      { kind: "term", term: "custom builds", title: "Open-Source & Custom Builds", description: "WordPress where it fits, fully custom development where it doesn't." },
      { kind: "text", text: ", whichever fits." },
    ],
    approach: [
      { title: "Discover", body: "Understanding your business, goals, and audience before a single wireframe gets drawn.", detail: "Goals & sitemap brief" },
      { title: "Design", body: "UX/UI design focused on the shortest path from visitor to conversion.", detail: "UX/UI design & prototype" },
      { title: "Build & test", body: "Front-end and back-end development, tested rigorously across devices before launch.", detail: "Tested across every device" },
      { title: "Launch & maintain", body: "A proper launch, followed by ongoing maintenance so the site keeps performing after day one.", detail: "Ongoing support & monitoring" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "A website that's infrastructure, not a brochure",
      body: "Every page should be moving a visitor toward an enquiry, which means design, speed, and content have to work together — not get handed to three vendors who never talk to each other.",
      quote: "The kind of studio that treats your brand like it's their own.",
      quoteAttribution: "Vishnu Nair, Zica Calicut",
      stats: [
        { value: "Mobile-first", label: "responsive on every screen" },
        { value: "SEO-ready", label: "structured to rank, not just to launch" },
        { value: "Ongoing", label: "maintenance and support after launch" },
      ],
    },
    faqs: [
      { question: "Will my website work well on mobile?", answer: "Every build is designed mobile-first and tested across real devices before launch, not just checked in a browser's responsive mode. Most of your visitors will land on a phone, so the site is built for that reality first." },
      { question: "Can you build an e-commerce store, not just a brochure site?", answer: "Yes. E-commerce development is a core part of the service, covering everything from product pages and payment integration to a checkout flow built to actually convert." },
      { question: "What happens after the website launches?", answer: "Ongoing maintenance and support are included, not an afterthought: updates, fixes, and monitoring so the site keeps performing instead of quietly degrading after launch day." },
      { question: "Will the site be built to rank in search, or is that a separate project?", answer: "SEO fundamentals (site structure, page speed, technical health) are built in from the start. It's far cheaper to build a site correctly than to retrofit SEO onto one that wasn't." },
    ],
  },
  {
    slug: "video-production",
    title: "Video Production",
    headline: "Stories Worth Watching",
    pillar: "Build",
    description:
      "High-impact video storytelling spanning corporate messaging, user-generated content (UGC), product demos, explainer animations, customer testimonials, podcast video setups, and commercial ad productions optimized for YouTube, social media, and websites.",
    highlights: ["UGC & demos", "Explainer animation", "Commercial ads"],
    quickFacts: [
      { value: "8", label: "video formats, one production team" },
      { value: "Visual", label: "recall beats text, the whole case for video" },
      { value: "3", label: "channels every cut is built for: YouTube, social, web" },
    ],
    includedSentence: [
      { kind: "text", text: "Every project can pull from " },
      { kind: "term", term: "UGC & testimonials", title: "UGC & Testimonial Videos", description: "Real-customer content that builds trust faster than a polished ad." },
      { kind: "text", text: " for authenticity, " },
      { kind: "term", term: "explainer videos", title: "Explainer & Product Videos", description: "Complex ideas simplified into something people watch to the end." },
      { kind: "text", text: " that simplify what you sell, " },
      { kind: "term", term: "corporate videos", title: "Corporate & Anchor Videos", description: "Polished messaging for training, culture, or a hosted product demo." },
      { kind: "text", text: " for internal or external messaging, " },
      { kind: "term", term: "commercial ads", title: "Commercial Ads", description: "Broadcast and digital-ready ads built to land quickly, at scale." },
      { kind: "text", text: " built for a broad audience, " },
      { kind: "term", term: "podcast video", title: "Podcast Video Production", description: "Audio podcasts brought to life visually, reaching a wider audience." },
      { kind: "text", text: " for YouTube, and " },
      { kind: "term", term: "multi-platform editing", title: "Multi-Platform Editing", description: "Every cut formatted for the platform it needs to perform on." },
      { kind: "text", text: " so every cut performs where it lands." },
    ],
    approach: [
      { title: "Understand the brand", body: "A real understanding of your brand and goals before any storyboard gets drawn.", detail: "Creative brief" },
      { title: "Storyboard", body: "The story mapped out shot by shot, so filming has a clear plan to execute against.", detail: "Shot-by-shot storyboard" },
      { title: "Film", body: "Production handled by an experienced crew, whether that's a studio shoot or on-location work.", detail: "Studio or on-location shoot" },
      { title: "Edit & deliver", body: "Editing, colour, and sound polished to a result that performs, delivered everywhere you need it.", detail: "Final cuts, every platform" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Stories people actually remember",
      body: "People forget most of what they read and remember most of what they watch. A well-made video does in thirty seconds what a page of copy takes minutes to attempt.",
      quote: "They understood our event before they ever picked up a camera.",
      quoteAttribution: "Kannur Events",
      stats: [
        { value: "8", label: "video formats under one production process" },
        { value: "Full-service", label: "storyboard through final delivery" },
        { value: "Multi-platform", label: "cuts for YouTube, social, and web" },
      ],
    },
    faqs: [
      { question: "What types of videos do you produce?", answer: "UGC, explainer, product, testimonial, corporate, podcast, anchor-hosted, and commercial ads, whichever format fits the story and the platform it needs to live on." },
      { question: "Do you handle the whole process, from concept to final edit?", answer: "Yes. Storyboarding, filming, editing, colour, and sound are all handled in-house, so you're working with one accountable team instead of coordinating separate vendors." },
      { question: "Can you produce videos specifically for social media?", answer: "Yes. Formats and cuts are tailored to each platform, since a video built for YouTube rarely performs as-is on Instagram or LinkedIn without being reworked for that format." },
      { question: "How long does a typical video production project take?", answer: "It depends on format and scope. A short social cut moves much faster than a full commercial ad, but we'll give you a realistic timeline once we understand the brief." },
    ],
  },
  {
    slug: "app-development",
    title: "App Development",
    headline: "Apps Your Customers Actually Open",
    pillar: "Build",
    description:
      "Native and cross-platform mobile app engineering (iOS, Android, and hybrid builds) covering UX/UI design, backend integration, App Store and Play Store submission, and post-launch updates. Built to be used daily, not downloaded once and forgotten.",
    highlights: ["iOS & Android", "Cross-platform builds", "App Store launch"],
    quickFacts: [
      { value: "2", label: "platforms, one codebase where it makes sense" },
      { value: "25", label: "of downloaded apps are opened only once, we build against that", suffix: "%" },
      { value: "Post-launch", label: "updates included, not a one-off build" },
    ],
    includedSentence: [
      { kind: "text", text: "Every build starts with " },
      { kind: "term", term: "product strategy", title: "Product Strategy & Scoping", description: "Defining what the app needs to do before a line of code is written." },
      { kind: "text", text: " so scope never balloons mid-build, moves into " },
      { kind: "term", term: "UX/UI design", title: "App UX/UI Design", description: "Screens designed around how people actually use a phone, not a desktop shrunk down." },
      { kind: "text", text: " built for how phones are used, engineered with " },
      { kind: "term", term: "native & cross-platform development", title: "Native & Cross-Platform Development", description: "iOS, Android, or a single cross-platform codebase, whichever fits the budget and reach." },
      { kind: "text", text: " for whichever platforms you need, wired to " },
      { kind: "term", term: "backend & API integration", title: "Backend & API Integration", description: "Real data, real accounts, real payments, connected, not mocked up." },
      { kind: "text", text: ", checked with " },
      { kind: "term", term: "device testing", title: "Device & QA Testing", description: "Tested across real devices and OS versions before submission, not just one simulator." },
      { kind: "text", text: ", and carried through " },
      { kind: "term", term: "store submission", title: "App Store & Play Store Submission", description: "Listings, screenshots, and the submission process handled end-to-end." },
      { kind: "text", text: " to launch." },
    ],
    approach: [
      { title: "Scope", body: "We define what the app needs to do, for whom, and on which platforms before any design starts.", detail: "Product scope & platform brief" },
      { title: "Design", body: "UX/UI designed around real phone usage, prototyped and tested before development starts.", detail: "Prototype & UX/UI design" },
      { title: "Build & test", body: "Development across the agreed platforms, tested continuously rather than all at once at the end.", detail: "Tested across real devices" },
      { title: "Launch & maintain", body: "Store submission handled end-to-end, followed by updates so the app keeps working as OS versions change.", detail: "Ongoing updates & support" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "An app that survives past the first open",
      body: "Most apps are deleted within a week of download. The difference between that and an app people keep almost never comes down to the idea. It's whether it's fast, obvious to use, and worth opening a second time.",
      quote: "Finally an app that didn't feel like a website squeezed into a phone.",
      stats: [
        { value: "2", label: "platforms covered under one build" },
        { value: "Tested", label: "on real devices before every submission" },
        { value: "Ongoing", label: "updates after launch, not a one-off handoff" },
      ],
    },
    faqs: [
      { question: "Do you build for iOS, Android, or both?", answer: "Whichever fits your audience and budget: a single cross-platform codebase when it makes sense, fully native when performance or platform-specific features call for it. We scope this with you before committing to either." },
      { question: "Will the app connect to our existing systems?", answer: "Yes. Backend and API integration is part of the build, so the app works with real data, accounts, and payments from day one instead of shipping against a mocked-up demo." },
      { question: "Do you handle submitting the app to the App Store and Play Store?", answer: "Yes. Listings, screenshots, and the submission process are handled end-to-end, including the back-and-forth if either store requests changes before approval." },
      { question: "What happens after the app launches?", answer: "Ongoing updates are included, not an afterthought: OS versions change, devices change, and the app needs maintenance to keep working, not just a one-time handoff." },
    ],
  },
  {
    slug: "automations",
    title: "Automations",
    headline: "Work That Runs Itself",
    pillar: "Build",
    description:
      "Custom workflow automation that connects your tools, removes repetitive manual work, and keeps data moving between systems without someone copying and pasting between tabs. Built around the tools you already use, not a rip-and-replace.",
    highlights: ["Workflow automation", "Tool integrations", "Data sync"],
    quickFacts: [
      { value: "Hours", label: "of manual work removed from a team's week, typically" },
      { value: "0", label: "copy-pasting between tools once it's live" },
      { value: "24/7", label: "automations run whether or not anyone's online" },
    ],
    includedSentence: [
      { kind: "text", text: "It starts with a " },
      { kind: "term", term: "process audit", title: "Process Audit", description: "Mapping exactly where your team's time is going before automating any of it." },
      { kind: "text", text: " of where time is going, builds " },
      { kind: "term", term: "workflow automation", title: "Workflow Automation", description: "The repetitive steps handled automatically, so your team does the part that needs a person." },
      { kind: "text", text: " for the repetitive parts, connects everything through " },
      { kind: "term", term: "tool integrations", title: "Tool Integrations", description: "Your existing tools talking to each other, instead of living in separate silos." },
      { kind: "text", text: " so your stack talks to itself, keeps data flowing with " },
      { kind: "term", term: "data sync", title: "Data Sync", description: "One source of truth, kept in sync everywhere it needs to show up." },
      { kind: "text", text: ", backed by " },
      { kind: "term", term: "monitoring & alerts", title: "Monitoring & Alerts", description: "Flagged the moment something breaks, not discovered a week later." },
      { kind: "text", text: " so nothing fails silently, and documented with " },
      { kind: "term", term: "handover documentation", title: "Handover Documentation", description: "A real reference your team can use, not just a system only we understand." },
      { kind: "text", text: " your team can actually maintain." },
    ],
    approach: [
      { title: "Audit", body: "Mapping current workflows to find exactly where manual, repetitive work is costing time.", detail: "Process & time audit" },
      { title: "Design the automation", body: "Deciding what should run automatically and what still needs a human in the loop.", detail: "Automation blueprint" },
      { title: "Build & connect", body: "Tools wired together and tested against real data, not a demo environment.", detail: "Live tool integrations" },
      { title: "Monitor & refine", body: "Automations watched after launch and adjusted as your workflows change.", detail: "Ongoing monitoring" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Time your team gets back, every single week",
      body: "Manual, repetitive work doesn't feel expensive day to day. It just quietly eats hours that never show up on an invoice. Automating it gives your team back the time for the part of the job that needs a person.",
      quote: "We stopped noticing the busywork because it stopped existing.",
      stats: [
        { value: "Hours", label: "returned to the team every week" },
        { value: "Real-time", label: "data sync across every connected tool" },
        { value: "Documented", label: "so the system outlives the person who built it" },
      ],
    },
    faqs: [
      { question: "What kind of tasks can actually be automated?", answer: "Anything repetitive and rule-based: data entry, status updates, notifications, report generation, moving information between tools. The process audit tells us exactly which parts of your workflow are worth automating first." },
      { question: "Will this work with the tools we already use?", answer: "Yes. Automation is built around your existing stack through tool integrations, not a rip-and-replace of software your team already knows and relies on." },
      { question: "What happens if something breaks?", answer: "Monitoring and alerts are part of the build, so a failure gets flagged immediately instead of being discovered days later when something's already gone wrong downstream." },
      { question: "Do we need technical staff to maintain it?", answer: "No. Every automation ships with real handover documentation your team can use, so it doesn't depend on us being the only people who understand how it works." },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    headline: "Built Around How You Actually Work",
    pillar: "Build",
    description:
      "Bespoke software built for a specific process your business runs on (internal tools, dashboards, booking systems, or full platforms) for when off-the-shelf software makes you bend your process to fit it, instead of the other way around.",
    highlights: ["Internal tools", "Custom dashboards", "Platform builds"],
    quickFacts: [
      { value: "1", label: "system built around your actual process, not a template" },
      { value: "0", label: "monthly per-seat licence fees on what you own" },
      { value: "Scalable", label: "architecture built to grow with the business" },
    ],
    includedSentence: [
      { kind: "text", text: "Every build starts with a " },
      { kind: "term", term: "requirements audit", title: "Requirements Audit", description: "Understanding the exact process the software needs to support before designing it." },
      { kind: "text", text: " of the process it needs to support, moves into " },
      { kind: "term", term: "system architecture", title: "System Architecture & Planning", description: "The technical foundation planned to handle real load and real growth." },
      { kind: "text", text: " planned for real growth, gets built with " },
      { kind: "term", term: "custom development", title: "Custom Development", description: "Software written for your process, not a template bent to fit it." },
      { kind: "text", text: " around your process specifically, connected through " },
      { kind: "term", term: "integrations", title: "Third-Party Integrations", description: "Payment, data, or internal systems, connected instead of duplicated." },
      { kind: "text", text: " to what you already run, tested through " },
      { kind: "term", term: "QA & testing", title: "QA & Testing", description: "Tested against real use cases, not just the happy path." },
      { kind: "text", text: ", and backed by " },
      { kind: "term", term: "ongoing development", title: "Ongoing Development & Support", description: "Continued development as the business, and what it needs, keeps changing." },
      { kind: "text", text: " as your needs keep changing." },
    ],
    approach: [
      { title: "Discover", body: "Understanding the exact process, users, and constraints the software needs to work within.", detail: "Requirements & process map" },
      { title: "Architect", body: "Planning the technical foundation to handle real usage and future growth, not just the demo.", detail: "System architecture" },
      { title: "Build & test", body: "Development in stages you can see and test, not one long build with a single reveal at the end.", detail: "Staged builds & QA" },
      { title: "Launch & evolve", body: "A proper rollout, followed by ongoing development as the business and its needs change.", detail: "Ongoing development" },
    ],
    proof: {
      eyebrow: "Why it works",
      heading: "Software that fits the process, not the other way around",
      body: "Off-the-shelf software is built for the average business, which means every business using it is quietly working around its gaps. Custom software removes that tax. It's built around your actual process, so your team stops adapting to the tool and the tool starts working for them.",
      quote: "It does exactly what we needed, nothing we didn't ask for.",
      stats: [
        { value: "Custom", label: "built around your process, not a template" },
        { value: "Scalable", label: "architecture planned for growth from day one" },
        { value: "Ongoing", label: "development as your needs keep changing" },
      ],
    },
    faqs: [
      { question: "How is custom software different from buying an off-the-shelf tool?", answer: "Off-the-shelf software is built for the average business, so you end up adapting your process to fit the tool. Custom software is built around your actual process from the start, which is the whole point of not just buying a template." },
      { question: "Do you build internal tools, or customer-facing platforms too?", answer: "Both. Internal dashboards and operational tools follow the same process as a full customer-facing platform, just scoped to a smaller audience and simpler interface." },
      { question: "Will the software be able to grow as our business does?", answer: "Yes. System architecture and planning happen before development starts specifically so the foundation can handle real growth, not just whatever traffic the demo saw." },
      { question: "What happens after the software is built and launched?", answer: "Ongoing development and support are included, not a one-time handoff. Your needs will keep changing, and the software should keep changing with them." },
    ],
  },
];

export const PILLARS = ["Marketing", "Branding", "Build"] as const;

export const PILLAR_HEADLINES: Record<(typeof PILLARS)[number], string> = {
  Marketing: "Campaigns That Convert",
  Branding: "Identity With Intention",
  Build: "Platforms Built To Scale",
};

export function servicesByPillar(pillar: (typeof PILLARS)[number]) {
  return SERVICES.filter((s) => s.pillar === pillar);
}

// Work is organized by discipline (the 9 SERVICES above), not by client --
// a client roster reads as "look who hired us"; a discipline index reads
// as "here's what we're actually good at", which is the more useful
// question for someone deciding whether to hire a studio for THIS job.
// `services` deliberately allows more than one slug per item: a single
// engagement (e.g. Arena Animation) can be real proof for both its
// branding work and its website build, so it's shown under both.
export interface WorkItem {
  name: string; // client name -- now the byline, not the headline
  project: string; // what was actually done, framed as the headline
  services: string[]; // slugs into SERVICES; an item can span pillars
  result: string; // the outcome, in the client's or the work's own terms
  tint: string;
}

export const WORK_ITEMS: WorkItem[] = [
  {
    name: "Arena Animation",
    project: "Brand relaunch across three campuses",
    services: ["branding", "website-development"],
    result: "60% more enquiries",
    tint: "262 90% 62%",
  },
  {
    name: "Beyond Borders",
    project: "A social-first relaunch for a travel brand",
    services: ["social-media-marketing", "content-marketing"],
    result: "Consistent, on-brand content every week",
    tint: "158 64% 45%",
  },
  {
    name: "Educ Kshetra",
    project: "SEO and a website built to convert enquiries",
    services: ["website-development", "search-engine-optimization"],
    result: "Ranking for searches they didn't know they had",
    tint: "28 92% 58%",
  },
  {
    name: "La Via Deux",
    project: "One visual identity, every touchpoint",
    services: ["branding", "graphic-designing"],
    result: "Menus, signage, and socials, finally consistent",
    tint: "339 82% 60%",
  },
  {
    name: "Kannur Events",
    project: "Event coverage that outlived the event",
    services: ["video-production"],
    result: "Highlight reels that kept driving ticket sales",
    tint: "199 89% 55%",
  },
  {
    name: "Bougain Kayak",
    project: "Building a community, not just a follower count",
    services: ["social-media-marketing", "branding"],
    result: "A following that shows up season after season",
    tint: "84 70% 45%",
  },
  {
    name: "Zica Calicut",
    project: "A website built to turn visits into enquiries",
    services: ["website-development"],
    result: "The kind of site that treats every visitor like a lead",
    tint: "31 95% 56%",
  },
];

export function workForService(slug: string) {
  return WORK_ITEMS.filter((w) => w.services.includes(slug));
}

// Real photography, one file per client slug, dropped in at
// public/images/work/{slug}.jpg (landscape, ~3:2 to 16:9) -- shared by
// WorkCard and the /work hero's DriftWall so every spot a client name
// becomes a photo resolves to the same image.
export function seededImage(client: string) {
  const seed = client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/images/work/${seed}.jpg`;
}

export const PROCESS = [
  { step: "We Listen", body: "Understanding true business goals rather than pushing easy sales." },
  { step: "We Plan", body: "Developing strategy before designing a single pixel." },
  { step: "We Build", body: "Executing identity, web platforms, and campaigns with precision." },
  { step: "We Measure", body: "Tracking metrics transparently and optimizing continuously." },
];
