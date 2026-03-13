export const mockProducts = [
    {
        id: 1,
        name: "Royal Velvet Agbada",
        slug: "royal-velvet-agbada",
        price: "150.00",
        description: "<p>A luxurious deep blue velvet Agbada with intricate gold embroidery. Perfect for special occasions and royal gatherings.</p>",
        short_description: "<p>Premium velvet traditional wear.</p>",
        images: [
            { src: "/images/products/agbada-blue.jpg", alt: "Royal Velvet Agbada Front" },
            { src: "/images/products/agbada-blue-detail.jpg", alt: "Royal Velvet Agbada Detail" }
        ],
        attributes: [
            {
                name: "Size",
                options: ["BS", "BM", "BL", "BXL"] // "B" for Big/Broad/Standard naming convention if generic
            }
        ],
        categories: [{ id: 101, name: "Traditional" }, { id: 102, name: "Men" }],
        stock_status: "instock",
        sku: "RH-AGB-001"
    },
    {
        id: 2,
        name: "Golden Silk Kaftan",
        slug: "golden-silk-kaftan",
        price: "120.00",
        description: "<p>Elegant flowing silk kaftan in a rich golden hue. Lightweight and breathable, designed for comfort and style.</p>",
        short_description: "<p>Lightweight silk kaftan.</p>",
        images: [
            { src: "/images/products/kaftan-gold.jpg", alt: "Golden Silk Kaftan" }
        ],
        attributes: [
            {
                name: "Size",
                options: ["S", "M", "L", "XL"]
            }
        ],
        categories: [{ id: 101, name: "Traditional" }, { id: 102, name: "Men" }],
        stock_status: "instock",
        sku: "RH-KAF-002"
    },
    {
        id: 3,
        name: "Embroidered Senator Suit",
        slug: "embroidered-senator-suit",
        price: "180.00",
        description: "<p>Modern cut senator suit featuring contemporary embroidery patterns. Available in Charcoal Grey and Midnight Black.</p>",
        short_description: "<p>Modern tailored senator suit.</p>",
        images: [
            { src: "/images/products/senator-grey.jpg", alt: "Grey Senator Suit" }
        ],
        attributes: [
            {
                name: "Size",
                options: ["M", "L", "XL", "XXL"]
            }
        ],
        categories: [{ id: 103, name: "Suits" }, { id: 102, name: "Men" }],
        stock_status: "instock",
        sku: "RH-SEN-003"
    },
    {
        id: 4,
        name: "Lace Boubou Gown",
        slug: "lace-boubou-gown",
        price: "200.00",
        description: "<p>Exquisite lace Boubou gown with crystal embellishments. A statement piece for the modern queen.</p>",
        short_description: "<p>Luxury lace gown.</p>",
        images: [
            { src: "/images/products/boubou-lace.jpg", alt: "Lace Boubou" }
        ],
        attributes: [
            {
                name: "Size",
                options: ["Free Size"]
            }
        ],
        categories: [{ id: 101, name: "Traditional" }, { id: 104, name: "Women" }],
        stock_status: "outofstock",
        sku: "RH-BOU-004"
    }
];
