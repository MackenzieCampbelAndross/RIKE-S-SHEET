export interface BibleVerse {
  text: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
}

export const CURATED_VERSES: BibleVerse[] = [
  {
    text: "I can do all things through Christ who strengthens me.",
    book: "Philippians",
    chapter: 4,
    verse: 13,
    reference: "Philippians 4:13"
  },
  {
    text: "Commit your work to the Lord, and your plans will be established.",
    book: "Proverbs",
    chapter: 16,
    verse: 3,
    reference: "Proverbs 16:3"
  },
  {
    text: "Whatever you do, work heartily, as for the Lord and not for men.",
    book: "Colossians",
    chapter: 3,
    verse: 23,
    reference: "Colossians 3:23"
  },
  {
    text: "Trust in the Lord with all your heart, and do not lean on your own understanding.",
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    reference: "Proverbs 3:5"
  },
  {
    text: "For God gave us a spirit not of fear but of power and love and self-control.",
    book: "2 Timothy",
    chapter: 1,
    verse: 7,
    reference: "2 Timothy 1:7"
  },
  {
    text: "Let us not grow weary of doing good, for in due season we will reap, if we do not give up.",
    book: "Galatians",
    chapter: 6,
    verse: 9,
    reference: "Galatians 6:9"
  },
  {
    text: "Be strong and courageous. Do not be frightened, for the Lord your God is with you wherever you go.",
    book: "Joshua",
    chapter: 1,
    verse: 9,
    reference: "Joshua 1:9"
  },
  {
    text: "The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty.",
    book: "Proverbs",
    chapter: 21,
    verse: 5,
    reference: "Proverbs 21:5"
  },
  {
    text: "Do you see a man skillful in his work? He will stand before kings; he will not stand before obscure men.",
    book: "Proverbs",
    chapter: 22,
    verse: 29,
    reference: "Proverbs 22:29"
  },
  {
    text: "And let the steadfastness have its full effect, that you may be perfect and complete, lacking in nothing.",
    book: "James",
    chapter: 1,
    verse: 4,
    reference: "James 1:4"
  },
  {
    text: "The Lord will fight for you, and you have only to be silent.",
    book: "Exodus",
    chapter: 14,
    verse: 14,
    reference: "Exodus 14:14"
  },
  {
    text: "In all toil there is profit, but mere talk tends only to poverty.",
    book: "Proverbs",
    chapter: 14,
    verse: 23,
    reference: "Proverbs 14:23"
  }
];

export function getRandomVerse(lastIndex?: number): { verse: BibleVerse; index: number } {
  let nextIdx = Math.floor(Math.random() * CURATED_VERSES.length);
  if (typeof lastIndex === 'number' && CURATED_VERSES.length > 1 && nextIdx === lastIndex) {
    nextIdx = (nextIdx + 1) % CURATED_VERSES.length;
  }
  return { verse: CURATED_VERSES[nextIdx], index: nextIdx };
}
