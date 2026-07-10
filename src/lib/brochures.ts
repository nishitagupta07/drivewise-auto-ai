// Mock brochure knowledge base used to ground the RAG assistant.
// Each chunk represents a "page" from the brand's PDF brochure.

export type BrochureChunk = {
  id: string;
  section: string;
  page: number;
  text: string;
};

export type Model = {
  id: string;
  name: string;
  tagline: string;
  colors: { name: string; hex: string }[];
  specs: {
    power: string;
    torque: string;
    mileage: string;
    fuel: string;
    transmission: string;
    seating: string;
  };
  safety: string[];
  tech: string[];
  interior: string[];
  brochure: BrochureChunk[];
};

export type Brand = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  models: Model[];
};

const commonSafety = ["7 Airbags", "ADAS Level 2", "ABS with EBD", "ESC", "Hill Hold Assist"];
const commonTech = [
  "10.25\" Touchscreen",
  "Android Auto",
  "Apple CarPlay",
  "Wireless Charging",
  "Connected Car",
  "Voice Assistant",
];

function chunks(model: string, brand: string, data: Omit<BrochureChunk, "id">[]): BrochureChunk[] {
  return data.map((c, i) => ({
    ...c,
    id: `${brand}_${model}_${c.section.replace(/\s+/g, "")}_${c.page}_${String(i + 1).padStart(2, "0")}`,
  }));
}

