// Portfolio Daten - Ersetzen Sie diese mit Ihren eigenen Bildern
const portfolioItems = [
    {
        id: 1,
        title: "Ocean Portrait",
        category: ["woman", "editorial", "colors"],
        image: "./assets/img/portfolio/ocean-portrait.jpg",
        description: "Editorial portrait photography in natural ocean setting",
        date: "2025-12",
        gridRowSpan: 35
    },
    {
        id: 2,
        title: "Purple Dream",
        category: ["woman", "editorial", "colors"],
        image: "./assets/img/portfolio/purple-dream.jpg",
        description: "Artistic portrait with creative color grading",
        date: "2025-11",
        gridRowSpan: 40
    },
    {
        id: 3,
        title: "Abstract Light",
        category: ["colors", "adv"],
        image: "./assets/img/portfolio/abstract-light.jpg",
        description: "Abstract composition with light and color",
        date: "2025-10",
        gridRowSpan: 25
    },
    {
        id: 4,
        title: "Red Squirrel",
        category: ["animals"],
        image: "./assets/img/portfolio/squirrel.jpg",
        description: "Wildlife photography - red squirrel in natural habitat",
        date: "2025-09",
        gridRowSpan: 45
    },
    {
        id: 5,
        title: "Loyal Companion",
        category: ["animals", "bw"],
        image: "./assets/img/portfolio/dog-bw.jpg",
        description: "Black and white pet portrait",
        date: "2025-08",
        gridRowSpan: 30
    },
    {
        id: 6,
        title: "Blue Elegance",
        category: ["woman", "colors"],
        image: "./assets/img/portfolio/blue-portrait.jpg",
        description: "Fashion portrait with bold color palette",
        date: "2025-07",
        gridRowSpan: 25
    },
    {
        id: 7,
        title: "Mountain Majesty",
        category: ["landscape"],
        image: "./assets/img/portfolio/mountain.jpg",
        description: "Dramatic mountain landscape at dusk",
        date: "2025-06",
        gridRowSpan: 30
    },
    {
        id: 8,
        title: "Coastal Serenity",
        category: ["landscape"],
        image: "./assets/img/portfolio/sunset-beach.jpg",
        description: "Peaceful coastal sunset",
        date: "2025-05",
        gridRowSpan: 28
    },
    {
        id: 9,
        title: "Autumn Mood",
        category: ["woman", "colors"],
        image: "./assets/img/portfolio/autumn-portrait.jpg",
        description: "Portrait with warm autumn tones",
        date: "2025-04",
        gridRowSpan: 30
    },
    {
        id: 10,
        title: "Modern Elegance",
        category: ["woman", "bw"],
        image: "./assets/img/portfolio/modern-bw.jpg",
        description: "Minimalist black and white portrait",
        date: "2025-03",
        gridRowSpan: 35
    },
    {
        id: 11,
        title: "Mountain Road",
        category: ["landscape"],
        image: "./assets/img/portfolio/mountain-road.jpg",
        description: "Winding road through mountain landscape",
        date: "2025-02",
        gridRowSpan: 32
    },
    {
        id: 12,
        title: "Feline Grace",
        category: ["animals", "bw"],
        image: "./assets/img/portfolio/cat-bw.jpg",
        description: "Black and white cat portrait",
        date: "2025-01",
        gridRowSpan: 28
    },
    {
        id: 13,
        title: "Natural Beauty",
        category: ["woman", "editorial"],
        image: "./assets/img/portfolio/natural-beauty.jpg",
        description: "Natural light editorial portrait",
        date: "2024-12",
        gridRowSpan: 33
    },
    {
        id: 14,
        title: "Urban Explorer",
        category: ["man", "editorial"],
        image: "./assets/img/portfolio/urban-man.jpg",
        description: "Urban lifestyle photography",
        date: "2024-11",
        gridRowSpan: 38
    },
    {
        id: 15,
        title: "Alpine Sunrise",
        category: ["landscape"],
        image: "./assets/img/portfolio/alpine-sunrise.jpg",
        description: "First light in the Alps",
        date: "2024-10",
        gridRowSpan: 30
    }
];

// Exportiere für Verwendung in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioItems;
}
