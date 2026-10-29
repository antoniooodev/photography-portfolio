/*
 * Site content: edit this file to change names, texts, categories,
 * projects and images.
 *
 * Images live in images/<project-slug>/. For each image `w` and `h`
 * describe its proportions (any unit works, e.g. 4 / 5 or 1200 / 1500):
 * they keep the layout from jumping while photos load and decide whether
 * an image is shown full width (landscape) or in pairs (portrait).
 *
 * The current photos are demo images from Unsplash: see CREDITS.md.
 */
window.SITE = {
  name: "Name Surname",
  // How the name is broken on the home page (one item per line).
  nameLines: ["NAME", "SUR", "NAME"],
  role: "Photographer",
  location: "Milan — London",
  email: "studio@namesurname.com",
  phone: "+39 000 000 0000",
  instagram: "https://www.instagram.com/",

  // Small line at the bottom of every page.
  credit: { label: "Powered by Antonio Tangaro", url: "https://www.antoniotangaro.dev/" },

  categories: [
    { slug: "people", title: "People" },
    { slug: "landscape", title: "Landscape" },
    { slug: "city", title: "City" },
    { slug: "still-life", title: "Still Life" },
  ],

  // The two pill buttons on the sides of the home page.
  home: { left: "people", right: "landscape" },

  info: {
    bio: "Name Surname is a photographer based between Milan and London. Their work moves between portraiture, landscape and still life, always in natural light and with a slow, observational approach to people and places.",
    availability: "Available for commissions",
    // Local time shown on the info page.
    clock: { city: "Milan", timeZone: "Europe/Rome" },
    portrait: { src: "images/info/portrait.jpg", w: 4, h: 5 },
    clients: [
      "Client One", "Client Two", "Client Three", "Client Four", "Client Five",
      "Client Six", "Client Seven", "Client Eight", "Client Nine", "Client Ten",
    ],
    representation: [
      { label: "Agency (Europe)", name: "Agency Name", email: "booking@agency.com", phone: "+44 00 0000 0000" },
    ],
  },

  projects: [
    {
      slug: "faces",
      title: "Faces",
      category: "people",
      client: "Commissioned",
      year: 2026,
      description: "Portraits made over a year of commissions, always in available light and never in a studio.",
      credits: [["Hair & Make-up", "Artist Name"], ["Assistant", "Assistant Name"]],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 4, h: 5 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 3, h: 2 },
        { src: "07.jpg", w: 4, h: 5 }, { src: "08.jpg", w: 4, h: 5 }, { src: "09.jpg", w: 4, h: 5 },
      ],
    },
    {
      slug: "northern-light",
      title: "Northern Light",
      category: "landscape",
      client: "Magazine Name",
      year: 2026,
      description: "Three weeks travelling north, following the light from first hour to dusk across mountains, cliffs and black-sand beaches.",
      credits: [["Assistant", "Assistant Name"]],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 3, h: 2 }, { src: "08.jpg", w: 4, h: 5 }, { src: "09.jpg", w: 4, h: 5 },
      ],
    },
    {
      slug: "vertical",
      title: "Vertical",
      category: "city",
      client: "Personal work",
      year: 2025,
      description: "Looking up: the geometry of towers, domes and stairwells, reduced to lines and light.",
      credits: [],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 4, h: 5 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 3, h: 2 },
        { src: "07.jpg", w: 4, h: 5 }, { src: "08.jpg", w: 4, h: 5 },
      ],
    },
    {
      slug: "wanderers",
      title: "Wanderers",
      category: "people",
      client: "Brand Name",
      year: 2025,
      description: "Campaign for an outdoor clothing brand: small figures facing very large landscapes.",
      credits: [["Creative Direction", "Director Name"], ["Styling", "Stylist Name"]],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 4, h: 5 }, { src: "08.jpg", w: 3, h: 2 },
      ],
    },
    {
      slug: "objects",
      title: "Objects",
      category: "still-life",
      client: "Brand Name",
      year: 2025,
      description: "Still lifes of tools and instruments, photographed like portraits.",
      credits: [["Set Design", "Set Designer Name"], ["Props", "Prop Stylist Name"]],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 3, h: 2 },
      ],
    },
    {
      slug: "salt-and-stone",
      title: "Salt and Stone",
      category: "landscape",
      client: "Personal work",
      year: 2024,
      description: "Coastlines worn by the sea, photographed in winter at low tide.",
      credits: [],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 3, h: 2 },
      ],
    },
    {
      slug: "quiet-hours",
      title: "Quiet Hours",
      category: "city",
      client: "Magazine Name",
      year: 2024,
      description: "An ongoing series about the hours before a city wakes up.",
      credits: [],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 3, h: 2 },
      ],
    },
    {
      slug: "after-the-rain",
      title: "After the Rain",
      category: "landscape",
      client: "Personal work",
      year: 2023,
      description: "Forests and valleys in the days after a storm, when the fog has not yet lifted.",
      credits: [],
      images: [
        { src: "01.jpg", w: 3, h: 2 }, { src: "02.jpg", w: 4, h: 5 }, { src: "03.jpg", w: 4, h: 5 },
        { src: "04.jpg", w: 3, h: 2 }, { src: "05.jpg", w: 4, h: 5 }, { src: "06.jpg", w: 4, h: 5 },
        { src: "07.jpg", w: 3, h: 2 },
      ],
    },
  ],
};