export const BRANDS: Brand[] = [
  {
    id: "mahindra",
    name: "Mahindra",
    tagline: "Rise. Above.",
    accent: "#DC1F35",
    models: [
      {
        id: "xuv700",
        name: "XUV700",
        tagline: "Break the norm.",
        colors: [
          { name: "Everest White", hex: "#EDEEF0" },
          { name: "Midnight Black", hex: "#101012" },
          { name: "Napoli Black", hex: "#1B1D22" },
          { name: "Electric Blue", hex: "#2E6AE1" },
        ],
        specs: {
          power: "200 bhp",
          torque: "380 Nm",
          mileage: "16.0 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "6-speed AT",
          seating: "7",
        },
        safety: ["7 Airbags", "ADAS Level 2", "ABS with EBD", "ESC", "Hill Hold Assist", "Smart Pilot Assist"],
        tech: [...commonTech, "Alexa Built-in", "AdrenoX OS"],
        interior: ["Dual 10.25\" Screens", "Sky Roof", "Sony 3D Sound", "Powered Front Seats"],
        brochure: chunks("XUV700", "Mahindra", [
          { section: "Engine", page: 6, text: "The XUV700 offers a 2.0L mStallion turbo-petrol producing 200 bhp and 380 Nm, and a 2.2L mHawk diesel with up to 185 bhp and 450 Nm. Both engines pair with a 6-speed manual or 6-speed torque converter automatic." },
          { section: "Safety", page: 14, text: "Standard safety includes 7 airbags, ABS with EBD, ESC and hill hold. Higher trims add ADAS Level 2 with adaptive cruise, forward collision warning, autonomous emergency braking, lane keep assist, and smart pilot assist." },
          { section: "Performance", page: 10, text: "0-100 km/h in 8.3 s. Mileage rated at 16.0 kmpl (petrol AT) and 17.1 kmpl (diesel MT). Frequency-dependent dampers deliver a plush ride." },
          { section: "Technology", page: 22, text: "Twin 10.25\" HD screens run AdrenoX OS with Android Auto, wireless Apple CarPlay, wireless charging, Alexa Built-in, 5G-ready connected car, and OTA updates." },
          { section: "Interior", page: 18, text: "7-seater cabin with quilted leatherette, Sky Roof panoramic sunroof, powered front seats with memory, ambient lighting and Sony 12-speaker 3D sound." },
          { section: "Exterior", page: 4, text: "Signature Arrowhead grille, C-shaped LED DRLs, flush door handles that auto-present, and 18\" diamond-cut alloys." },
        ]),
      },
      {
        id: "scorpio-n",
        name: "Scorpio-N",
        tagline: "The Big Daddy of SUVs.",
        colors: [
          { name: "Napoli Black", hex: "#0F0F12" },
          { name: "Dazzling Silver", hex: "#B8BDC4" },
          { name: "Red Rage", hex: "#9E1B24" },
          { name: "Everest White", hex: "#EDEEF0" },
        ],
        specs: {
          power: "203 bhp",
          torque: "370 Nm",
          mileage: "15.4 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "6-speed AT / 4XPLOR 4WD",
          seating: "7",
        },
        safety: [...commonSafety, "6 airbags standard", "3-point seatbelts all rows"],
        tech: commonTech,
        interior: ["8\" Touchscreen", "Sunroof", "6-way powered driver seat", "Dual-zone climate"],
        brochure: chunks("ScorpioN", "Mahindra", [
          { section: "Engine", page: 5, text: "Powered by a 2.0L mStallion turbo-petrol (203 bhp / 370 Nm) or 2.2L mHawk diesel with two states of tune (130 bhp and 172 bhp)." },
          { section: "Safety", page: 12, text: "6 airbags standard, ABS with EBD, ESP, hill hold and hill descent control, plus a body-on-frame chassis with 3rd-generation Scorpio Platform." },
          { section: "Performance", page: 9, text: "0-100 km/h in 9.2 s (petrol AT). Mileage rated at 15.4 kmpl (diesel MT). 4XPLOR terrain modes: Normal, Grass/Snow, Mud/Ruts, Sand." },
          { section: "Technology", page: 20, text: "8\" HD touchscreen with wireless Android Auto and Apple CarPlay, Sony 12-speaker sound, connected car via AdrenoX Connect." },
          { section: "Interior", page: 16, text: "7-seat body-on-frame SUV with electric sunroof, 6-way powered driver seat, dual-zone climate control and 2nd row captain seats option." },
        ]),
      },
      {
        id: "thar",
        name: "Thar",
        tagline: "Reclaim your life.",
        colors: [
          { name: "Rocky Beige", hex: "#B7AA8A" },
          { name: "Napoli Black", hex: "#0F0F12" },
          { name: "Everest White", hex: "#EDEEF0" },
          { name: "Deep Forest", hex: "#1D3A2C" },
        ],
        specs: {
          power: "150 bhp",
          torque: "320 Nm",
          mileage: "15.2 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "6-speed MT / AT · 4WD",
          seating: "4",
        },
        safety: ["6 Airbags", "ABS with EBD", "ESP", "Hill Hold", "Hill Descent Control", "Roll-over Mitigation"],
        tech: ["7\" Touchscreen", "Android Auto", "Apple CarPlay", "Cruise Control"],
        interior: ["Convertible top", "Washable interior", "Adventure statistics display"],
        brochure: chunks("Thar", "Mahindra", [
          { section: "Engine", page: 4, text: "Available with a 2.0L mStallion turbo-petrol (150 bhp / 320 Nm) or 2.2L mHawk diesel (130 bhp / 300 Nm)." },
          { section: "Safety", page: 11, text: "6 airbags, ABS with EBD, ESP with roll-over mitigation, hill hold and hill descent control, and brake locking differential." },
          { section: "Performance", page: 8, text: "True 4x4 with low range. Water wading depth of 650 mm and best-in-class approach/departure angles for serious off-roading." },
          { section: "Technology", page: 15, text: "7\" HD touchscreen with Android Auto and Apple CarPlay, adventure statistics like pitch and roll, cruise control." },
          { section: "Interior", page: 13, text: "4-seat convertible with removable hardtop, washable interior with drain plugs, contrast-stitched seats." },
        ]),
      },
    ],
  },
  {
    id: "hyundai",
    name: "Hyundai",
    tagline: "New Thinking. New Possibilities.",
    accent: "#002C5F",
    models: [
      {
        id: "creta",
        name: "Creta",
        tagline: "The Ultimate SUV.",
        colors: [
          { name: "Atlas White", hex: "#F0F0F0" },
          { name: "Titan Grey", hex: "#4A4E55" },
          { name: "Ranger Khaki", hex: "#7B7057" },
          { name: "Red Mulberry", hex: "#4B1622" },
        ],
        specs: {
          power: "160 bhp",
          torque: "253 Nm",
          mileage: "17.7 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "7-speed DCT / 6-speed AT",
          seating: "5",
        },
        safety: ["6 Airbags", "ADAS Level 2", "ABS with EBD", "ESC", "VSM", "Hill Assist"],
        tech: [...commonTech, "Bose 8-speaker", "Blue Link"],
        interior: ["Dual 10.25\" screens", "Panoramic sunroof", "Ventilated front seats"],
        brochure: chunks("Creta", "Hyundai", [
          { section: "Engine", page: 6, text: "1.5L turbo-petrol produces 160 bhp and 253 Nm, paired with 7-speed DCT. 1.5L naturally aspirated petrol and 1.5L diesel are also available." },
          { section: "Safety", page: 13, text: "6 airbags standard across variants. ADAS Level 2 with 19 features including forward collision avoidance, adaptive cruise and lane keep assist. ESC, VSM and hill assist." },
          { section: "Performance", page: 9, text: "0-100 km/h in 8.5 s (1.5 turbo DCT). ARAI mileage of 17.7 kmpl (diesel) and 20.15 kmpl (petrol MT)." },
          { section: "Technology", page: 21, text: "Dual 10.25\" HD screens, wireless Android Auto and Apple CarPlay, Bose 8-speaker premium sound, wireless charging, Hyundai Blue Link connected car." },
          { section: "Interior", page: 17, text: "Panoramic sunroof, ventilated front seats, 8-way powered driver seat, ambient mood lighting with 64 colours." },
        ]),
      },
      {
        id: "venue",
        name: "Venue",
        tagline: "It's a big deal.",
        colors: [
          { name: "Polar White", hex: "#F1F1F1" },
          { name: "Titan Grey", hex: "#4A4E55" },
          { name: "Fiery Red", hex: "#B9251A" },
          { name: "Denim Blue", hex: "#20507E" },
        ],
        specs: {
          power: "118 bhp",
          torque: "172 Nm",
          mileage: "18.3 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "7-speed DCT / iMT",
          seating: "5",
        },
        safety: ["6 Airbags", "ABS with EBD", "ESC", "Hill Assist", "TPMS"],
        tech: ["8\" Touchscreen", "Android Auto", "Apple CarPlay", "Blue Link 50+ features"],
        interior: ["Electric sunroof", "Cooled glovebox", "Cruise control"],
        brochure: chunks("Venue", "Hyundai", [
          { section: "Engine", page: 5, text: "1.0L turbo-petrol with 118 bhp and 172 Nm, 1.2L Kappa petrol with 82 bhp, and 1.5L diesel with 113 bhp." },
          { section: "Safety", page: 12, text: "Up to 6 airbags, ABS with EBD, ESC, hill assist control, VSM and tyre pressure monitoring." },
          { section: "Performance", page: 8, text: "Turbo DCT delivers 0-100 km/h in around 11.4 s. Diesel returns up to 23.4 kmpl claimed." },
          { section: "Technology", page: 18, text: "8\" HD touchscreen with wireless Android Auto and Apple CarPlay, Hyundai Blue Link with 50+ features including remote AC and geofence." },
          { section: "Interior", page: 14, text: "Electric sunroof, air-cooled glovebox, cruise control and premium leatherette seats." },
        ]),
      },
      {
        id: "verna",
        name: "Verna",
        tagline: "The Turbo Sedan.",
        colors: [
          { name: "Starry Night", hex: "#0F1A2E" },
          { name: "Titan Grey", hex: "#4A4E55" },
          { name: "Fiery Red", hex: "#B9251A" },
          { name: "Atlas White", hex: "#F0F0F0" },
        ],
        specs: {
          power: "160 bhp",
          torque: "253 Nm",
          mileage: "20.6 kmpl",
          fuel: "Petrol",
          transmission: "7-speed DCT / 6-speed iMT",
          seating: "5",
        },
        safety: ["6 Airbags", "ADAS Level 2", "ABS with EBD", "ESC", "VSM", "Hill Assist"],
        tech: [...commonTech, "Bose 8-speaker"],
        interior: ["Dual 10.25\" curved screens", "Ventilated seats", "Powered driver seat"],
        brochure: chunks("Verna", "Hyundai", [
          { section: "Engine", page: 4, text: "1.5L turbo-GDi petrol with 160 bhp and 253 Nm paired with 7-speed DCT — India's most powerful C-segment sedan engine. Also available with 1.5L NA petrol and 6-speed iMT." },
          { section: "Safety", page: 13, text: "6 airbags standard. ADAS Level 2 with forward collision avoidance assist, adaptive cruise, blind spot collision warning and lane keep." },
          { section: "Performance", page: 9, text: "0-100 km/h in 8.1 s with the 1.5 turbo DCT. Mileage rated 20.6 kmpl (1.5 NA MT)." },
          { section: "Technology", page: 20, text: "Dual 10.25\" curved HD displays, Bose 8-speaker premium audio, wireless Android Auto and CarPlay, wireless charging, Blue Link connected car." },
          { section: "Interior", page: 16, text: "Ventilated front seats, 8-way powered driver seat, 64-colour ambient lighting, dual-zone climate control." },
        ]),
      },
    ],
  },
  {
    id: "tata",
    name: "Tata",
    tagline: "Connecting Aspirations.",
    accent: "#005EB8",
    models: [
      {
        id: "harrier",
        name: "Harrier",
        tagline: "Beyond boundaries.",
        colors: [
          { name: "Coral Red", hex: "#B7332A" },
          { name: "Oberon Black", hex: "#101012" },
          { name: "Pristine White", hex: "#EEEEEE" },
          { name: "Sunlit Yellow", hex: "#E9C244" },
        ],
        specs: {
          power: "170 bhp",
          torque: "350 Nm",
          mileage: "16.8 kmpl",
          fuel: "Diesel",
          transmission: "6-speed AT / MT",
          seating: "5",
        },
        safety: ["7 Airbags", "ADAS Level 2", "ABS with EBD", "ESP", "Hill Hold", "5-star GNCAP"],
        tech: [...commonTech, "JBL 10-speaker"],
        interior: ["12.3\" touchscreen", "Panoramic sunroof", "Ventilated seats"],
        brochure: chunks("Harrier", "Tata", [
          { section: "Engine", page: 6, text: "2.0L Kryotec diesel producing 170 bhp and 350 Nm, paired with 6-speed manual or 6-speed torque converter automatic." },
          { section: "Safety", page: 14, text: "7 airbags standard, 5-star Global NCAP rating for adult and child occupant protection, ADAS Level 2 with 17 features, ESP and hill hold." },
          { section: "Performance", page: 10, text: "Multi-drive modes: Eco, City, Sport plus terrain response — Normal, Rough, Wet. Mileage rated at 16.8 kmpl." },
          { section: "Technology", page: 22, text: "12.3\" Harman touchscreen, JBL 10-speaker sound, wireless Android Auto and CarPlay, iRA connected car with over-the-air updates." },
          { section: "Interior", page: 18, text: "Panoramic sunroof, ventilated leatherette seats, powered tailgate, dual-zone climate and 64-colour ambient lighting." },
        ]),
      },
      {
        id: "nexon",
        name: "Nexon",
        tagline: "Rise to the challenge.",
        colors: [
          { name: "Flame Red", hex: "#B7332A" },
          { name: "Pristine White", hex: "#EEEEEE" },
          { name: "Daytona Grey", hex: "#4A4E55" },
          { name: "Intensi-Teal", hex: "#146B7A" },
        ],
        specs: {
          power: "118 bhp",
          torque: "170 Nm",
          mileage: "17.4 kmpl",
          fuel: "Petrol / Diesel / EV",
          transmission: "7-DCT / 6-AMT",
          seating: "5",
        },
        safety: ["6 Airbags", "ABS with EBD", "ESP", "Hill Hold", "5-star GNCAP", "5-star BNCAP"],
        tech: ["10.25\" Touchscreen", "Android Auto", "Apple CarPlay", "Wireless Charging", "iRA Connected"],
        interior: ["Electric sunroof", "Ventilated seats", "Air purifier"],
        brochure: chunks("Nexon", "Tata", [
          { section: "Engine", page: 5, text: "1.2L Revotron turbo-petrol (118 bhp / 170 Nm) and 1.5L Revotorq diesel (113 bhp / 260 Nm). EV variant with 40.5 kWh battery and 465 km range." },
          { section: "Safety", page: 12, text: "6 airbags standard, 5-star Global NCAP and Bharat NCAP ratings, ESP with hill hold and roll-over mitigation." },
          { section: "Performance", page: 9, text: "0-100 km/h in about 10.9 s (turbo DCT). Multi-drive modes and terrain response." },
          { section: "Technology", page: 19, text: "10.25\" HD touchscreen, JBL 9-speaker sound, wireless Android Auto and CarPlay, wireless charging, iRA connected car with 60+ features." },
          { section: "Interior", page: 15, text: "Electric sunroof, ventilated front seats, air purifier, 9-colour ambient lighting." },
        ]),
      },
    ],
  },
  {
    id: "kia",
    name: "Kia",
    tagline: "Movement that inspires.",
    accent: "#05141F",
    models: [
      {
        id: "seltos",
        name: "Seltos",
        tagline: "Born to X-perience.",
        colors: [
          { name: "Gravity Grey", hex: "#4A4E55" },
          { name: "Clear White", hex: "#F1F1F1" },
          { name: "Intense Red", hex: "#9E1B24" },
          { name: "Sparkling Silver", hex: "#B8BDC4" },
        ],
        specs: {
          power: "158 bhp",
          torque: "253 Nm",
          mileage: "17.7 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "7-DCT / 6-iMT",
          seating: "5",
        },
        safety: ["6 Airbags", "ADAS Level 2", "ABS with EBD", "ESC", "VSM", "Hill Assist"],
        tech: [...commonTech, "Bose 8-speaker", "Kia Connect"],
        interior: ["Dual 10.25\" panoramic display", "Panoramic sunroof", "Ventilated seats"],
        brochure: chunks("Seltos", "Kia", [
          { section: "Engine", page: 6, text: "1.5L turbo-petrol with 158 bhp and 253 Nm, paired with 7-DCT. Also 1.5L NA petrol and 1.5L diesel with 6-iMT and 6-AT options." },
          { section: "Safety", page: 13, text: "6 airbags standard. ADAS Level 2 with 17 features: forward collision avoidance, smart cruise control, lane keep assist and blind spot collision warning." },
          { section: "Performance", page: 10, text: "0-100 km/h in 8.7 s (turbo DCT). ARAI mileage 17.7 kmpl (diesel) and 17.0 kmpl (petrol MT)." },
          { section: "Technology", page: 21, text: "Dual 10.25\" panoramic display, Bose 8-speaker premium sound, wireless Android Auto and Apple CarPlay, wireless charging, Kia Connect with 60+ features." },
          { section: "Interior", page: 17, text: "Panoramic sunroof, ventilated front seats, 8-way powered driver seat, dual-zone climate and 64-colour ambient lighting." },
        ]),
      },
      {
        id: "sonet",
        name: "Sonet",
        tagline: "Now with Y-attitude.",
        colors: [
          { name: "Aurora Black", hex: "#101012" },
          { name: "Glacier White", hex: "#F1F1F1" },
          { name: "Intense Red", hex: "#9E1B24" },
          { name: "Imperial Blue", hex: "#20507E" },
        ],
        specs: {
          power: "118 bhp",
          torque: "172 Nm",
          mileage: "18.4 kmpl",
          fuel: "Petrol / Diesel",
          transmission: "7-DCT / iMT",
          seating: "5",
        },
        safety: ["6 Airbags", "ADAS Level 1", "ABS with EBD", "ESC", "Hill Assist"],
        tech: ["10.25\" Touchscreen", "Android Auto", "Apple CarPlay", "Kia Connect"],
        interior: ["Electric sunroof", "Ventilated seats", "Bose sound"],
        brochure: chunks("Sonet", "Kia", [
          { section: "Engine", page: 4, text: "1.0L turbo-petrol (118 bhp), 1.2L NA petrol (82 bhp) and 1.5L diesel with two states of tune (100 bhp MT / 115 bhp AT)." },
          { section: "Safety", page: 11, text: "6 airbags standard, ADAS Level 1 with forward collision warning, ABS with EBD, ESC and hill start assist." },
          { section: "Performance", page: 8, text: "Turbo DCT clocks 0-100 km/h in about 10.7 s. Multi-drive modes: Eco, Normal, Sport." },
          { section: "Technology", page: 17, text: "10.25\" HD touchscreen with wireless Android Auto and CarPlay, Bose 7-speaker sound, Kia Connect with 70+ features." },
          { section: "Interior", page: 13, text: "Electric sunroof, ventilated front seats, air purifier and 64-colour ambient lighting." },
        ]),
      },
    ],
  },
];

