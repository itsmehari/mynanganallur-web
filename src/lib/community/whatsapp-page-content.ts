import type { FaqItem } from "@/lib/seo/faq-jsonld";

/** AEO / GEO: natural question + extractable direct answer (visible on page). */
export const WHATSAPP_GEO_QUESTION =
  "What is the My Nanganallur WhatsApp group and how do I join?";

export const WHATSAPP_GEO_DIRECT_ANSWER =
  "The My Nanganallur WhatsApp group is a free neighbourhood community for residents, local businesses and neighbourhood activities in Nanganallur, Madipakkam, Adambakkam, Pazhavanthangal, Puzhuthivakkam and nearby Chennai areas. Tap Join group on WhatsApp on this page to open the invite and request access. Only text, photographs and posters are allowed, and each business may share one promotion a day.";

export const WHATSAPP_OBJECTIVE =
  "Our objective is to create a useful, informative and respectful platform connecting Nanganallur residents, local businesses and neighbourhood activities.";

export const WHATSAPP_PRINCIPLE = "Less noise. More useful information.";

export const WHATSAPP_PURPOSE = ["Inform", "Connect", "Support", "Grow"] as const;

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

export const WHATSAPP_RULES = [
  {
    title: "Stay relevant",
    points: [
      "Share local news, civic updates, traffic alerts, public announcements, events, jobs, services and community information.",
      "Posts must be relevant to Nanganallur and surrounding neighbourhoods.",
      "Avoid unrelated topics and unnecessary forwards.",
    ],
  },
  {
    title: "Avoid lengthy conversations",
    points: [
      "Keep discussions brief, meaningful and informative.",
      "Move personal conversations, extended discussions and individual enquiries to private chats.",
      "Avoid flooding the group with multiple consecutive messages.",
    ],
  },
  {
    title: "No greetings or casual forwards",
    points: [
      "No Good Morning, Good Night or routine greeting messages.",
      "No memes, jokes, motivational quotes or chain messages.",
      "Avoid unnecessary festival greetings and unrelated forwards.",
    ],
  },
  {
    title: "Permitted media formats",
    points: [
      "Only text messages, photographs and posters are permitted.",
      "No YouTube videos, reels, GIFs, audio clips, voice notes or video forwards.",
      "Avoid sharing large files and irrelevant media.",
    ],
  },
  {
    title: "Business posting guidelines",
    points: [
      "Local business promotions are welcome in moderation.",
      "Maximum one promotional post per business per day.",
      "Only text, photographs and posters are permitted.",
      "Avoid repetitive advertisements, multiple versions of the same promotion and promotional flooding.",
      "Keep advertisements concise, useful and relevant to Nanganallur residents.",
      "Preference is given to local businesses and services catering to the neighbourhood.",
    ],
  },
  {
    title: "No external group links or promotions",
    points: [
      "No invitations or links to other WhatsApp or Telegram groups.",
      "No external website promotions, affiliate links, referral links or unsolicited URLs.",
      "Essential official government, civic and emergency information links may be shared with admin approval.",
    ],
  },
  {
    title: "Respect all members",
    points: [
      "Maintain polite, professional and respectful communication.",
      "No offensive language, personal attacks, harassment or discrimination.",
      "No political campaigning, religious arguments or divisive discussions.",
      "Respect differing opinions and maintain a community-friendly environment.",
    ],
  },
  {
    title: "Share verified information",
    points: [
      "Share only accurate and credible information.",
      "No rumours, misinformation, misleading advertisements or unverified emergency alerts.",
      "Verify information before forwarding or publishing.",
    ],
  },
  {
    title: "Privacy and safety",
    points: [
      "Do not share members' personal details, phone numbers, private messages or photographs without consent.",
      "Do not contact members privately for unsolicited marketing or promotions.",
      "Respect everyone's privacy and personal boundaries.",
    ],
  },
  {
    title: "Admin moderation",
    points: [
      "Admins reserve the right to remove inappropriate, irrelevant or repetitive messages.",
      "Members repeatedly violating group rules may be restricted or removed without further notice.",
      "Admin decisions regarding group management are final.",
    ],
  },
] as const;

export const WHATSAPP_BUSINESS_POLICY = [
  {
    label: "Posting frequency",
    value: "Maximum 1 promotional post per business per day.",
  },
  {
    label: "Allowed formats",
    value: "Text, photographs and posters only.",
  },
  {
    label: "Content",
    value:
      "Local products, services, offers, business announcements and relevant job opportunities.",
  },
  {
    label: "Not allowed",
    value:
      "Repeated advertisements, promotional flooding, videos, external group invitations and unsolicited links.",
  },
  {
    label: "Priority",
    value: "Businesses serving Nanganallur and nearby neighbourhoods.",
  },
] as const;

export const WHATSAPP_ALLOWED = [
  "Text messages",
  "Photographs",
  "Posters",
  "Local news and civic updates",
  "Events, jobs and services",
  "One business promotion a day",
] as const;

export const WHATSAPP_NOT_ALLOWED = [
  "Good morning or good night messages",
  "Memes, jokes and chain forwards",
  "Videos, reels, GIFs and voice notes",
  "Other WhatsApp or Telegram group links",
  "Affiliate, referral and unsolicited URLs",
  "Repeated ads from the same business",
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
    a: "Local news, civic updates, traffic alerts, events, jobs, services, rentals and neighbourhood support — in text, photographs or posters only. Keep it relevant to Nanganallur and nearby areas. No videos, voice notes, greeting forwards or unrelated chain messages.",
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
    a: "Stay local and brief. Only text, photographs and posters are allowed. No greeting messages, memes, videos, voice notes or links to other groups. Each business may post one promotion a day. Share verified information, respect privacy, and avoid political or religious arguments. Admins may remove posts or members who break the rules.",
  },
  {
    q: "Does mynanganallur.in endorse jobs, properties or businesses shared in the group?",
    a: "No. The group and website are community platforms. Administrators do not guarantee or endorse any product, service, job, property, seller, buyer or information shared by members. Verify before you pay or commit.",
  },
  {
    q: "How often can a business post in the Nanganallur WhatsApp group?",
    a: "A local business may share a maximum of one promotional post per day. Use text, a photograph or a poster. Do not send repeated versions of the same offer, videos, or links to other groups.",
  },
  {
    q: "Which message formats are allowed in the My Nanganallur WhatsApp group?",
    a: "Only text messages, photographs and posters. YouTube videos, reels, GIFs, audio clips, voice notes and video forwards are not allowed.",
  },
];
