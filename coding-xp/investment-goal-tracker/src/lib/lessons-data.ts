
export type Lesson = {
  id: string;
  title: string;
  youtubeUrl: string;
  order: number;
  badge: {
    id: string;
    name: string;
  };
};

export const lessons: Lesson[] = [
  {
    "id": "lesson1",
    "title": "Lesson 1: Intro to Investing",
    "youtubeUrl": "https://www.youtube.com/embed/qIw-yFC-HNU",
    "order": 1,
    "badge": {
      "id": "badge1",
      "name": "Investor Beginner"
    }
  },
  {
    "id": "lesson2",
    "title": "Lesson 2: Understanding Risk",
    "youtubeUrl": "https://www.youtube.com/embed/tHxwyWnNu0c",
    "order": 2,
    "badge": {
      "id": "badge2",
      "name": "Risk Master"
    }
  },
  {
    "id": "lesson3",
    "title": "Lesson 3: Compounding Power",
    "youtubeUrl": "https://www.youtube.com/embed/IP-E75FGFkU",
    "order": 3,
    "badge": {
      "id": "badge3",
      "name": "Compounder"
    }
  },
  {
    "id": "lesson4",
    "title": "Lesson 4: Investment Strategies",
    "youtubeUrl": "https://www.youtube.com/embed/hrSUq4wcd0g",
    "order": 4,
    "badge": {
      "id": "badge4",
      "name": "Strategy Builder"
    }
  },
  {
    "id": "lesson5",
    "title": "Lesson 5: Long-Term Wealth",
    "youtubeUrl": "https://www.youtube.com/embed/3UF0ymVdYLA",
    "order": 5,
    "badge": {
      "id": "badge5",
      "name": "Wealth Creator"
    }
  }
];