export function getBrand(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id);
}
export function getModel(brandId: string, modelId: string): Model | undefined {
  return getBrand(brandId)?.models.find((m) => m.id === modelId);
}

// Retrieve top-k brochure chunks for a question using naive keyword scoring.
// This simulates the vector-search step of the RAG pipeline.
export function retrieveChunks(brandId: string, modelId: string, question: string, k = 4): BrochureChunk[] {
  const model = getModel(brandId, modelId);
  if (!model) return [];
  const q = question.toLowerCase();
  const tokens = q.split(/\W+/).filter((t) => t.length > 2);
  const scored = model.brochure.map((c) => {
    const text = (c.section + " " + c.text).toLowerCase();
    let score = 0;
    for (const t of tokens) if (text.includes(t)) score += 1;
    // domain boosts
    if (/adas|cruise|lane|collision/.test(q) && /safety/i.test(c.section)) score += 3;
    if (/airbag|safe/.test(q) && /safety/i.test(c.section)) score += 3;
    if (/mileage|kmpl|fuel|economy/.test(q) && /performance|engine/i.test(c.section)) score += 3;
    if (/engine|bhp|torque|power/.test(q) && /engine/i.test(c.section)) score += 3;
    if (/android|carplay|screen|touch|voice|connect/.test(q) && /technology/i.test(c.section)) score += 3;
    if (/sunroof|seat|interior|cabin|ambient/.test(q) && /interior/i.test(c.section)) score += 3;
    if (/exterior|alloy|wheel|led|design/.test(q) && /exterior/i.test(c.section)) score += 3;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.c);
  return top.length > 0 ? top : model.brochure.slice(0, k);
}
