import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { getEmbedUrl, getYouTubeThumbnail, toSlug } from "../lib/video";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? "file:prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const segments = [
  { name: "Music Videos", slug: "music-videos", accentColor: "#8B5CF6", sortOrder: 1, description: "From concept to cut — music videos that move as hard as the music." },
  { name: "Short Reels", slug: "short-reels", accentColor: "#EC4899", sortOrder: 2, description: "Fast, sharp, social-ready content crafted for the scroll." },
  { name: "Wedding Reels", slug: "wedding-reels", accentColor: "#F59E0B", sortOrder: 3, description: "From the first dance to the last song — your love story, cinematic forever." },
  { name: "Documentary", slug: "documentary", accentColor: "#10B981", sortOrder: 4, description: "Truth told beautifully. Stories that deserve to be seen." },
  { name: "Commercials", slug: "commercials", accentColor: "#3B82F6", sortOrder: 5, description: "Your brand, in motion. Precise, polished, and powerful." },
];

const videoData = [
  // Music Videos
  {
    segment: "music-videos",
    title: "Burna Boy — Last Last",
    videoUrl: "https://www.youtube.com/watch?v=5Y8F3oHu-dk",
    description: "A heartfelt visual narrative set against breathtaking Lagos backdrops, blending raw emotion with cinematic precision.",
    year: 2022, isFeatured: true, sortOrder: 1,
    tags: ["afrobeats", "music video", "lagos"],
  },
  {
    segment: "music-videos",
    title: "Wizkid — Essence ft. Tems",
    videoUrl: "https://www.youtube.com/watch?v=m564ooT6juQ",
    description: "Effortless summer vibes captured through warm, golden-hour cinematography and fluid camera movements.",
    year: 2021, isFeatured: true, sortOrder: 2,
    tags: ["afrobeats", "music video", "summer"],
  },
  {
    segment: "music-videos",
    title: "Davido — FEM",
    videoUrl: "https://www.youtube.com/watch?v=9d8OBjPqkqA",
    description: "High-energy visual storytelling with bold color grading and dynamic editing that amplifies every beat.",
    year: 2020, isFeatured: false, sortOrder: 3,
    tags: ["afrobeats", "music video", "davido"],
  },
  {
    segment: "music-videos",
    title: "Ayra Starr — Rush",
    videoUrl: "https://www.youtube.com/watch?v=DXHe5RQ3ACg",
    description: "A vibrant, energetic production featuring striking visuals and impeccable lighting design.",
    year: 2023, isFeatured: false, sortOrder: 4,
    tags: ["afrobeats", "music video", "ayra starr"],
  },

  // Short Reels
  {
    segment: "short-reels",
    title: "Lagos City Life — 60 Seconds",
    videoUrl: "https://www.youtube.com/watch?v=3nQNiWdeH2Q",
    description: "A fast-paced love letter to Lagos — its chaos, colour, and undeniable energy compressed into one minute.",
    year: 2023, isFeatured: true, sortOrder: 1,
    tags: ["reel", "lagos", "lifestyle"],
  },
  {
    segment: "short-reels",
    title: "Golden Hour Session",
    videoUrl: "https://www.youtube.com/watch?v=6JYIGclVQLE",
    description: "A 45-second portrait reel shot entirely during the magic hour — warm tones, long shadows, perfect light.",
    year: 2024, isFeatured: false, sortOrder: 2,
    tags: ["reel", "portrait", "golden hour"],
  },
  {
    segment: "short-reels",
    title: "Brand Lifestyle Reel",
    videoUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    description: "Social-first content for a fashion brand — dynamic cuts, on-beat transitions, and a punchy energy throughout.",
    year: 2024, isFeatured: false, sortOrder: 3,
    tags: ["reel", "brand", "fashion"],
  },

  // Wedding Reels
  {
    segment: "wedding-reels",
    title: "Tunde & Ngozi — A Love Story",
    videoUrl: "https://www.youtube.com/watch?v=l0U7SxXHkPY",
    description: "An emotional two-minute film capturing the vows, the tears, and the joy of one of the most beautiful Abuja weddings of 2023.",
    year: 2023, isFeatured: true, sortOrder: 1,
    tags: ["wedding", "abuja", "cinematic"],
  },
  {
    segment: "wedding-reels",
    title: "Emeka & Adaeze — Traditional",
    videoUrl: "https://www.youtube.com/watch?v=WHLEvnHbxJo",
    description: "A vibrant traditional ceremony in Enugu, rich with colour, culture, and an infectious joy that leaps off the screen.",
    year: 2023, isFeatured: false, sortOrder: 2,
    tags: ["wedding", "traditional", "enugu"],
  },
  {
    segment: "wedding-reels",
    title: "Kola & Fatima — Destination Wedding",
    videoUrl: "https://www.youtube.com/watch?v=UF9HvUvGbTk",
    description: "A three-minute destination wedding film shot at sunset — intimate, golden, and utterly breathtaking.",
    year: 2024, isFeatured: true, sortOrder: 3,
    tags: ["wedding", "destination", "sunset"],
  },

  // Documentary
  {
    segment: "documentary",
    title: "Streets of Lagos",
    videoUrl: "https://www.youtube.com/watch?v=EIy_P3LUkp0",
    description: "A short documentary exploring the unfiltered human stories behind the city's busiest markets and corners.",
    year: 2022, isFeatured: true, sortOrder: 1,
    tags: ["documentary", "lagos", "street"],
  },
  {
    segment: "documentary",
    title: "The Craft — Portrait of an Artist",
    videoUrl: "https://www.youtube.com/watch?v=hS5CfP8n3RE",
    description: "An intimate 8-minute profile of a Lagos-based sculptor — his process, his story, and his art.",
    year: 2023, isFeatured: false, sortOrder: 2,
    tags: ["documentary", "artist", "portrait"],
  },

  // Commercials
  {
    segment: "commercials",
    title: "MTN — Feel the Connection",
    videoUrl: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
    description: "A 30-second national broadcast commercial — clean, precise, with product-forward storytelling and broadcast-grade colour.",
    year: 2023, isFeatured: true, sortOrder: 1,
    tags: ["commercial", "telecom", "broadcast"],
  },
  {
    segment: "commercials",
    title: "Fashion Brand — Season Launch",
    videoUrl: "https://www.youtube.com/watch?v=8pZ7QN8mFJg",
    description: "A cinematic product launch video for a luxury Nigerian fashion brand — bold lighting, deliberate pacing, high impact.",
    year: 2024, isFeatured: false, sortOrder: 2,
    tags: ["commercial", "fashion", "luxury"],
  },
];

