const products = [
    {
        id: "brown-hoodie",
        name: "Brown Hoodie (Scratched)",
        price: 44.99,
        description: "A heavyweight essential with a distressed finish and premium streetwear fit.",
        images: [
            "images/brown-hoodie.png",
            "images/brown-hoodieback.png"
        ],
        sizes: ["S", "M", "L", "XL"],
        details: "This hoodie combines a vintage wash with frayed details for a look that’s both edgy and comfortable. Crafted from 360 GSM fleece, it offers warmth without sacrificing style, making it ideal for layering or wearing solo. The relaxed fit and soft texture create the perfect canvas for your custom designs, adding a personal touch to this streetwear essential.\n\nEach piece is handcrafted, ensuring its uniqueness. Minor variations from website images are natural and highlight its artisanal quality.\n\nGender\nUnisex\n\nEffects\nWashed / Frayed\n\nFit\nLoose\n\nNeckline\nHooded\n\nSleeve Length\nLong Sleeve\n\nSeason\nAutumn / Winter\n\nStyle\nCasual / Street\n\nMaterial\n42% cotton, 53% polyester, 5% other fibers\n\nFabric Weight\n360 gsm (10.6 oz)\n\nThickness\nThicken\n\nElasticity\nSlight Stretch\n\nBreathability\nHigh",
        freeShipping: true,
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "safire-sweatpants",
        name: "SAFIRE Flower Gray Sweatpants",
        price: 34.99,
        description: "Clean tapered sweatpants with premium feel, ideal for daily movement and layered fits.",
        images: [
            "images/frontgraysweatpants.png",
            "images/backgraysweatpants.png"
        ],
        sizes: ["S", "M", "L", "XL"],
        details: "These women's sweatpants offer a classic straight-leg fit with an elasticated drawstring waist for all-day comfort. Designed to coordinate with multiple tops in the collection (WW0021, WQ0005), they serve as a versatile foundational bottom. A perfect basic for women's essential collections, easily integrated into various outfits.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nGender\nWomen\n\nEffects\nElastic Waist / Drawstring\n\nFit\nWide Leg\n\nSeason\nSpring / Autumn\n\nStyle\nBasics / Casual / Sporty / Street\n\nMaterial\n80% cotton, 20% polyester\n\nFabric Weight\n310 gsm (9.1 oz)\n\nThickness\nModerate\n\nBreathability\nModerate",
        freeShipping: true,
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "classic-quarter-zip",
        name: "Classic Quarter Zip",
        price: 44.99,
        description: "Minimal quarter zip built with premium structure and an everyday luxury finish.",
        images: [
            "images/grayqzipfront.png",
            "images/grayqzipback.png"
        ],
        colorways: [
            {
                name: "Gray",
                hex: "#808080",
                images: [
                    "images/grayqzipfront.png",
                    "images/grayqzipback.png"
                ]
            },
            {
                name: "Black",
                hex: "#111111",
                images: [
                    "images/blackqzipfront.png",
                    "images/blackqzipback.png"
                ]
            },
            {
                name: "Cream",
                hex: "#F5F5DC",
                images: [
                    "images/creamqzipfront.png",
                    "images/creamqzipback.png"
                ]
            }
        ],
        sizes: ["S", "M", "L", "XL"],
        freeShipping: true,
        details: "Safire's Quarter-Zip Drop Shoulder Sweatshirt elevate your casual lineup with Tapstitch's Quarter-Zip Drop Shoulder Sweatshirt. Featuring a high stand collar and a sleek metal zipper, this piece delivers a modern, relaxed silhouette. Detailed with practical side welt pockets and structured ribbed trims, it combines everyday utility with style. Perfectly suited for Custom Printing, this sweatshirt ensures high-quality results for Custom DTG and DTF projects. A reliable choice for Print-on-Demand businesses, it supports seamless global Dropshipping.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.\n\nGender\nUnisex\n\nEffects\nZipper / Pocket\n\nFit\nLoose\n\nNeckline\nLapel Collar\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nSpring / Autumn\n\nStyle\nBasics / Casual / Sporty\n\nMaterial\n85% cotton, 15% polyester\n\nFabric Weight\n320 gsm (9.4 oz)\n\nThickness\nModerate\n\nBreathability\nModerate",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    },
    {
        id: "varsity-jacket",
        name: "SAFIRE Varsity Jacket",
        price: 49.99,
        description: "SAFIRE's Contrast Piping Zip Bomber Jacket redefines athleisure with a polished edge and everyday comfort.",
        images: [
            "images/frontblackcreamjacket.png",
            "images/backblackcreamjacket.png"
        ],
        colorways: [
            {
                name: "Black / Cream",
                hex: "#111111",
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
                name: "Green / Cream",
                hex: "#0E6B4D",
                images: [
                    "images/frontgreenwhitejacket.png",
                    "images/backgreenwhitejacket.png"
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
        sizes: ["S", "M", "L", "XL"],
        freeShipping: true,
        details: "Material\nMain Fabric: 48.9% polyester, 43.4% cotton, 7.7% spandex; Contrast Fabric: 95.6% polyester, 4.4% spandex\n\nFabric Weight\n400 gsm (11.8 oz)\n\nThickness\nModerate\n\nBreathability\nModerate\n\nEffects\nZipper / Pocket\n\nFit\nLoose\n\nNeckline\nStand Collar\n\nSleeve Style\nDrop Shoulder\n\nSleeve Length\nLong Sleeve\n\nSeason\nWinter\n\nStyle\nBasics / Casual / Preppy / Sporty / Street\n\nGender\nUnisex\n\nSafire's Contrast Piping Zip Bomber Jacket redefines athleisure with a polished edge. Featuring distinct contrast piping along the shoulders and sporty striped ribbed trims at the collar, cuffs, and hem, this outerwear piece offers a retro-inspired look. The design includes a full-zip closure, practical side pockets, and a relaxed drop-shoulder fit for everyday comfort. Ideal for creating high-quality Custom Jackets, it is specifically optimized for Custom DTF printing to ensure vibrant results. Expand your offering with this stylish essential, ready for seamless Print-on-Demand and Dropshipping fulfillment.\n\nMinor batch differences can occur during blank garment production due to variations in fabric, dye and processing. This is common in apparel manufacturing, and we work hard to keep every item consistent.",
        shippingReturns: "Free standard shipping on all orders. Returns accepted within 30 days if unworn with tags.",
        careInstructions: "Machine wash at 30°C (gentle cycle)\nDo not bleach\nTumble dry low\nIron at low temperature, avoid ironing on print\nDo not dry clean"
    }
];
