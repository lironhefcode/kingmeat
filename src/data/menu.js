// Menu, prices and options as listed on the restaurant's Wolt page (Kfar Saba), October 2026.

// Build an option group. Options are either a label or [label, price].
function group(id, title, summary, type, options, extra = {}) {
  return {
    id,
    title,
    summary,
    type,
    ...extra,
    options: options.map((o, i) => {
      const [label, price = 0] = Array.isArray(o) ? o : [o];
      return { id: `${id}-${i}`, label, price };
    }),
  };
}

const sizeGroup = (title, double, triple) =>
  group("size", title, "", "single", ["רגיל", ["מילוי כפול", double], ["מילוי משולש", triple]]);

const BREAD = group("bread", "לחם", "", "single", ["ג'בטה לבנה מתנור לבנים", "ג'בטה מחיטה מלאה"]);

const REMOVE = group("remove", "להוריד מהמנה", "בלי", "multi", [
  "גוואקמולי",
  "צ'ימיצ'ורי",
  "חסה",
  "בצל",
  "עגבנייה",
  "חמוצים",
  "רוטב שום",
  "צ'יפוטלה",
  "קארי",
]);

// Salads come with everything; at least 3 ingredients have to stay
const SALAD_REMOVE = group(
  "remove",
  "להוריד מהסלט",
  "בלי",
  "multi",
  [
    "חסה",
    "עגבניות שרי",
    "קולסלאו",
    "נבטים",
    "אגוזים",
    "בוטנים",
    "אבוקדו",
    "צ'ימיצ'ורי",
    "חמוצים",
    "בצל סגול",
    "קרוטונים",
    "רוטב שום",
    "רוטב צ'יפוטלה",
    "רוטב איולי קארי",
  ],
  { max: 11, hint: "לפחות 3 מרכיבים נשארים" }
);

const SALAD_EXTRAS = group("salad-extras", "תוספות לסלט", "תוספות", "multi", [
  ["בצל מטוגן", 5],
  ["פלפל קלוי", 5],
]);

const inDish = (max) =>
  group(
    "in-dish",
    "רטבים ותוספות בתוך המנה",
    "בפנים",
    "multi",
    [
      ["פסטו", 1],
      ["סרירצ'ה", 1],
      ["צ'ילי מתוק", 1],
      ["צ'ילי חריף", 1],
      ["רוטב שזיפים", 1],
      ["בצל מטוגן", 5],
      ["גמבה מטוגנת", 5],
      ["ביצה", 7],
      ["פורטבלו", 8],
    ],
    { max, hint: `עד ${max}` }
  );

const SIDE_SAUCES = group("side-sauces", "רטבים בצד", "בצד", "multi", [
  ["קטשופ", 2],
  ["מיונז", 2],
  ["פסטו", 2],
  ["סרירצ'ה", 2],
  ["צ'ילי מתוק", 2],
  ["צ'ילי חריף", 2],
  ["רוטב שזיפים", 2],
  ["רוטב שום", 2],
  ["צ'יפוטלה", 2],
  ["קארי", 2],
  ["שמן זית לימון", 2],
  ["ממרח זיתים", 2],
  ["ברביקיו", 2],
  ["גוואקמולי", 2],
  ["חלפיניו", 2],
]);

const GARLIC = group("garlic", "שום קונפי", "שום קונפי", "multi", [
  ["בתוך המנה", 5],
  ["בצד", 7],
]);

const COMBO_DRINK = group(
  "drink",
  "שתייה לעסקית",
  "שתייה",
  "single",
  ["קוקה קולה", "קוקה קולה זירו", "ספרייט", "ספרייט זירו"],
  { showDefault: true }
);

// The four fillings, each served three ways
export const FILLINGS = [
  { id: "meat", name: "קינג מיט", sub: "רצועות אנטריקוט" },
  { id: "chicken", name: "קינג צ'יקן", sub: "רצועות עוף" },
  { id: "burger", name: "קינג בורגר", sub: "המבורגר" },
  { id: "porto", name: "קינג פורטו", sub: "פטריות פורטבלו", veg: true },
];

const isPorto = (f) => f === "porto";

