export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  premium?: boolean;
  body: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'first-tank-setup',
    title: 'Set up a betta habitat the right way',
    excerpt: 'Skip the cup. Cycle a 5-gallon tank, add heat and filtration, then introduce your fish.',
    minutes: 8,
    level: 'Beginner',
    body: [
      'A betta can survive in a vase. Surviving is not the same as thriving. Start with at least 5 gallons of water, a heater locked to 78°F, and a gentle sponge filter.',
      'Cycle the tank before the fish arrives. That means growing beneficial bacteria until ammonia and nitrite read 0. If you cannot wait, use a seeded sponge from an established tank and test daily.',
      'Decor should be silk or live plants, never sharp plastic. Bettas rest on broad leaves near the surface. Leave open swimming space in the middle.',
      'When you finally add the fish, float the bag for 15 minutes, then drip-acclimate. Dim the lights for the first evening so the new environment is less overwhelming.',
    ],
  },
  {
    slug: 'water-parameters',
    title: 'Water parameters that actually matter',
    excerpt: 'Temperature, ammonia, nitrite, nitrate, and pH — what to measure, how often, and when to act.',
    minutes: 6,
    level: 'Beginner',
    body: [
      'Test weekly with a liquid kit. Strips are better than nothing, but they miss ammonia and routinely misread nitrate.',
      'Target: 76–80°F, pH 6.5–7.5, ammonia 0, nitrite 0, nitrate under 20 ppm. Any ammonia or nitrite is an emergency water change.',
      'If nitrate climbs, you are overfeeding, under-changing, or both. A 25–30% weekly change with conditioned, temperature-matched water is the baseline.',
      'Log every reading. Trends catch problems days before your betta shows symptoms.',
    ],
  },
  {
    slug: 'feeding-without-bloating',
    title: 'Feed for color, not leftover waste',
    excerpt: 'Portion sizes, fasting days, and why frozen foods outperform flakes.',
    minutes: 5,
    level: 'Beginner',
    body: [
      'Two or three pellets, twice a day, is enough for most adult bettas. If food hits the substrate, you offered too much.',
      'Skip one day per week. A short fast reduces constipation and keeps the gut moving.',
      'Rotate in frozen brine shrimp or daphnia twice a week. Bloodworms are a treat, not a staple — they are rich and messy.',
      'Remove uneaten food after two minutes. Leftovers become ammonia, and ammonia becomes a vet bill.',
    ],
  },
  {
    slug: 'fin-rot-protocol',
    title: 'Fin rot: identify it early and reverse it',
    excerpt: 'Ragged edges, color loss at the tips, and the water-first treatment plan.',
    minutes: 7,
    level: 'Intermediate',
    premium: true,
    body: [
      'Fin rot is almost always a water-quality problem wearing a bacterial costume. Before you buy medication, test ammonia and nitrite and do a 40–50% water change.',
      'Raise temperature slowly to 80°F, add Indian almond leaves, and keep the current gentle. Clean the filter sponge in old tank water, never tap.',
      'If edges continue to blacken after three days of pristine water, consider a course of aquarium salt (1 tsp per gallon, dissolved before adding) or a veterinarian-directed antibiotic.',
      'Never combine multiple medications. Log photos daily so you can see progress that is easy to miss in real time.',
    ],
  },
  {
    slug: 'ich-and-velvet',
    title: 'White spots vs. gold dust: ich and velvet',
    excerpt: 'Two parasites, two timelines, one rule — treat the tank, not just the fish.',
    minutes: 9,
    level: 'Advanced',
    premium: true,
    body: [
      'Ich looks like salt sprinkled on fins and body. Velvet is a dusty gold sheen, often with clamped fins and flashing against objects.',
      'Raise temperature to 80–82°F over a few hours and increase surface agitation. Ich’s life cycle speeds up in warmth, which is what you want when treating.',
      'A dedicated ich medication can work; velvet often needs a copper or chloroquine protocol and complete darkness for a few days. Follow label dosing and remove carbon from the filter.',
      'Treat the whole tank for the full course. Stopping early leaves tomonts on the glass and the outbreak returns in a week.',
    ],
  },
  {
    slug: 'cycling-explained',
    title: 'The nitrogen cycle, without the mystique',
    excerpt: 'How ammonia becomes nitrite, then nitrate, and why rushing this step costs fish.',
    minutes: 8,
    level: 'Intermediate',
    body: [
      'Fish waste and leftover food release ammonia. Bacteria convert ammonia to nitrite, then other bacteria convert nitrite to nitrate. Nitrate leaves the tank when you change water.',
      'A cycle is complete when you can dose ammonia and see it drop to 0, then nitrite drop to 0, within 24 hours. Until then, the tank is not ready.',
      'Fishless cycling with bottled ammonia is the cleanest method. Fish-in cycling is possible but requires daily testing and large water changes. Do not guess.',
      'Live plants and a seeded sponge shorten the wait. They do not skip it.',
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
