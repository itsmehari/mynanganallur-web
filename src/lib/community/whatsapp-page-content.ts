import type { FaqItem } from "@/lib/seo/faq-jsonld";

/** AEO / GEO: natural question + extractable direct answer (visible on page). */
export const WHATSAPP_GEO_QUESTION =
  "What is the My Nanganallur WhatsApp group and how do I join?";

export const WHATSAPP_GEO_DIRECT_ANSWER =
  "The My Nanganallur WhatsApp group is a free neighbourhood community for residents, businesses, students and well-wishers in Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam and nearby Chennai areas. Tap Join on WhatsApp on this page to open the invite link — you can then request access from the group admins.";

export const WHATSAPP_USE_CASES = [
  {
    title: "Local news & area updates",
    body: "Ward notices, civic alerts, Metro changes and neighbourhood headlines that affect daily life.",
  },
  {
    title: "Community events & announcements",
    body: "Temple festivals, RWA notices, blood drives, workshops and public gatherings.",
  },
  {
    title: "Job vacancies & local hiring",
    body: "Openings at shops, schools, offices and homes — shared by employers and residents.",
  },
  {
    title: "Rental & property listings",
    body: "Flats, houses and land for rent or sale with location and contact details.",
  },
  {
    title: "Local business & service promotions",
    body: "Useful offers from neighbourhood shops and professionals — without repeated spam.",
  },
  {
    title: "Buy, sell & exchange",
    body: "Second-hand goods, furniture, cycles and other items between neighbours.",
  },
  {
    title: "Civic issues & public services",
    body: "Water, waste, roads, streetlights and other ward-level concerns.",
  },
  {
    title: "Recommendations",
    body: "Trusted referrals for shops, tutors, clinics, electricians and other providers.",
  },
  {
    title: "Lost & found alerts",
    body: "Quick neighbourhood help when something is misplaced or found nearby.",
  },
  {
    title: "Emergency & neighbourhood support",
    body: "Urgent local help — always verify critical alerts before forwarding.",
  },
] as const;

export const WHATSAPP_WEBSITE_BENEFITS = [
  "Publish and discover local news and area updates",
  "Submit events and public announcements",
  "Post job vacancies and hiring requirements",
  "Share rental and property listings",
  "Promote local businesses and professional services",
  "Publish useful community information",
  "Reach people beyond the WhatsApp group",
  "Keep important information available for longer",
] as const;

export const WHATSAPP_GUIDELINES = [
  "Share content relevant to Nanganallur and nearby areas.",
  "Avoid spam, misleading advertisements and repeated promotional posts.",
  "Avoid political arguments, religious debates, personal attacks and offensive content.",
  "Verify news, alerts and emergency information before forwarding.",
  "Do not share another person's private information, photographs or phone number without permission.",
  "Local businesses may share useful services and offers, but repeated posting should be avoided.",
  "Job, rental, property, product and service posts should include clear details, location and contact information.",
  "Verify sellers, buyers, employers, properties and service providers before making payments or commitments.",
  "Communicate respectfully with all members.",
  "Administrators may remove spam, irrelevant posts or members who repeatedly violate the guidelines.",
] as const;

export const WHATSAPP_DISCLAIMER =
  "This WhatsApp group and www.mynanganallur.in are community platforms. The administrators and website team do not guarantee or endorse any product, service, job, property, seller, buyer or information shared by members.";

/** Nearby localities for on-page local SEO and internal linking context. */
export const WHATSAPP_NEARBY_LOCALITIES = [
  "Nanganallur",
  "Madipakkam",
  "Adambakkam",
  "Pazhavanthangal",
  "Puzhuthivakkam",
  "Chromepet",
  "Moovarasampet",
  "Ullagaram",
] as const;

/** AEO: questions people and LLMs ask about this community channel. */
export const WHATSAPP_FAQ: FaqItem[] = [
  {
    q: "How do I join the My Nanganallur WhatsApp group?",
    a: "Open this page on your phone, tap Join group on WhatsApp, and follow the invite link. WhatsApp will open so you can request access. Admins approve new members to keep the group useful and local.",
  },
  {
    q: "Who can join the Nanganallur community WhatsApp group?",
    a: "Residents, businesses, professionals, students and well-wishers connected to Nanganallur and nearby neighbourhoods such as Madipakkam, Adambakkam, Pazhavanthangal and Puzhuthivakkam are welcome. The group is for practical local information, not city-wide spam.",
  },
  {
    q: "What can I post in the My Nanganallur WhatsApp group?",
    a: "Local news, events, job openings, rentals and property leads, business offers, buy-sell-exchange items, civic issues, service recommendations, lost-and-found alerts and neighbourhood support — as long as posts are relevant, respectful and include clear details where needed.",
  },
  {
    q: "Is there a website for Nanganallur local news, jobs and events?",
    a: "Yes. mynanganallur.in is the organised digital platform for Nanganallur and surrounding areas. You can browse local news, jobs, properties, events and the business directory, and submit listings that stay online longer than chat forwards.",
  },
  {
    q: "Will posts from the WhatsApp group appear on mynanganallur.in?",
    a: "Useful posts may be considered for publication on the website with the permission of the person who shared them, so the information can reach a wider local audience.",
  },
  {
    q: "What are the rules for the My Nanganallur WhatsApp group?",
    a: "Keep posts local, avoid spam and repeated promotions, verify news and emergency alerts, respect privacy, include clear contact details on listings, and communicate respectfully. Admins may remove spam or members who break the guidelines.",
  },
  {
    q: "Does mynanganallur.in endorse jobs, properties or businesses shared in the group?",
    a: "No. The group and website are community platforms. Administrators do not guarantee or endorse any product, service, job, property, seller, buyer or information shared by members. Verify before you pay or commit.",
  },
];