export const FORMATS = [
  {
    id: "sandwich",
    label: "כריך",
    plural: "כריכים",
    photo: "sandwich",
    desc: "ג'בטה מתנור לבנים או מחיטה מלאה, עם אבוקדו, צ'ימיצ'ורי, חסה, עגבנייה, בצל, חמוצים ורטבי שום, צ'יפוטלה וקארי.",
    names: { meat: "כריך קינג מיט", chicken: "כריך קינג צ'יקן", burger: "כריך קינג בורגר", porto: "כריך קינג פורטו" },
    prices: { meat: 69, chicken: 69, burger: 69, porto: 65 },
    groups: (f) => [
      isPorto(f) ? sizeGroup("גודל המנה", 18, 35) : sizeGroup("גודל המנה", 25, 44),
      BREAD,
      REMOVE,
      inDish(6),
      SIDE_SAUCES,
      GARLIC,
    ],
  },
  {
    id: "roll",
    label: "טורטייה",
    plural: "טורטייה",
    photo: "roll",
    desc: "טורטייה עם אבוקדו, צ'ימיצ'ורי, חסה, עגבנייה, בצל, חמוצים ורטבי שום, צ'יפוטלה וקארי.",
    names: { meat: "קינג רול", chicken: "צ'יקן רול", burger: "בורגר רול", porto: "פורטו רול" },
    prices: { meat: 69, chicken: 69, burger: 69, porto: 65 },
    groups: (f) => [
      isPorto(f) ? sizeGroup("גודל הרול", 18, 34) : sizeGroup("גודל הרול", 25, 44),
      REMOVE,
      inDish(6),
      SIDE_SAUCES,
      GARLIC,
    ],
  },
  {
    id: "salad",
    label: "סלט",
    plural: "סלטים",
    photo: "salad",
    desc: "חסה, עגבניות שרי, קולסלאו, נבטים, אגוזים, בוטנים, אבוקדו, צ'ימיצ'ורי, חמוצים, בצל סגול וקרוטונים, ברטבי שום, צ'יפוטלה ואיולי קארי. אפשר להוריד מה שלא בא לכם.",
    names: { meat: "סלט אנטריקוט", chicken: "סלט צ'יקן", burger: "סלט המבורגר", porto: "סלט פורטבלו" },
    prices: { meat: 69, chicken: 69, burger: 69, porto: 65 },
    groups: (f) => [
      isPorto(f) ? sizeGroup("תוספת מילוי", 16, 34) : sizeGroup("תוספת מילוי", 25, 44),
      SALAD_REMOVE,
      SALAD_EXTRAS,
      inDish(8),
      GARLIC,
    ],
  },
];

// Store photos that show the wrong dish are swapped for a matching one.
// The portobello sandwich photo in the old store was the burger photo; a vegetarian
// dish shouldn't show a meat patty, so it uses the portobello salad shot instead.
const PHOTO_OVERRIDES = { "sandwich-porto": "salad-porto" };

export function photoFor(formatId, fillingId) {
  const { photo } = FORMATS.find((f) => f.id === formatId);
  const name = `${photo}-${fillingId}`;
  return `/images/${PHOTO_OVERRIDES[name] ?? name}.jpg`;
}

const mains = FORMATS.flatMap((format) =>
  FILLINGS.map((filling) => ({
    id: `${format.id}-${filling.id}`,
    category: "mains",
    format: format.id,
    filling: filling.id,
    name: format.names[filling.id],
    sub: filling.sub,
    desc: format.desc,
    price: format.prices[filling.id],
    image: photoFor(format.id, filling.id),
    badge: filling.veg ? "צמחוני" : undefined,
    groups: format.groups(filling.id),
  }))
);

// Meal deals: the dish plus fries and a soft drink
const combo = (id, name, formatId, fillingId, withSize = true) => ({
  id: `combo-${id}`,
  category: "combos",
  name,
  sub: "עם צ'יפס ושתייה קלה",
  desc: FORMATS.find((f) => f.id === formatId).desc,
  price: 85,
  image: photoFor(formatId, fillingId),
  groups: [
    ...(withSize ? [sizeGroup("גודל המנה", 25, 44)] : []),
    ...(formatId === "sandwich" ? [BREAD] : []),
    COMBO_DRINK,
    REMOVE,
    inDish(6),
    SIDE_SAUCES,
    GARLIC,
  ],
});