const collaborations = [
  { name: "MTN Nigeria", sortOrder: 1 },
  { name: "Burna Boy", sortOrder: 2 },
  { name: "Wizkid", sortOrder: 3 },
  { name: "Davido", sortOrder: 4 },
  { name: "Ayra Starr", sortOrder: 5 },
  { name: "Access Bank", sortOrder: 6 },
  { name: "Flutterwave", sortOrder: 7 },
  { name: "Budweiser Nigeria", sortOrder: 8 },
];

const settings = [
  { key: "about_bio", label: "About — Main Bio", value: "I'm Samwills — a visual storyteller based in Nigeria with a deep love for cinematic motion. What started as a fascination with how light falls on a face has grown into a full creative practice spanning music videos, weddings, documentaries, and brand content.\n\nI believe every project deserves to be approached with intention. I don't just show up and press record — I study the story, understand the energy, and find the frame that makes it unforgettable." },
  { key: "about_craft", label: "About — The Craft", value: "Every shoot is different but the approach is always the same: listen first, shoot second. I work with a small, focused crew so nothing gets in the way of the moment. Whether it's a 30-second commercial or a two-hour wedding film, the work is always deliberate, always human, always cinematic." },
  { key: "stat_projects", label: "Stat — Projects Completed", value: "100" },
  { key: "stat_clients", label: "Stat — Clients Served", value: "50" },
  { key: "stat_years", label: "Stat — Years of Experience", value: "5" },
  { key: "whatsapp_number", label: "WhatsApp Number", value: "+2348000000000" },
  { key: "instagram_handle", label: "Instagram Handle", value: "@visualsbysamwills" },
  { key: "tiktok_handle", label: "TikTok Handle", value: "@visualsbysamwills" },
  { key: "youtube_channel", label: "YouTube Channel", value: "Visuals by Samwills" },
  { key: "twitter_handle", label: "Twitter / X Handle", value: "@samwills" },
  { key: "contact_email", label: "Contact Email", value: "hello@visualsbysamwills.com" },
  { key: "location_text", label: "Location Text", value: "Based in Lagos · Available nationwide & internationally" },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.video.deleteMany();
  await prisma.segment.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.siteSetting.deleteMany();

  // Create segments
  const createdSegments: Record<string, string> = {};
  for (const seg of segments) {
    const created = await prisma.segment.create({ data: seg });
    createdSegments[seg.slug] = created.id;
  }
  console.log(`Created ${segments.length} segments`);

  // Create videos
  for (const v of videoData) {
    const segmentId = createdSegments[v.segment];
    const embedUrl = getEmbedUrl(v.videoUrl) ?? undefined;
    const thumbnailUrl = getYouTubeThumbnail(v.videoUrl) ?? undefined;
    const slug = toSlug(v.title);

    await prisma.video.create({
      data: {
        title: v.title,
        slug,
        description: v.description,
        segmentId,
        videoUrl: v.videoUrl,
        embedUrl,
        thumbnailUrl,
        tags: JSON.stringify(v.tags),
        year: v.year,
        status: "PUBLISHED",
        isFeatured: v.isFeatured,
        sortOrder: v.sortOrder,
      },
    });
  }
  console.log(`Created ${videoData.length} videos`);

  // Create collaborations
  for (const collab of collaborations) {
    await prisma.collaboration.create({ data: collab });
  }
  console.log(`Created ${collaborations.length} collaborations`);

  // Create settings
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value },
    });
  }
  console.log(`Created ${settings.length} site settings`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
