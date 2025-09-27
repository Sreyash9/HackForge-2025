"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AudioPlay } from "@/components/success-stories/audio-play";

type Investor = {
  name: string;
  title: string;
  bio: string;
  highlights: string[];
  link?: string;
};

const investors: Investor[] = [
  {
    name: "Warren Buffett",
    title: "CEO, Berkshire Hathaway",
    bio: "Known as the 'Oracle of Omaha', Buffett popularized value investing with discipline, patience, and a focus on durable competitive advantages (moats).",
    highlights: [
      "Began investing at age 11",
      "Focus on high-quality businesses at fair prices",
      "Famous for letters to Berkshire shareholders",
    ],
    link: "https://www.berkshirehathaway.com/letters/letters.html",
  },
  {
    name: "Peter Lynch",
    title: "Former Manager, Fidelity Magellan Fund",
    bio: "Managed the Magellan Fund (1977–1990) with outstanding returns. Advocated 'invest in what you know' and bottom-up research.",
    highlights: [
      "Popularized PEG ratio analysis",
      "Categorized stocks by growth type",
      "Emphasized scuttlebutt research",
    ],
    link: "https://www.fidelity.com/learning-center/investment-products/mutual-funds/peter-lynch",
  },
  {
    name: "Charlie Munger",
    title: "Vice Chairman, Berkshire Hathaway",
    bio: "A multidisciplinary thinker who emphasized mental models, patience, and avoiding standard stupidities over seeking brilliance.",
    highlights: [
      "Popularized latticework of mental models",
      "Advocated for worldly wisdom",
      "Focus on incentives and psychology",
    ],
    link: "https://fs.blog/charlie-munger/",
  },
  {
    name: "John C. Bogle",
    title: "Founder, Vanguard Group",
    bio: "Pioneer of index funds and champion of low-cost, long-term investing for the everyday investor.",
    highlights: [
      "Created the first index mutual fund",
      "Relentless on cost matters",
      "'Stay the course' philosophy",
    ],
    link: "https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/Pressroom-Articles/retirement/john-bogle-legacy.html",
  },
  {
    name: "Benjamin Graham",
    title: "Father of Value Investing",
    bio: "Author of The Intelligent Investor and Security Analysis; mentored Warren Buffett; introduced margin of safety and intrinsic value.",
    highlights: [
      "Margin of safety principle",
      "Intrinsic value vs. price",
      "Mr. Market allegory",
    ],
    link: "https://www.investopedia.com/terms/b/benjamin-graham.asp",
  },
];

const books: { title: string; author: string; url: string }[] = [
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    url: "https://www.goodreads.com/book/show/106835.The_Intelligent_Investor",
  },
  {
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    url: "https://www.goodreads.com/book/show/762.One_Up_On_Wall_Street",
  },
  {
    title: "Common Stocks and Uncommon Profits",
    author: "Philip A. Fisher",
    url: "https://www.goodreads.com/book/show/817.Common_Stocks_and_Uncommon_Profits_and_Other_Writings",
  },
  {
    title: "A Random Walk Down Wall Street",
    author: "Burton G. Malkiel",
    url: "https://www.goodreads.com/book/show/674.A_Random_Walk_Down_Wall_Street",
  },
  {
    title: "The Little Book of Common Sense Investing",
    author: "John C. Bogle",
    url: "https://www.goodreads.com/book/show/171127.The_Little_Book_of_Common_Sense_Investing",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Success Stories</h1>
        <p className="text-muted-foreground">
          Learn from legendary investors and explore classic books to sharpen your investing mindset.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {investors.map((inv) => {
          const narration = `${inv.name}. ${inv.title}. ${inv.bio} Highlights: ${inv.highlights.slice(0, 2).join("; ")}.`;
          const slug = inv.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
          <Card key={inv.name}>
            <CardHeader>
              <CardTitle className="text-lg">{inv.name}</CardTitle>
              <CardDescription>{inv.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{inv.bio}</p>
              <div className="flex flex-wrap gap-2">
                {inv.highlights.map((h) => (
                  <Badge key={h} variant="secondary">{h}</Badge>
                ))}
              </div>
              <div className="pt-2">
                <AudioPlay name={slug} text={narration} />
              </div>
              {inv.link && (
                <div className="pt-2">
                  <Link className="text-primary underline text-sm" href={inv.link} target="_blank" rel="noreferrer">
                    Learn more
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        );})}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Famous Investing Books</CardTitle>
          <CardDescription>Timeless reads to build a long-term edge.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            {books.map((b) => (
              <li key={b.title}>
                <Link className="underline" href={b.url} target="_blank" rel="noreferrer">
                  {b.title}
                </Link>{" "}
                <span className="text-muted-foreground">— {b.author}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