export const COMBOS = [
  combo("burger-sandwich", "עסקית כריך קינג בורגר", "sandwich", "burger"),
  combo("chicken-sandwich", "עסקית כריך קינג צ'יקן", "sandwich", "chicken"),
  combo("burger-roll", "עסקית בורגר רול", "roll", "burger"),
  combo("chicken-roll", "עסקית צ'יקן רול", "roll", "chicken", false),
];

const side = (id, name, price, desc) => ({
  id: `side-${id}`,
  category: "sides",
  name,
  desc,
  price,
  image: `/images/side-${id}.jpg`,
  groups: [],
});

export const SIDES = [
  side("king-mix", "קינג מיקס", 35, "טבעות בצל, צ'יפס וכדורי פירה"),
  side("king-fries", "קינג צ'יפס", 35, "צ'יפס בטטה"),
  side("wings", "כנפיים ברוטב הבית", 33),
  side("home-fries", "הום פרייז", 39, "ברוטב הבית"),
  side("onion-rings", "טבעות בצל", 30),
  side("potato-balls", "כדורי פירה", 30),
  side("fries", "צ'יפס אמריקאי", 29),
];

const plain = (id, category, name, price, image) => ({ id, category, name, price, image, groups: [] });

export const MEAT_PORTIONS = [
  plain("portion-meat", "portions", "מנת אנטריקוט", 30, "/images/sandwich-meat.jpg"),
  plain("portion-chicken", "portions", "מנת עוף", 30, "/images/sandwich-chicken.jpg"),
  plain("portion-burger", "portions", "מנת המבורגר", 30, "/images/sandwich-burger.jpg"),
];

export const DRINKS = [
  plain("drink-coke", "drinks", "קוקה קולה", 12, "/images/drinks/coke.png"),
  plain("drink-coke-zero", "drinks", "קוקה קולה זירו", 12, "/images/drinks/coke-zero.png"),
];

export const ITEMS = [...mains, ...COMBOS, ...SIDES, ...MEAT_PORTIONS, ...DRINKS];

// Menu sections, in the order the menu page and the home page show them
const mainsOf = (formatId) => mains.filter((m) => m.format === formatId);
export const CATEGORIES = [
  {
    id: "sandwiches",
    title: "כריכים",
    image: "/images/sandwich-chicken.jpg",
    items: mainsOf("sandwich"),
    note: "רוצים יותר מילוי? כפול ב־25 ₪ ומשולש ב־44 ₪, גם בטורטייה ובסלט. בפורטבלו התוספת זולה יותר.",
  },
  { id: "rolls", title: "טורטייה", image: "/images/roll-meat.jpg", items: mainsOf("roll") },
  { id: "salads", title: "סלטים", image: "/images/salad-meat.jpg", items: mainsOf("salad") },
  {
    id: "combos",
    title: "עסקיות",
    image: "/images/roll-chicken.jpg",
    items: COMBOS,
    note: "מנה, צ'יפס ופחית לבחירה במחיר אחד.",
  },
  { id: "sides", title: "מנצ'ס", image: "/images/side-king-mix.jpg", items: SIDES },
  { id: "portions", title: "מנת בשר בצד", image: "/images/half.jpg", items: MEAT_PORTIONS },
  { id: "drinks", title: "שתייה", image: "/images/drinks/coke.png", items: DRINKS },
];

const byId = new Map(ITEMS.map((item) => [item.id, item]));
export const getItem = (id) => byId.get(id);

// The restaurant's own ordering rules, shown with every dish that has options
export const ORDER_NOTE = "אפשר לשנות מנה רק מתוך האפשרויות שכאן, ואי אפשר לקבל את הירקות בצד.";

// Ingredients and sauces shown on the home page "what's inside" section
export const IN_EVERY_SANDWICH = REMOVE.options.map((o) => o.label);
export const ADD_INS = inDish(6).options;
export const SIDE_SAUCE_NAMES = SIDE_SAUCES.options.map((o) => o.label);
