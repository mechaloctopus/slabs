/* Species library. Densities are approximate lb/ft³: "dry" at ~12% MC, "green" freshly cut.
   Shrinkage (green to oven-dry, %) is given only where published figures are well established.
   dry: 1 = easy / fast, 2 = moderate, 3 = difficult (checks, collapse, honeycomb). */
window.SPECIES = [
  {
    code: "EP", name: "Earpod", sci: "Enterolobium cyclocarpum",
    aka: ["Guanacaste", "Parota", "Elephant ear", "Conacaste", "Corotu"],
    region: "Mexico to northern South America; planted in Hawaii, Florida, the Caribbean",
    dryD: 27, greenD: 48, shrink: {t: 5.2, r: 2.0, v: 7.2}, dry: 1,
    color: ["brown", "golden", "pale sapwood"], leaf: "bipinnate", fruit: "ear-shaped pod", scent: "none", fluor: false, heavy: "light",
    id: [
      "Dark brown, curled, ear-shaped pods 7–12 cm across.",
      "Fine bipinnate (feathery) leaves, very wide spreading crown.",
      "Light wood; walnut-brown to golden heartwood with a sharp cream sapwood band.",
      "Often ribbon or wavy figure on wide slabs."
    ],
    notes: "Dries fast with little warp or checking (FPL suggests kiln schedule T6-D4 for 1″). Tension wood gives fuzzy grain when planing.",
    caution: "Dust irritates eyes, nose and throat and can cause allergies. Use a P100 respirator when sanding.",
    regs: "Not CITES-listed.",
    value: "High for wide slabs. Sold in the US mostly as parota."
  },
  {
    code: "MP", name: "Monkeypod", sci: "Samanea saman (syn. Albizia saman)",
    aka: ["Rain tree", "Suar", "Saman"],
    region: "Central and South America; widely planted across the tropics incl. Hawaii and SE Asia",
    dryD: 38, greenD: 58, shrink: null, dry: 1,
    color: ["golden", "brown", "dark streaks", "pale sapwood"], leaf: "bipinnate", fruit: "straight flat pod", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Leaflets fold up at night and before rain.",
      "Pink 'powder-puff' flowers; straight dark pods 10–20 cm with sticky sweet pulp.",
      "Umbrella-shaped crown, often wider than tall.",
      "Golden to chocolate heartwood with dark streaks, pale sapwood, frequent interlocked or curly figure."
    ],
    notes: "Low shrinkage and very stable once dry. Interlocked grain tears out in planing.",
    caution: "Dust can irritate. Respirator when sanding.",
    regs: "Not CITES-listed.",
    value: "High. Wide live-edge monkeypod (suar) is a staple of the tabletop market."
  },
  {
    code: "NR", name: "Narra (\"Burmese rosewood\")", sci: "Pterocarpus indicus",
    aka: ["Burmese rosewood", "Amboyna", "Malay padauk", "Andaman redwood", "Pashu padauk", "PNG rosewood"],
    region: "SE Asia and the Pacific; common street and park tree in Hawaii, Florida and the tropics",
    dryD: 41, greenD: 58, shrink: null, dry: 2,
    color: ["golden", "red", "orange-red", "pale sapwood"], leaf: "pinnate", fruit: "round winged disc", scent: "rose / sweet", fluor: true, heavy: "medium",
    id: [
      "Pinnate leaves with 5–11 alternate, glossy, pointed leaflets.",
      "Brief mass bloom of small fragrant yellow flowers.",
      "Seed pods are flat round discs about 4–6 cm across with a papery wing all the way round.",
      "Big buttressed trunk with drooping branch tips.",
      "Heartwood golden to blood-red, with a faint rose-like scent when freshly cut.",
      "Fluoresces: heartwood glows under a UV flashlight, and shavings soaked in water give a fluorescent extract."
    ],
    notes: "Not a true rosewood (not a Dalbergia). Stable with low shrinkage. Burls are sold as amboyna burl and are very valuable.",
    caution: "Dust can cause respiratory irritation and skin sensitization.",
    regs: "P. indicus is not CITES-listed as of this writing, but several other Pterocarpus species are (P. santalinus and the African species). Keep origin records.",
    value: "High, and very high for burl. Sell it as narra / Pterocarpus indicus so buyers aren't confused with CITES Dalbergia."
  },
  {
    code: "DR", name: "True rosewood", sci: "Dalbergia spp. (D. sissoo, D. latifolia, D. oliveri, D. bariensis, D. cochinchinensis …)",
    aka: ["Indian rosewood", "Sheesham / sissoo", "Burmese rosewood (D. oliveri / D. bariensis)", "Siamese rosewood"],
    region: "Tropical Asia, Africa and the Americas; sissoo planted widely incl. Florida and Hawaii",
    dryD: 52, greenD: 68, shrink: {t: 5.8, r: 2.7, v: 8.5}, dry: 2,
    color: ["purple-brown", "dark chocolate", "black streaks", "red", "pale sapwood"], leaf: "pinnate", fruit: "thin strap pod", scent: "rose / sweet", fluor: false, heavy: "heavy",
    id: [
      "Heavy, dense and oily. Dry pieces of many species barely float or sink.",
      "Strong sweet or spicy scent when freshly cut or sanded.",
      "Purple-brown to dark chocolate heartwood with black streaks and a sharp line to pale sapwood.",
      "Pinnate leaves; thin, flat, strap-shaped pods with 1–4 seeds.",
      "Does not fluoresce (use this to separate it from narra)."
    ],
    notes: "Shrinkage figures shown are for East Indian rosewood (D. latifolia). Dries fairly well but slowly in thick sizes. Oily wood can resist some finishes and glues: wipe with acetone first.",
    caution: "Rosewood dust is a known sensitizer (skin and lungs). Dust collection plus respirator.",
    regs: "All Dalbergia are CITES Appendix II (D. nigra is Appendix I). Cross-border sale needs CITES permits. In the US, the Lacey Act requires you to be able to show legal origin, so keep the tree record: owner, location, date felled, photos.",
    value: "Very high, but check the regulations before you list or ship."
  },
  {
    code: "KO", name: "Koa", sci: "Acacia koa",
    aka: ["Hawaiian koa"],
    region: "Hawaii (endemic)",
    dryD: 38, greenD: 55, shrink: {t: 6.2, r: 5.5, v: 12.4}, dry: 2,
    color: ["golden", "red", "brown", "curly figure"], leaf: "sickle phyllode", fruit: "flat pod", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Mature trees carry sickle-shaped 'leaves' (phyllodes); young shoots have feathery bipinnate leaves.",
      "Golden to reddish-brown heartwood, often strongly curly (chatoyant) figure."
    ],
    notes: "Moderate drying; figured stock can distort. Air dry slowly under cover.",
    caution: "Normal dust precautions.",
    regs: "Harvesting on state and some private conservation lands needs permits. Keep salvage records.",
    value: "Very high, especially curly koa."
  },
  {
    code: "MG", name: "Mango", sci: "Mangifera indica",
    aka: ["Spalted mango"],
    region: "Tropics worldwide",
    dryD: 42, greenD: 62, shrink: null, dry: 2,
    color: ["tan", "golden", "spalted", "dark streaks"], leaf: "simple", fruit: "mango", scent: "sour when wet", fluor: false, heavy: "medium",
    id: [
      "Long, leathery, simple leaves; new growth reddish-bronze.",
      "Tan to golden wood, often streaked or spalted grey-black.",
      "Sour smell when freshly cut."
    ],
    notes: "Stains, rots and gets insects fast when green. Mill soon after felling, sticker immediately, keep air moving. Spalting adds value but punky spots need stabilizing.",
    caution: "Mango is in the cashew / poison ivy family. Sap, bark and dust can cause skin rashes. Gloves and long sleeves when milling.",
    regs: "Not CITES-listed.",
    value: "Medium; spalted and figured boards higher."
  },
  {
    code: "TK", name: "Teak", sci: "Tectona grandis",
    aka: ["Plantation teak"],
    region: "South and SE Asia; plantations throughout the tropics",
    dryD: 41, greenD: 55, shrink: {t: 5.8, r: 2.5, v: 7.2}, dry: 2,
    color: ["golden", "brown", "dark streaks"], leaf: "simple", fruit: "papery lantern", scent: "leathery / oily", fluor: false, heavy: "medium",
    id: [
      "Huge rough, sandpapery simple leaves (30–60 cm).",
      "Golden to medium brown heartwood, oily feel, leathery smell.",
      "Dulls tools fast (high silica)."
    ],
    notes: "Dries slowly but with little degrade. Very stable and rot-resistant.",
    caution: "Dust is a sensitizer. Carbide tooling; blades dull quickly.",
    regs: "Not CITES-listed. Myanmar-origin teak is restricted under sanctions and the Lacey Act.",
    value: "High."
  },
  {
    code: "MH", name: "Mahogany (big-leaf)", sci: "Swietenia macrophylla",
    aka: ["Honduran mahogany", "Genuine mahogany"],
    region: "Mexico to Amazon; planted in Hawaii, Fiji, Asia",
    dryD: 37, greenD: 50, shrink: {t: 4.1, r: 3.0, v: 7.8}, dry: 1,
    color: ["red", "brown", "pinkish"], leaf: "pinnate", fruit: "upright woody capsule", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Pinnate leaves with paired leaflets; upright pear-shaped woody seed capsules that split into winged seeds.",
      "Pinkish to reddish-brown heartwood, darkening with age; ribbon figure on quartersawn faces."
    ],
    notes: "Easy to dry, very stable.",
    caution: "Normal dust precautions.",
    regs: "CITES Appendix II (Neotropical populations). Cross-border sale requires permits. Keep records for planted trees.",
    value: "High."
  },
  {
    code: "MI", name: "Milo", sci: "Thespesia populnea",
    aka: ["Portia tree", "Pacific rosewood"],
    region: "Pacific and Indian Ocean coasts incl. Hawaii",
    dryD: 40, greenD: 58, shrink: null, dry: 2,
    color: ["brown", "red", "dark streaks", "pale sapwood"], leaf: "simple heart", fruit: "round capsule", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Heart-shaped glossy leaves.",
      "Yellow hibiscus-like flowers with a maroon center that turn pink-purple by evening.",
      "Coastal tree; chocolate to reddish heartwood with a sharp pale sapwood band."
    ],
    notes: "Stable and prized for bowls and small tables. Trunks are usually modest in size.",
    caution: "Normal dust precautions.",
    regs: "Not CITES-listed.",
    value: "High (small pieces), especially figured."
  },
  {
    code: "KM", name: "Kamani", sci: "Calophyllum inophyllum",
    aka: ["Tamanu", "Alexandrian laurel", "Beach calophyllum"],
    region: "Tropical Indo-Pacific coasts incl. Hawaii",
    dryD: 40, greenD: 60, shrink: null, dry: 3,
    color: ["red", "brown", "pinkish"], leaf: "simple glossy", fruit: "round nut", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Large glossy oval leaves with very fine parallel side veins.",
      "Fragrant white flowers; round green fruit ripening to brown with a single nut.",
      "Reddish-brown wood with strongly interlocked grain."
    ],
    notes: "Interlocked grain warps and twists in drying. Sticker every 12″, weight the stack well, dry slowly.",
    caution: "Normal dust precautions.",
    regs: "Not CITES-listed.",
    value: "Medium to high with figure."
  },
  {
    code: "EU", name: "Eucalyptus", sci: "Eucalyptus spp. (robusta, grandis, saligna, globulus …)",
    aka: ["Swamp mahogany (E. robusta)", "Rose gum (E. grandis)", "Blue gum"],
    region: "Australia; plantations in Hawaii, California, worldwide",
    dryD: 50, greenD: 68, shrink: null, dry: 3,
    color: ["red", "pinkish", "brown"], leaf: "simple", fruit: "gumnut", scent: "eucalyptus", fluor: false, heavy: "heavy",
    id: [
      "Long, sickle-shaped hanging leaves with a menthol smell when crushed.",
      "Woody cup-shaped 'gumnuts'; bark often peels in strips."
    ],
    notes: "One of the hardest woods to dry. Growth stress splits logs and slabs on cutting, and many species collapse or honeycomb in drying. Mill thick, seal instantly, air dry very slowly in shade; kiln only below 20%.",
    caution: "Some species' dust irritates.",
    regs: "Not CITES-listed.",
    value: "Low to medium unless figured."
  },
  {
    code: "AL", name: "Albizia", sci: "Falcataria falcata (syn. F. moluccana)",
    aka: ["Moluccan albizia", "Batai", "Sengon"],
    region: "SE Asia; invasive in Hawaii",
    dryD: 22, greenD: 40, shrink: null, dry: 1,
    color: ["cream", "pale"], leaf: "bipinnate", fruit: "flat pod", scent: "none", fluor: false, heavy: "light",
    id: [
      "Very fast, very tall tree with smooth pale grey-white bark and a flat-topped crown.",
      "Feathery bipinnate leaves; pale, very light wood."
    ],
    notes: "Dries fast. Decays and gets stained quickly. Low-value utility lumber; limbs are brittle and dangerous when felling.",
    caution: "Brittle trees drop large limbs without warning.",
    regs: "Not CITES-listed.",
    value: "Low. Utility and shiplap."
  },
  {
    code: "CM", name: "Camphor", sci: "Cinnamomum camphora",
    aka: ["Camphor laurel"],
    region: "East Asia; naturalized in Florida, Hawaii, Australia, the US Gulf coast",
    dryD: 33, greenD: 52, shrink: null, dry: 1,
    color: ["tan", "golden", "pinkish", "dark streaks"], leaf: "simple glossy", fruit: "small black berry", scent: "camphor", fluor: false, heavy: "medium",
    id: [
      "Glossy leaves that smell of camphor when crushed.",
      "Strong camphor smell from the fresh-cut wood that you can't miss."
    ],
    notes: "Dries fairly easily. Often has attractive figure and crotch wood.",
    caution: "Strong fumes when machining. Ventilate.",
    regs: "Not CITES-listed. Invasive in several US states.",
    value: "Medium."
  },
  {
    code: "WN", name: "Black walnut", sci: "Juglans nigra",
    aka: ["American walnut"],
    region: "Eastern North America",
    dryD: 38, greenD: 58, shrink: {t: 7.8, r: 5.5, v: 12.8}, dry: 2,
    color: ["dark chocolate", "brown", "purple-brown", "pale sapwood"], leaf: "pinnate", fruit: "husked nut", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Pinnate leaves with 15–23 leaflets; round green husked nuts.",
      "Chocolate-brown heartwood, sometimes purple tint; pale sapwood."
    ],
    notes: "Dries well if not rushed. Steaming evens sapwood color (commercial practice).",
    caution: "Juglone in the wood; some people react to the dust.",
    regs: "Thousand cankers disease quarantines restrict moving walnut logs in some states. Kiln-dried, bark-free wood is usually exempt; check your state.",
    value: "High."
  },
  {
    code: "WO", name: "White oak", sci: "Quercus alba (white oak group)",
    aka: ["American white oak"],
    region: "Eastern North America",
    dryD: 47, greenD: 63, shrink: {t: 10.5, r: 5.6, v: 16.3}, dry: 3,
    color: ["tan", "brown"], leaf: "simple lobed", fruit: "acorn", scent: "sour / vinegar", fluor: false, heavy: "heavy",
    id: [
      "Rounded leaf lobes; acorns mature in one year.",
      "Pores plugged with tyloses (clean end grain looks closed under a 10× lens). Long ray fleck on quartered faces."
    ],
    notes: "Difficult: surface checks, end checks and honeycomb if dried too fast. Air dry slowly, shaded, stickers 12–16″.",
    caution: "Tannins stain black on contact with steel and water.",
    regs: "Not CITES-listed. Oak wilt rules may limit moving logs.",
    value: "High for wide slabs."
  },
  {
    code: "RO", name: "Red oak", sci: "Quercus rubra (red oak group)",
    aka: ["Northern red oak"],
    region: "Eastern North America",
    dryD: 44, greenD: 63, shrink: {t: 8.6, r: 4.0, v: 13.7}, dry: 3,
    color: ["tan", "pinkish", "brown"], leaf: "simple lobed", fruit: "acorn", scent: "sour / vinegar", fluor: false, heavy: "heavy",
    id: [
      "Pointed, bristle-tipped leaf lobes.",
      "Open pores (you can blow through a short end-grain piece)."
    ],
    notes: "Moderate to difficult. Prone to surface checks and honeycomb in thick stock.",
    caution: "Tannin staining with steel.",
    regs: "Oak wilt rules may limit moving logs.",
    value: "Medium."
  },
  {
    code: "HM", name: "Hard maple", sci: "Acer saccharum",
    aka: ["Sugar maple", "Rock maple"],
    region: "Eastern North America",
    dryD: 44, greenD: 56, shrink: {t: 9.9, r: 4.8, v: 14.7}, dry: 2,
    color: ["cream", "pale", "curly figure", "spalted"], leaf: "simple lobed", fruit: "winged samara", scent: "none", fluor: false, heavy: "heavy",
    id: [
      "Opposite, palmately lobed leaves; paired winged seeds.",
      "Creamy white sapwood, light tan heart; tight, even grain."
    ],
    notes: "Sticker stain and grey sapwood if dried slowly or stacked wet. Dry fast with good airflow and dry stickers.",
    caution: "Normal dust precautions.",
    regs: "Asian longhorned beetle quarantines in some areas.",
    value: "Medium; figured maple high."
  },
  {
    code: "CH", name: "Black cherry", sci: "Prunus serotina",
    aka: ["American cherry"],
    region: "Eastern North America",
    dryD: 35, greenD: 45, shrink: {t: 7.1, r: 3.7, v: 11.5}, dry: 1,
    color: ["red", "pinkish", "brown", "pale sapwood"], leaf: "simple", fruit: "small black cherry", scent: "almond / bitter", fluor: false, heavy: "medium",
    id: [
      "Dark scaly 'burnt potato chip' bark on older trees.",
      "Pinkish-brown heartwood that darkens to deep red; faint almond smell when cut."
    ],
    notes: "Dries easily with little degrade.",
    caution: "Normal dust precautions.",
    regs: "Not CITES-listed.",
    value: "Medium to high."
  },
  {
    code: "SY", name: "Sycamore", sci: "Platanus occidentalis",
    aka: ["American sycamore", "Buttonwood"],
    region: "Eastern North America",
    dryD: 34, greenD: 52, shrink: {t: 8.4, r: 5.0, v: 14.2}, dry: 2,
    color: ["cream", "tan", "pale"], leaf: "simple lobed", fruit: "button ball", scent: "none", fluor: false, heavy: "medium",
    id: [
      "Patchy white, grey and tan peeling bark.",
      "Big maple-like leaves; round hanging seed balls.",
      "Large flecked rays on quartersawn faces (lacewood look)."
    ],
    notes: "Warps and twists. Heavy top weights, 12″ stickers.",
    caution: "Normal dust precautions.",
    regs: "Not CITES-listed.",
    value: "Low to medium; quartersawn higher."
  },
  {
    code: "EL", name: "Elm", sci: "Ulmus americana",
    aka: ["American elm"],
    region: "Eastern North America",
    dryD: 35, greenD: 54, shrink: {t: 9.5, r: 4.2, v: 14.6}, dry: 3,
    color: ["tan", "brown"], leaf: "simple", fruit: "winged samara", scent: "unpleasant when wet", fluor: false, heavy: "medium",
    id: [
      "Asymmetric leaf bases; vase-shaped crown.",
      "Wavy 'feathered' latewood bands on end grain; interlocked grain."
    ],
    notes: "Interlocked grain warps. Weight the stack and dry slowly.",
    caution: "Normal dust precautions.",
    regs: "Not CITES-listed.",
    value: "Low to medium."
  },
  {
    code: "XX", name: "Unknown / other", sci: "Identify before sale",
    aka: [], region: "", dryD: 40, greenD: 58, shrink: null, dry: 2,
    color: [], leaf: "", fruit: "", scent: "", fluor: false, heavy: "medium",
    id: ["Keep a leaf, pod or flower, a bark photo and a clean end-grain sample with the log record."],
    notes: "Use moderate settings until identified.",
    caution: "Treat unknown dust as a sensitizer.",
    regs: "Identify before listing or shipping. Regulated look-alikes exist.",
    value: "Unknown."
  }
];
