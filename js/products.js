const products = [
    {
        id: "safire-horizon-zip-hoodie",
        name: "Safire Horizon",
        price: 60,
        description: "Heavyweight dual-zip hoodie with utility patch pockets and DTG-ready premium surface.",
        images: [
            "images/safirehorizonziphoodiegreyfront.png",
            "images/safirehorizonziphoodiegreyback.png"
        ],
        colorways: [
            {
                name: "Grey",
                hex: "#B5B5B5",
                images: [
                    "images/safirehorizonziphoodiegreyfront.png",
                    "images/safirehorizonziphoodiegreyback.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [26.77, 27.56, 28.35, 29.13, 29.92],
                shoulder: [24.02, 24.80, 25.59, 26.38, 27.17],
                chest: [24.02, 24.80, 25.59, 26.38, 27.17],
                sleeveLength: [21.46, 21.85, 22.24, 22.64, 23.03]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [68, 70, 72, 74, 76],
                shoulder: [61, 63, 65, 67, 69],
                chest: [61, 63, 65, 67, 69],
                sleeveLength: [54.5, 55.5, 56.5, 57.5, 58.5]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "This functional hoodie features a unique dual-zip design and practical patch pockets for utility-inspired style. The heavyweight fabric composition ensures warmth and durability. A versatile essential piece that bridges the gap between casual wear and technical outerwear, perfect for brands seeking functional basics. Optimized for DTG print applications.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nProduct Code\nRQ0020-C001-V2\n\nGender\nUnisex\n\nFeatures\nEffects\nZipper / Pocket\n\nFit\nOversized\n\nNeckline\nHooded\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nAutumn / Winter\n\nStyle\nBasics / Casual / Sporty / Street\n\nMaterial\nMain Fabric: 61% cotton, 39% polyester; Contrast Fabric: 100% polyester\n\nFabric Weight\n420 gsm (12.4 oz)\n\nThickness\nThick\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "oversized-wavy-grid-tshirt",
        name: "Oversized Wavy-grid Safire T-Shirt",
        price: 40,
        description: "100% cotton oversized t shirt",
        images: [
            "images/skyblueoverwavyfront.png",
            "images/skyblueoverwavyback.png",
            "images/modelpage1wavygrid.png",
            "images/wavygridmodelpage2.png",
            "images/modelai%231.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/blackoverwavyfront.png",
                    "images/blackoverwavyback.png",
                    "images/modelpage1wavygrid.png",
                    "images/wavygridmodelpage2.png",
                    "images/modelai%231.png"
                ]
            },
            {
                name: "White",
                hex: "#F5F5F5",
                images: [
                    "images/whiteoverwavyfront.png",
                    "images/whiteoverwavyback.png",
                    "images/modelpage1wavygrid.png",
                    "images/wavygridmodelpage2.png",
                    "images/modelai%231.png"
                ]
            },
            {
                name: "Coffee",
                hex: "#6F4E37",
                images: [
                    "images/coffeeoverwavyfront.png",
                    "images/coffeeoverwavyback.png",
                    "images/modelpage1wavygrid.png",
                    "images/wavygridmodelpage2.png",
                    "images/modelai%231.png"
                ]
            },
            {
                name: "Navy Blue",
                hex: "#1F3864",
                images: [
                    "images/navyblueoverwavyfront.png",
                    "images/navyblueoverwavyback.png",
                    "images/modelpage1wavygrid.png",
                    "images/wavygridmodelpage2.png",
                    "images/modelai%231.png"
                ]
            },
            {
                name: "Sky Blue",
                hex: "#87CEEB",
                images: [
                    "images/skyblueoverwavyfront.png",
                    "images/skyblueoverwavyback.png",
                    "images/modelpage1wavygrid.png",
                    "images/wavygridmodelpage2.png",
                    "images/modelai%231.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [27.95, 28.74, 29.53, 30.31, 31.10],
                shoulder: [19.68, 20.87, 22.05, 23.23, 24.41],
                chest: [20.87, 22.05, 23.23, 24.41, 25.59],
                sleeveLength: [8.66, 8.86, 9.06, 9.25, 9.45]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [71, 73, 75, 77, 79],
                shoulder: [50, 53, 56, 59, 62],
                chest: [53, 56, 59, 62, 65],
                sleeveLength: [22, 22.5, 23, 23.5, 24]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "Channeling a modern streetwear aesthetic, this Unisex Oversized T-Shirt redefines the standard blank. The silhouette features dropped shoulders and a generous width, creating that sought-after structured drape that defines current trends. Constructed from dense, heavyweight cotton, it provides a substantial canvas that holds its shape through daily wear. The smooth surface is engineered for superior DTG and DTF results, ensuring your graphics pop with retail-quality sharpness. A true essential for brands demanding impact and durability.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nProduct Code\nRT0086-C001-V2\n\nGender\nUnisex\n\nFit\nOversized\n\nNeckline\nRound Neck / O-Neck\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nShort Sleeve\n\nSeason\nSummer\n\nStyle\nBasics / Casual / Sporty\n\nMaterial\n100% cotton\n\nFabric Weight\n300 gsm (8.8 oz)\n\nThickness\nModerate\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "black-socrates-hoodie",
        name: "Socrates Hoodie",
        price: 60,
        description: "A heavyweight essential with a distressed finish and premium streetwear fit.",
        images: [
            "images/blacksocratesfront.png",
            "images/blackbacksocrates.png",
            "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
            "images/herosection2movement.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/blacksocratesfront.png",
                    "images/blackbacksocrates.png",
                    "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
                    "images/herosection2movement.png"
                ]
            },
            {
                name: "Sage",
                hex: "#4F6E66",
                images: [
                    "images/greensocratesfront.png",
                    "images/greensocratesback.png",
                    "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
                    "images/herosection2movement.png"
                ]
            },
            {
                name: "Ash",
                hex: "#8B8C82",
                images: [
                    "images/greysocratesfront.png",
                    "images/greysocratesback.png",
                    "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
                    "images/herosection2movement.png"
                ]
            },
            {
                name: "Indigo",
                hex: "#5E6480",
                images: [
                    "images/navysocratesfront.png",
                    "images/navysocratesback.png",
                    "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
                    "images/herosection2movement.png"
                ]
            },
            {
                name: "Sand",
                hex: "#B68E68",
                images: [
                    "images/brownsocratesfront.png",
                    "images/brownsocratesback.png",
                    "images/D903B3FF-3B93-4F56-B874-256C9ED6DD71.PNG",
                    "images/herosection2movement.png"
                ]
            }
        ],
        sizes: ["S", "M", "L", "XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL"],
                length: [24.80, 25.39, 25.98, 26.57],
                shoulder: [22.44, 23.23, 24.02, 24.80],
                chest: [24.41, 25.20, 25.98, 26.77],
                sleeveLength: [22.44, 22.83, 23.23, 23.62]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL"],
                length: [63, 64.5, 66, 67.5],
                shoulder: [57, 59, 61, 63],
                chest: [62, 64, 66, 68],
                sleeveLength: [57, 58, 59, 60]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        details: "This hoodie combines a vintage wash with frayed details for a look that’s both edgy and comfortable. Crafted from 360 GSM fleece, it offers warmth without sacrificing style, making it ideal for layering or wearing solo. The relaxed fit and soft texture create the perfect canvas for your custom designs, adding a personal touch to this streetwear essential.\n\nEach piece is handcrafted, ensuring its uniqueness. Minor variations from website images are natural and highlight its artisanal quality.\n\nGender\nUnisex\n\nEffects\nWashed / Frayed\n\nFit\nLoose\n\nNeckline\nHooded\n\nSleeve Length\nLong Sleeve\n\nSeason\nAutumn / Winter\n\nStyle\nCasual / Street\n\nMaterial\n42% cotton, 53% polyester, 5% other fibers\n\nFabric Weight\n360 gsm (10.6 oz)\n\nThickness\nThicken\n\nElasticity\nSlight Stretch\n\nBreathability\nHigh",
        freeShipping: true,
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "mesh-drawstring-shorts",
        name: "Mesh Drawstring Shorts",
        price: 40,
        description: "Performance mesh shorts with dual-layer breathability and an adjustable drawstring waist.",
        images: [
            "images/meshshortsblackfront.png",
            "images/meshshortsblackback.png",
            "images/meshshorts%231.png",
            "images/meshshort%232.png",
            "images/meshshorts%233.png",
            "images/meshshorts%234.png",
            "images/meshshort%235.png",
            "images/meshshorts%236.png",
            "images/meshshorts%237.png",
            "images/meshshorts%238.png",
            "images/Mesh%20Drawstring%20Shorts-mockups-21.png",
            "images/Mesh%20Drawstring%20Shorts-mockups-22.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/meshshortsblackfront.png",
                    "images/meshshortsblackback.png",
                    "images/meshshorts%231.png",
                    "images/meshshort%232.png",
                    "images/meshshorts%233.png",
                    "images/meshshorts%234.png",
                    "images/meshshort%235.png",
                    "images/meshshorts%236.png",
                    "images/meshshorts%237.png",
                    "images/meshshorts%238.png",
                    "images/Mesh%20Drawstring%20Shorts-mockups-21.png",
                    "images/Mesh%20Drawstring%20Shorts-mockups-22.png"
                ]
            },
            {
                name: "Brown",
                hex: "#6E4A3B",
                images: [
                    "images/meshshortsbrownfront.png",
                    "images/meshshortsbrownback.png"
                ]
            },
            {
                name: "Colorful Blue",
                hex: "#3E6FB2",
                images: [
                    "images/meshshortscolorfulbluefront.png",
                    "images/meshshortscolorfulblueback.png"
                ]
            },
            {
                name: "Grey",
                hex: "#8E8E8E",
                images: [
                    "images/meshshortsgreyfront.png",
                    "images/meshshortsgreyback.png"
                ]
            },
            {
                name: "Purple",
                hex: "#6B4A9E",
                images: [
                    "images/meshshortspurplefront.png",
                    "images/meshshortspurpleback.png"
                ]
            },
            {
                name: "Sky Blue",
                hex: "#6EBBEA",
                images: [
                    "images/meshshortsskybluefront.png",
                    "images/meshshortsskyblueback.png"
                ]
            },
            {
                name: "Army Green",
                hex: "#5F6B46",
                images: [
                    "images/meshshortsarmygreenfront.png",
                    "images/messhortsarmygreenback.png"
                ]
            }
        ],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [17.32, 17.72, 18.11, 18.50, 18.90, 19.29],
                waist: [13.78, 14.17, 14.57, 14.96, 15.35, 15.75],
                hip: [21.26, 22.05, 22.83, 23.62, 24.41, 25.20]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [44, 45, 46, 47, 48, 49],
                waist: [35, 36, 37, 38, 39, 40],
                hip: [54, 56, 58, 60, 62, 64]
            },
            howToMeasure: [
                {
                    title: "Waist",
                    description: "Measure straight across the top of the waistband from edge to edge."
                },
                {
                    title: "Hip",
                    description: "Measure straight across the widest hip line from edge to edge."
                },
                {
                    title: "Length",
                    description: "Measure from the waistband to the leg opening or hem."
                }
            ]
        },
        freeShipping: true,
        details: "These performance shorts feature a functional dual-layer mesh construction and a drawstring waist for optimal breathability and comfort during activity. Made from 100% polyester for moisture-wicking. An essential piece for athleisure and sportswear collections, ideal for warm-weather training or casual wear.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nProduct Code\nRK0044-P001-V3\n\nGender\nUnisex\n\nEffects\nDrawstring / Pocket\n\nFit\nLoose\n\nSeason\nSummer\n\nStyle\nBasics / Casual / Sporty\n\nMaterial\n100% polyester\n\nFabric Weight\n145 gsm (4.3 oz)\n\nBreathability\nHigh",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "borough-oversized-tshirt",
        name: "Borough Oversized T-Shirt",
        price: 40,
        description: "Streetwear oversized cotton t-shirt with a loose fit and clean custom-ready print areas.",
        images: [
            "images/frontwhiteborough.png",
            "images/backwhiteborough.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#0A0A0A",
                images: [
                    "images/frontblackborough.png",
                    "images/backblackborough.png"
                ]
            },
            {
                name: "White",
                hex: "#F4F4F4",
                images: [
                    "images/frontwhiteborough.png",
                    "images/backwhiteborough.png"
                ]
            }
        ],
        sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
        sizeGuide: {
            inches: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
                length: [29.33, 29.72, 30.12, 30.51, 31.30, 32.09, 32.87, 33.66],
                shoulder: [18.11, 18.90, 19.68, 20.47, 21.65, 22.83, 24.02, 25.20],
                chest: [22.05, 22.83, 23.62, 24.41, 25.59, 26.77, 27.95, 29.13],
                sleeveLength: [7.28, 7.87, 8.46, 8.66, 8.86, 9.06, 9.25, 9.45]
            },
            centimeters: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
                length: [74.5, 75.5, 76.5, 77.5, 79.5, 81.5, 83.5, 85.5],
                shoulder: [46, 48, 50, 52, 55, 58, 61, 64],
                chest: [56, 58, 60, 62, 65, 68, 71, 74],
                sleeveLength: [18.5, 20, 21.5, 22, 22.5, 23, 23.5, 24]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "Clean, comfortable, and made to be styled your way. This 180 gsm oversized tee is crafted from slightly stretchy cotton-spandex and features a loose silhouette with a round neckline and short sleeves. With generous front and back print areas, it is ideal for both statement graphics and subtle branding.\n\nBatch variations are normal due to factors like temperature and materials, and we strive to minimize these differences as much as possible. We appreciate your understanding.\n\nProduct Code\nMT0012-C003-V3\n\nGender\nUnisex\n\nFit\nLoose\n\nNeckline\nRound Neck / O-Neck\n\nSleeve Style\nRegular Sleeve\n\nSleeve Length\nShort Sleeve\n\nSeason\nSummer\n\nStyle\nCasual\n\nMaterial\n95% cotton, 5% spandex\n\nFabric Weight\n180 gsm (5.3 oz)\n\nThickness\nModerate\n\nElasticity\nSlight Stretch\n\nBreathability\nHigh",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "vintage-crewneck",
        name: "Vintage",
        price: 60,
        description: "Classic heavyweight crewneck designed for layering or standalone wear in coordinated essential outfits.",
        images: [
            "images/vintagecrewneckapricotfront.png",
            "images/vintagecrewneckapricotback.png"
        ],
        colorways: [
            {
                name: "Apricot",
                hex: "#E6C5A8",
                images: [
                    "images/vintagecrewneckapricotfront.png",
                    "images/vintagecrewneckapricotback.png"
                ]
            },
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/vintagecrewneckblackfront.png",
                    "images/vintagecrewneckblackback.png"
                ]
            },
            {
                name: "Coffee",
                hex: "#6F4E37",
                images: [
                    "images/vintagecrewneckcoffeefront.png",
                    "images/vintagecrewneckcoffee.png"
                ]
            },
            {
                name: "Dark Grey",
                hex: "#4B4B4B",
                images: [
                    "images/vintagecrewneckdarkgreyfront.png",
                    "images/vintagecrewneckdarkgreyback.png"
                ]
            },
            {
                name: "Retro Green",
                hex: "#5E6F58",
                images: [
                    "images/vintagecrewneckretrogreenfront.png",
                    "images/vintagecrewneckretrogreenback.png"
                ]
            }
        ],
        stock: { "2XS": 10, XS: 10, S: 10, M: 10, L: 10 },
        sizes: ["2XS", "XS", "S", "M", "L"],
        sizeGuide: {
            inches: {
                sizes: ["2XS", "XS", "S", "M", "L"],
                length: [25.59, 26.38, 27.17, 27.95, 28.74],
                chest: [22.83, 23.62, 24.41, 25.20, 25.98],
                shoulder: [22.44, 23.03, 23.62, 24.21, 24.80],
                sleeveLength: [20.47, 20.87, 21.26, 21.65, 22.05]
            },
            centimeters: {
                sizes: ["2XS", "XS", "S", "M", "L"],
                length: [65, 67, 69, 71, 73],
                chest: [58, 60, 62, 64, 66],
                shoulder: [57, 58.5, 60, 61.5, 63],
                sleeveLength: [52, 53, 54, 55, 56]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "This classic crewneck sweatshirt features the same heavyweight 100% cotton construction as the rest of the collection, designed to pair seamlessly with the RK0035 pants. The versatile design serves as an ideal layering piece or standalone top. A foundational item for brands building coordinated essential outfits.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nProduct Code\nRW0045-C001-V2\n\nGender\nUnisex\n\nFit\nOversized\n\nNeckline\nRound Neck / O-Neck\n\nSleeve Style\nRegular Sleeve\n\nSleeve Length\nLong Sleeve\n\nSeason\nSpring / Autumn\n\nStyle\nBasics / Casual / Preppy / Sporty / Street\n\nMaterial\n100% cotton\n\nFabric Weight\n530 gsm (15.6 oz)\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "not-for-everyone-hoodie",
        name: "Not For Everyone Hoodie",
        price: 60,
        description: "Snow-washed zip-through hoodie with a soft textured feel and relaxed streetwear fit.",
        images: [
            "images/notforeveryonefrontblack.png",
            "images/notforeveryonebackblack.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/notforeveryonefrontblack.png",
                    "images/notforeveryonebackblack.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [24.80, 25.39, 25.98, 26.57, 27.17],
                shoulder: [22.44, 23.23, 24.02, 24.80, 25.59],
                chest: [24.41, 25.20, 25.98, 26.77, 27.56],
                sleeveLength: [22.44, 22.83, 23.23, 23.62, 24.02]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [63, 64.5, 66, 67.5, 69],
                shoulder: [57, 59, 61, 63, 65],
                chest: [62, 64, 66, 68, 70],
                sleeveLength: [57, 58, 59, 60, 61]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "Presenting the Snow Washed Zip-Through Hoodie, perfect for custom branding. This hoodie features a unique snow-washed finish, offering a soft, textured feel. The zip-through design adds versatility, making it ideal for brands looking to add a stylish, comfortable piece to their casualwear collections.\n\nBatch variations are normal due to factors like temperature and materials, and we strive to minimize these differences as much as possible. We appreciate your understanding.\n\nProduct Code\nRU0074-P001-V3\n\nGender\nUnisex\n\nModel\nGender\nMale\n\nHeight\n186 cm / 6'1\"\n\nWeight\n70 kg / 154 lbs\n\nSize\nXL\n\nEffects\nWashed / Zipper\n\nFit\nLoose\n\nNeckline\nHooded\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nSpring / Autumn / Winter\n\nStyle\nBasics / Casual / Street / Vintage\n\nMaterial\n42% cotton, 53% polyester, 5% other fibers\n\nFabric Weight\n355 gsm (10.5 oz)\n\nThickness\nThick\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "classic-quarter-zip",
        name: "Classic Quarter Zip",
        price: 60,
        description: "Minimal quarter zip built with premium structure and an everyday luxury finish.",
        images: [
            "images/grayqzipfront.png",
            "images/grayqzipback.png",
            "images/modelimage1qzip.png",
            "images/modelimage2qzip.png"
        ],
        colorways: [
            {
                name: "Gray",
                hex: "#808080",
                images: [
                    "images/grayqzipfront.png",
                    "images/grayqzipback.png",
                    "images/modelimage1qzip.png",
                    "images/modelimage2qzip.png"
                ]
            },
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/blackqzipfront.png",
                    "images/blackqzipback.png",
                    "images/modelimage1qzip.png",
                    "images/modelimage2qzip.png"
                ]
            },
            {
                name: "Cream",
                hex: "#F5F5DC",
                images: [
                    "images/creamqzipfront.png",
                    "images/creamqzipback.png",
                    "images/modelimage1qzip.png",
                    "images/modelimage2qzip.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10, "3XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [26.38, 27.17, 27.95, 28.74, 29.53, 30.31],
                shoulder: [22.83, 23.43, 24.02, 24.61, 25.20, 25.79],
                chest: [23.62, 24.41, 25.20, 25.98, 26.77, 27.56],
                sleeveLength: [21.65, 22.05, 22.44, 22.83, 23.23, 23.62]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [67, 69, 71, 73, 75, 77],
                shoulder: [58, 59.5, 61, 62.5, 64, 65.5],
                chest: [60, 62, 64, 66, 68, 70],
                sleeveLength: [55, 56, 57, 58, 59, 60]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "Safire's Quarter-Zip Drop Shoulder Sweatshirt elevate your casual lineup with Tapstitch's Quarter-Zip Drop Shoulder Sweatshirt. Featuring a high stand collar and a sleek metal zipper, this piece delivers a modern, relaxed silhouette. Detailed with practical side welt pockets and structured ribbed trims, it combines everyday utility with style. Perfectly suited for Custom Printing, this sweatshirt ensures high-quality results for Custom DTG and DTF projects. A reliable choice for Print-on-Demand businesses, it supports seamless global Dropshipping.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nGender\nUnisex\n\nEffects\nZipper / Pocket\n\nFit\nLoose\n\nNeckline\nLapel Collar\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nSpring / Autumn\n\nStyle\nBasics / Casual / Sporty\n\nMaterial\n85% cotton, 15% polyester\n\nFabric Weight\n320 gsm (9.4 oz)\n\nThickness\nModerate\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "varsity-jacket",
        name: "Varsity Jacket",
        price: 60,
        description: "SAFIRE's Contrast Piping Zip Bomber Jacket redefines athleisure with a polished edge and everyday comfort.",
        images: [
            "images/frontgreenwhitejacket.png",
            "images/backgreenwhitejacket.png"
        ],
        colorways: [
            {
                name: "Green / Cream",
                hex: "#0E6B4D",
                images: [
                    "images/frontgreenwhitejacket.png",
                    "images/backgreenwhitejacket.png"
                ]
            },
            {
                name: "Black / Cream",
        stock: { XS: 10, S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL"],
                length: [26.18, 26.97, 27.76, 28.54, 29.33, 30.12],
                chest: [21.26, 22.05, 22.83, 23.62, 24.41, 25.20],
                sleeveLength: [29.72, 30.31, 30.91, 31.50, 32.09, 32.68]
            },
            centimeters: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL"],
                length: [66.5, 68.5, 70.5, 72.5, 74.5, 76.5],
                chest: [54, 56, 58, 60, 62, 64],
                sleeveLength: [75.5, 77, 78.5, 80, 81.5, 83]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
                images: [
                    "images/frontblackcreamjacket.png",
                    "images/backblackcreamjacket.png"
                ]
            },
            {
                name: "Cream / Navy",
                hex: "#F5F5DC",
                images: [
                    "images/frontcreamnavyjacket.png",
                    "images/backcreamnavyjacket.png"
                ]
            },
            {
                name: "Navy / Cream",
                hex: "#1F315D",
                images: [
                    "images/frontnavycreamjacket.png",
                    "images/backnavycreamjacket.webp"
                ]
            },
            {
                name: "Purple / Navy",
                hex: "#7E5A9B",
                images: [
                    "images/frontpurplejacket.png",
                    "images/backpurplejacket.png"
                ]
            },
            {
                name: "Red / Cream",
                hex: "#B32134",
                images: [
                    "images/frontredwhitejacket.png",
                    "images/backredwhitejacket.png"
                ]
            }
        ],
        stock: { XS: 10, S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL"],
                length: [26.18, 26.97, 27.76, 28.54, 29.33, 30.12],
                chest: [21.26, 22.05, 22.83, 23.62, 24.41, 25.20],
                sleeveLength: [29.72, 30.31, 30.91, 31.50, 32.09, 32.68]
            },
            centimeters: {
                sizes: ["XS", "S", "M", "L", "XL", "2XL"],
                length: [66.5, 68.5, 70.5, 72.5, 74.5, 76.5],
                chest: [54, 56, 58, 60, 62, 64],
                sleeveLength: [75.5, 77, 78.5, 80, 81.5, 83]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "Material\nMain Fabric: 48.9% polyester, 43.4% cotton, 7.7% spandex; Contrast Fabric: 95.6% polyester, 4.4% spandex\n\nFabric Weight\n400 gsm (11.8 oz)\n\nThickness\nModerate\n\nBreathability\nModerate\n\nEffects\nZipper / Pocket\n\nFit\nLoose\n\nNeckline\nStand Collar\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nWinter\n\nStyle\nBasics / Casual / Preppy / Sporty / Street\n\nGender\nUnisex\n\nSafire's Contrast Piping Zip Bomber Jacket redefines athleisure with a polished edge. Featuring distinct contrast piping along the shoulders and sporty striped ribbed trims at the collar, cuffs, and hem, this outerwear piece offers a retro-inspired look. The design includes a full-zip closure, practical side pockets, and a relaxed drop-shoulder fit for everyday comfort. Ideal for creating high-quality Custom Jackets, it is specifically optimized for Custom DTF printing to ensure vibrant results. Expand your offering with this stylish essential, ready for seamless Print-on-Demand and Dropshipping fulfillment.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "cropped-fleece-hoodie",
        name: "Plain Hoodie",
        price: 60,
        description: "A fashion-forward cropped hoodie with heavyweight warmth, fleece comfort, and a relaxed street-ready silhouette.",
        images: [
            "images/newblankblackfront.png",
            "images/newblankblackback.png"
        ],
        colorways: [
            {
                name: "Black",
                hex: "#0A0A0A",
                images: [
                    "images/newblankblackfront.png",
                    "images/newblankblackback.png"
                ]
            },
            {
                name: "Grey",
                hex: "#7C7C7C",
                images: [
                    "images/newgreyblueblankfront.png",
                    "images/newgreyblueblankback.png"
                ]
            },
            {
                name: "White",
                hex: "#F2F2F2",
                images: [
                    "images/newblankwitefront.png",
                    "images/newwhiteblankback.png"
                ]
            },
            {
                name: "Oat White",
                hex: "#D9D4C7",
                images: [
                    "images/newblankoatgreyfront.png",
                    "images/newblankoatgreyback.png"
                ]
            },
            {
                name: "Flower Gray",
                hex: "#B7B7B7",
                images: [
                    "images/newblankflowergreyfront.png",
                    "images/newblankflowergreyback.png"
                ]
            },
            {
                name: "Light Apricot",
                hex: "#F4E7CF",
                images: [
                    "images/newblankcreamfront.png",
                    "images/newblankcreamback.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [24.80, 25.59, 26.38, 27.17, 27.95],
                shoulder: [22.83, 23.62, 24.41, 25.20, 25.98],
                chest: [23.62, 24.41, 25.20, 25.98, 26.77],
                sleeveLength: [21.65, 22.05, 22.44, 22.83, 23.23]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL"],
                length: [63, 65, 67, 69, 71],
                shoulder: [58, 60, 62, 64, 66],
                chest: [60, 62, 64, 66, 68],
                sleeveLength: [55, 56, 57, 58, 59]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "This fashion-forward hoodie combines a cropped length with a warm fleece lining and heavyweight construction. The cotton-polyester blend offers substantial comfort. A trendy piece for essential collections, particularly appealing to brands targeting the cropped silhouette market in womenswear or youth segments.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nGender\nUnisex\n\nEffects\nPocket\n\nFit\nLoose\n\nNeckline\nHooded\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nWinter\n\nStyle\nBasics / Casual / Sporty\n\nMaterial\n50% cotton, 50% polyester\n\nFabric Weight\n500 gsm (14.7 oz)\n\nThickness\nThick\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "safire-shores-crewneck",
        name: "Safire Shores",
        price: 50,
        description: "Essential drop-shoulder crewneck with technical comfort, shape retention, and clean all-season layering.",
        images: [
            "images/safireshoresbluefront.png",
            "images/safireshoresblueback.png"
        ],
        colorways: [
            {
                name: "Sky Blue",
                hex: "#C8F2F4",
                images: [
                    "images/safireshoresbluefront.png",
                    "images/safireshoresblueback.png"
                ]
            }
        ],
        stock: { S: 10, M: 10, L: 10, XL: 10, "2XL": 10, "3XL": 10 },
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        sizeGuide: {
            inches: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [27.17, 27.95, 28.74, 29.53, 30.31, 30.71],
                chest: [21.26, 22.05, 22.83, 23.62, 24.41, 25.20],
                shoulder: [20.83, 21.54, 22.24, 22.95, 23.66, 24.37],
                sleeveLength: [21.81, 22.13, 22.44, 22.76, 23.07, 23.39]
            },
            centimeters: {
                sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
                length: [69, 71, 73, 75, 77, 78],
                chest: [54, 56, 58, 60, 62, 64],
                shoulder: [52.9, 54.7, 56.5, 58.3, 60.1, 61.9],
                sleeveLength: [55.4, 56.2, 57, 57.8, 58.6, 59.4]
            },
            howToMeasure: [
                {
                    title: "Length",
                    description: "Measure from where the shoulder seam meets the collar to the hem."
                },
                {
                    title: "Shoulder",
                    description: "Measure from where the shoulder seam meets the sleeve on one side to another side."
                },
                {
                    title: "Chest",
                    description: "Measure from the stitches below the armpits on one side to another."
                },
                {
                    title: "Sleeve length",
                    description: "Measure from where the shoulder seam meets armhole to the cuff."
                }
            ]
        },
        freeShipping: true,
        details: "This crewneck sweatshirt showcases a contemporary drop shoulder design in an essential silhouette. The technical fabric blend provides excellent comfort and shape retention. A versatile layering piece recommended for core collections, easily branded to create cohesive outfit options.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nProduct Code\nRW0029-P001-V2\n\nGender\nUnisex\n\nFit\nLoose\n\nNeckline\nRound Neck / O-Neck\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nAutumn / Winter\n\nStyle\nBasics / Casual / Preppy / Sporty / Street\n\nMaterial\nMain Fabric: 48.9% polyester, 43.4% cotton, 7.7% spandex; Contrast Fabric: 95.6% polyester, 4.4% spandex\n\nFabric Weight\n400 gsm (11.8 oz)\n\nThickness\nModerate\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    }
];

const stripePrices = {
    "safire-horizon-zip-hoodie": "price_1Tn7mf9S93tBM5OXMTuyhDn8",
    "black-socrates-hoodie": "price_1TWnb69S93tBM5OXzBZrBSKa",
    "classic-quarter-zip": "price_1TWnYV9S93tBM5OX0jOJ8u43",
    "varsity-jacket": "price_1TWnWp9S93tBM5OXTgymoZtv",
    "cropped-fleece-hoodie": "price_1TDv4M9S93tBM5OXCrLVwvkT",
    "borough-oversized-tshirt": "price_1TMbOM9S93tBM5OXaKt24jzl",
    "borough-oversized-t-shirt": "price_1TMbOM9S93tBM5OXaKt24jzl",
    "vintage-crewneck": "price_1Tf2KR9S93tBM5OXSLZRESp5",
    "not-for-everyone-hoodie": "price_1TYzPh9S93tBM5OXiV6SZO7H",
    "mesh-drawstring-shorts": "price_1Tf2Hk9S93tBM5OXMbmC3MTt",
    "oversized-wavy-grid-tshirt": "price_1TQy3K9S93tBM5OXoDIMBmZM",
    "safire-shores-crewneck": "price_1Tf2Pl9S93tBM5OXRSWbhH2E"
};
