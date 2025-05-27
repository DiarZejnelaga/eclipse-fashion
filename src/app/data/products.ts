// app/data/products.ts

export interface ProductImage {
    colorHex: string;
    url: string;
    altText?: string;
  }
  export interface StockDetail {
    current: number;
    initial?: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    brand: string;
    price: string;
    priceValue: number;
    originalPrice?: string;
    images: ProductImage[];
    allColors: string[];
    soldOut?: boolean;
    salesCount?: number;
    dateAdded?: string;
    isBestSeller?: boolean;
    description?: string;
    detailedDescription?: string;
    availableSizes?: string[];
    stockQuantity?: { [size: string]: StockDetail }; // This definition is correct
    rating?: number;
    reviewCount?: number;
    sku?: string;
    categories?: string[];
    tags?: string[];
    isSaleItem?: boolean;
    relatedProductIds?: number[];
    sizes?: string[];
    collections?: string[];
  }
  
  export interface PriceRange {
    label: string;
    min: number;
    max: number;
  }
  
  export interface CartItem extends Product {
    cartQuantity: number;
    selectedSize: string | null;
    selectedColorHex: string | null;
    selectedImageUrl?: string;
  }
  
  export const PLACEHOLDER_IMAGE_URL = '/images/placeholder-product.jpg';
  
  export const productsData: Product[] = [
    {
      id: 1, name: 'Rounded Red Hat', brand: 'FASCO', price: '$39.00', priceValue: 39.00, originalPrice: '$59.00',
      images: [
        { colorHex: '#FF0000', url: '/images/products/pr1.svg', altText: 'Denim Jacket Blue Front' },
      ],
      allColors: ['#3B82F6', '#000000', '#FFC0CB', '#D1D5DB'],
      description: "A timeless denim jacket that combines classic style with modern comfort. Perfect for any season.",
      detailedDescription: "Crafted from premium quality 100% cotton denim...",
      availableSizes: ['M', 'L', 'XL', 'XXL'], sizes: ['M', 'L', 'XL', 'XXL'],
      // CORRECTED stockQuantity
      stockQuantity: {
        M: { current: 9, initial: 20 },
        L: { current: 12, initial: 20 },
        XL: { current: 7, initial: 15 },
        XXL: { current: 3, initial: 10 }
      },
      salesCount: 250, dateAdded: '2023-01-10T10:00:00Z', isBestSeller: true,
      rating: 4.0, reviewCount: 3, tags: ["Jacket", "Denim", "Casual"], collections: ["Outerwear", "Best sellers"]
    },
    {
      id: 2, name: 'Vantablack Shirt', brand: 'Minimog', price: '$8.00', priceValue: 8.00,
      images: [
        { colorHex: '#000000', url: '/images/products/pr2.svg', altText: 'Red Hat' },
      ],
      allColors: ['#FF0000', '#FFD700', '#000000'],
      description: "A stylish and comfortable rounded hat, perfect for sunny days.",
      detailedDescription: "Add a pop of color to your outfit with this chic rounded hat...",
      availableSizes: ['One Size'], sizes: ['One Size'],
      // CORRECTED stockQuantity
      stockQuantity: { 'One Size': { current: 20, initial: 30 } },
      salesCount: 150, dateAdded: '2023-01-15T10:00:00Z', rating: 4.5, reviewCount: 12, tags: ["Hats", "Summer", "Accessories"], collections: ["Accessories", "New arrivals"]
    },
    {
      id: 3, name: "Long-sleeve Coat", price: "$106.00", priceValue: 106.00, brand: "Vagabond",
      images: [ { url: "/images/products/pr3.svg", colorHex: "#000000" }],
      allColors: ["#FFFFFF", "#90EE90"],
      availableSizes: ["L", "XL"], sizes: ["L", "XL"],
      // CORRECTED stockQuantity
      stockQuantity: {
        L: { current: 3, initial: 10 },
        XL: { current: 5, initial: 10 }
      },
      collections: ["Outerwear"], tags: ["Coats", "Winter", "Formal"], salesCount: 75, dateAdded: "2023-10-01", rating: 4.2, reviewCount: 8
    },
    {
      id: 4, name: "Boxy Denim Hat", price: "$25.00", priceValue: 25.00, brand: "Retrolie Brook",
      images: [ { url: "/images/products/pr4.svg", colorHex: "#000000" } ],
      allColors: ["#E0E0E0", "#36454F"],
      availableSizes: ["M"], sizes: ["M"],
      // CORRECTED stockQuantity
      stockQuantity: { M: { current: 12, initial: 20 } },
      collections: ["Accessories", "Hats"], tags: ["Hats", "Denim", "Streetwear"], salesCount: 90, dateAdded: "2023-11-05", rating: 4.0, reviewCount: 5
    },
    {
      id: 5, name: "Linen Plain Top", price: "$25.00", priceValue: 25.00, brand: "Abby",
      images: [ { url: "/images/products/pr5.svg", colorHex: "#000000" }],
      allColors: ["#90EE90", "#D3D3D3"],
      availableSizes: ["S", "M", "L"], sizes: ["S", "M", "L"],
      // CORRECTED stockQuantity
      stockQuantity: {
        S: { current: 10, initial: 15 },
        M: { current: 10, initial: 15 },
        L: { current: 2, initial: 5 }
      },
      collections: ["Tops", "Casual Wear"], tags: ["Linen", "Casual", "Summer"], salesCount: 150, dateAdded: "2023-08-20", rating: 4.6, reviewCount: 22
    },
    {
      id: 6, name: "Oversized T-shirt", price: "$11.00", originalPrice: "$14.00", priceValue: 11.00, brand: "Minimog",
      images: [ { url: "/images/products/pr6.svg", colorHex: "#FFC0CB" } ],
      allColors: ["#FFC0CB"],
      availableSizes: ["XL", "XXL"], sizes: ["XL", "XXL"],
      // CORRECTED stockQuantity
      stockQuantity: {
        XL: { current: 20, initial: 30 },
        XXL: { current: 10, initial: 15 }
      },
      collections: ["Best sellers", "T-shirts"], tags: ["Oversized", "Comfort", "Streetwear"], salesCount: 250, dateAdded: "2023-07-10", isSaleItem: true, rating: 4.3, reviewCount: 30
    },
    {
      id: 7, name: "Dress", price: "$18.00", originalPrice: "$21.00", priceValue: 18.00, brand: "Learts",
      images: [ { url: "/images/products/pr10.svg", colorHex: "#000000" }, { url: "/images/products/pr13.jpg", colorHex: "#A52A2A" } ],
      allColors: ["#000000", "#A52A2A"],
      availableSizes: ["M", "S"], sizes: ["M", "S"],
      // CORRECTED stockQuantity
      stockQuantity: { "One Size": { current: 30, initial: 50 } },
      collections: ["Accessories", "Summer Essentials"], tags: ["Sunglasses", "Summer", "UV Protection"], salesCount: 180, dateAdded: "2023-06-01", isSaleItem: true, rating: 4.7, reviewCount: 45
    },
    {
      id: 8, name: "Rockstar Jacket", price: "$22.00", priceValue: 22.00, brand: "Vagabond",
      images: [ { url: "/images/products/pr8.svg", colorHex: "#000000" } ],
      allColors: ["#000000"],
      availableSizes: ["M", "L"], sizes: ["M", "L"],
      // CORRECTED stockQuantity
      stockQuantity: {
        M: { current: 5, initial: 10 },
        L: { current: 3, initial: 8 }
      },
      collections: ["Outerwear", "New arrivals", "Edgy Style"], tags: ["Jackets", "Edgy", "Music"], salesCount: 60, dateAdded: "2023-11-10", rating: 4.1, reviewCount: 10
    },
    {
      id: 9, name: "Polarized Sunglasses", price: "$20.00", priceValue: 20.00, brand: "Abby",
      images: [ { url: "/images/products/pr9.svg", colorHex: "#00008B" }, { url: "/images/products/pr15.jpg", colorHex: "#FFA500" }, { url: "/images/products/pr12.svg", colorHex: "#008000" } ],
      allColors: ["#00008B", "#000000", "#87CEEB"],
      availableSizes: ["S", "M"], sizes: ["S", "M"],
      // CORRECTED stockQuantity
      stockQuantity: {
        S: { current: 11, initial: 20 },
        M: { current: 13, initial: 20 }
      },
      collections: ["Dresses", "Evening Wear"], tags: ["Polka Dot", "Elegant", "Classic"], salesCount: 110, dateAdded: "2023-09-01", rating: 4.4, reviewCount: 18
    },
    {
      id: 10, name: "Classic Crewneck Tee", price: "$15.00", priceValue: 15.00, brand: "Minimog",
      images: [{url: "/images/products/pr10.svg", colorHex: "#FFFFFF"}, {url: "/images/products/tee-grey.jpg", colorHex: "#808080"}],
      allColors: ["#FFFFFF", "#808080"],
      availableSizes: ["L", "XL"], sizes: ["L", "XL"],
      // CORRECTED stockQuantity
      stockQuantity: {
        L: { current: 15, initial: 25 },
        XL: { current: 10, initial: 20 }
      },
      salesCount: 50, dateAdded: "2023-01-01", relatedProductIds: [2,6], collections: ["T-shirts", "Basics"], tags: ["Tee", "Comfort"]
    },
    {
      id: 11, name: "Vibrant Designer Scarf", price: "$42.00", priceValue: 42.00, brand: "Retrolie Brook",
      images: [{url: "/images/products/pr11.svg", colorHex: "#FF0000"}, {url: "/images/products/scarf-green.jpg", colorHex: "#00FF00"}],
      allColors: ["#FF0000", "#00FF00"],
      availableSizes: ["One Size"], sizes: ["One Size"],
      // CORRECTED stockQuantity
      stockQuantity: { "One Size": { current: 8, initial: 15 } },
      salesCount: 30, dateAdded: "2023-02-02", relatedProductIds: [1,4], collections: ["Accessories"], tags: ["Scarf", "Designer", "Luxury"]
    },
    {
      id: 12, name: "Premium Leather Belt", price: "$30.00", originalPrice: "$35.00", priceValue: 30.00, brand: "Learts",
      images: [{url: "/images/products/pr12.svg", colorHex: "#A52A2A"}],
      allColors: ["#A52A2A"],
      availableSizes: ["M", "L"], sizes: ["M", "L"],
      // CORRECTED stockQuantity
      stockQuantity: {
        M: { current: 10, initial: 15 },
        L: { current: 7, initial: 12 }
      },
      salesCount: 70, dateAdded: "2023-03-03", isSaleItem: true, relatedProductIds: [7], collections: ["Accessories"], tags: ["Belt", "Leather"]
    },
    {
      id: 100, name: "Peaky Blinders Suit Set", price: "$100.00", priceValue: 100.00, brand: "FASCO Tailored",
      images: [{url: "/images/pk2.svg", colorHex: "#36454F", altText: "Peaky Blinders Style Suit"}],
      allColors: ["#36454F"],
      availableSizes: ["M", "L", "XL"], sizes: ["M", "L", "XL"],
      // CORRECTED stockQuantity
      stockQuantity: {
        M: { current: 7, initial: 15 },
        L: { current: 4, initial: 10 },
        XL: { current: 3, initial: 8 }
      },
      collections: ["Featured", "Suits", "Formal Wear"], tags: ["Suit", "Formal", "Peaky Blinders", "Vintage"],
      salesCount: 25, dateAdded: "2023-11-01", rating: 5, reviewCount: 15,
      description: "Impeccable Peaky Blinders inspired suit for a sharp, timeless look.",
      detailedDescription: "A finely tailored three-piece suit inspired by classic Peaky Blinders style..."
    },
    {
      id: 101, name: "Elegant Black Gown", price: "$150.00", priceValue: 150.00, brand: "Abby",
      images: [{url: "/images/products/pr13.jpg", colorHex: "#000000", altText: "Black Evening Gown"}],
      allColors: ["#000000"],
      availableSizes: ["S", "M", "L"], sizes: ["S", "M", "L"],
      stockQuantity: {
        S: { current: 3, initial: 8 },
        M: { current: 5, initial: 10 },
        L: { current: 2, initial: 5 }
      },
      collections: ["Dresses", "Formal Wear", "Evening Gowns"], tags: ["Evening Wear", "Gown", "Elegant", "Formal"],
      salesCount: 40, dateAdded: "2023-05-15", relatedProductIds: [9,3], rating: 4.8, reviewCount: 25
    },
    {
      id: 102, name: "Ripped Denim Shorts", price: "$35.00", originalPrice: "$45.00", priceValue: 35.00, brand: "Minimog",
      images: [{url: "/images/products/pr14.jpg", colorHex: "#ADD8E6", altText: "Blue Denim Shorts"}],
      allColors: ["#ADD8E6"],
      availableSizes: ["S", "M", "L", "XL"], sizes: ["S", "M", "L", "XL"],
      stockQuantity: {
        S: { current: 10, initial: 15 },
        M: { current: 0, initial: 0 }, // M is out of stock
        L: { current: 12, initial: 20 },
        XL: { current: 8, initial: 12 }
      },
      collections: ["Shorts", "Summer Wear", "Casual Wear"], tags: ["Denim", "Summer", "Ripped"],
      salesCount: 95, dateAdded: "2023-04-10", isSaleItem: true, relatedProductIds: [4,2], rating: 4.0, reviewCount: 15, soldOut: false
    },
{
  id: 20, 
  name: 'Chick ellow Hoodie', 
  brand: 'Al Karam',
  price: '$41.95',
  priceValue: 41.95,
  images: [
    { url: '/product-3.svg', colorHex: '#FFEB3B', altText: 'Yellow Hoodie Front' }
  ],
  allColors: ['#FFEB3B'], 
  description: "Stay cozy and stylish with this vibrant yellow hoodie.",
  detailedDescription: "Crafted from a soft cotton blend, this hoodie features a relaxed fit, a drawstring hood, and a spacious kangaroo pocket. Perfect for casual outings or lounging at home. The vibrant yellow hue adds a cheerful touch to any outfit.",
  availableSizes: ['S', 'M', 'L'],
  sizes: ['S', 'M', 'L'], 
  stockQuantity: { S: { current: 8, initial: 15 }, M: { current: 12, initial: 20 }, L: { current: 5, initial: 10 } },
  rating: 4.7,
  reviewCount: 18, 
  categories: ["Women's Fashion", "Hoodies"],
  tags: ["Casual", "Comfort", "Yellow", "New"],
  collections: ["New Arrivals", "Women's Fashion"],
  dateAdded: "2024-03-15T10:00:00Z" 
},
{
id: 21, name: 'Essential Teal Hoodie', brand: 'Al Karam', price: '$19.95', priceValue: 19.95,
images: [ { url: '/product-4.svg', colorHex: '#008080', altText: 'Essential Teal Hoodie' } ],
allColors: ["#008080"],
description: "A comfortable and stylish teal hoodie, a wardrobe staple.",
detailedDescription: "Our Essential Teal Hoodie is designed for everyday comfort and effortless style. Made with a soft cotton-poly blend, it's perfect for layering or wearing on its own. Features a classic hoodie design with a durable construction.",
availableSizes: ["M", "L", "XL"], sizes: ["M", "L", "XL"],
stockQuantity: { M: { current: 20, initial: 30 }, L: { current: 15, initial: 22 }, XL: {current: 10, initial: 15}},
rating: 4.8, reviewCount: 22, categories: ["Women's Fashion", "Hoodies"], tags: ["New", "Teal", "Essential"],
collections: ["New Arrivals", "Women's Fashion"], dateAdded: "2024-03-16T10:01:00Z"
},
{
id: 22, name: 'Classic Blue Sweatshirt', brand: 'Al Karam', price: '$31.95', priceValue: 31.95,
images: [ { url: '/product-5.svg', colorHex: '#87CEEB', altText: 'Classic Blue Sweatshirt' } ],
allColors: ["#87CEEB"],
description: "A timeless blue sweatshirt offering supreme comfort.",
detailedDescription: "The Classic Blue Sweatshirt features a soft fleece interior and a relaxed fit for maximum comfort. A versatile piece for any casual occasion.",
availableSizes: ["S", "M", "L", "XL"], sizes: ["S", "M", "L", "XL"],
stockQuantity: { S:{current:10}, M:{current:10}, L:{current:10}, XL:{current:5} },
rating: 4.7, reviewCount: 18, categories: ["Women's Fashion", "Sweatshirts"], tags: ["New", "Blue", "Classic"],
collections: ["New Arrivals", "Women's Fashion"], dateAdded: "2024-03-16T10:02:00Z"
},
{
id: 23, name: 'Springtime Floral Blouse', brand: 'Bella Grace', price: '$35.50', priceValue: 35.50,
images: [ { url: '/product-7.jpg', colorHex: '#FFC0CB', altText: 'Springtime Floral Blouse' } ], // Pink
allColors: ["#FFC0CB"],
description: "Charming floral print blouse for a fresh spring look.",
detailedDescription: "Welcome spring with our Springtime Floral Blouse. Crafted from a lightweight, breathable fabric with a delicate all-over floral print. Features elegant ruffled details and a comfortable fit.",
availableSizes: ["XS", "S", "M"], sizes: ["XS", "S", "M"],
stockQuantity: { XS:{current:5}, S:{current:8}, M:{current:7} },
rating: 4.6, reviewCount: 25, categories: ["Women's Fashion", "Tops"], tags: ["New", "Floral", "Blouse", "Spring"],
collections: ["New Arrivals", "Women's Fashion"], dateAdded: "2024-03-16T10:03:00Z"
},
{
id: 24, name: 'Sculpting High-Waist Jeans', brand: 'Denim Co.', price: '$55.00', priceValue: 55.00,
images: [ { url: '/product-8.jpg', colorHex: '#ADD8E6', altText: 'Sculpting High-Waist Jeans' } ], // LightBlue
allColors: ["#ADD8E6"],
description: "Figure-flattering high-waisted jeans with a modern silhouette.",
detailedDescription: "Our Sculpting High-Waist Jeans are designed to enhance your shape while providing ultimate comfort. Made with premium stretch denim for a perfect fit that moves with you.",
availableSizes: ["26", "28", "30", "32"], sizes: ["26", "28", "30", "32"],
stockQuantity: { "26":{current:5}, "28":{current:10}, "30":{current:8}, "32":{current:4} },
rating: 4.9, reviewCount: 30, categories: ["Women's Fashion", "Jeans"], tags: ["New", "Denim", "High-Waist"],
collections: ["New Arrivals", "Women's Fashion", "Best Sellers"], dateAdded: "2024-03-16T10:04:00Z"
},
{
id: 25, name: 'Bohemian Summer Maxi Dress', brand: 'Sun Kissed', price: '$68.75', priceValue: 68.75,
images: [ { url: '/product-9.jpg', colorHex: '#0000FF', altText: 'Bohemian Summer Maxi Dress' } ], // PaleGreen
allColors: ["#98FB98"],
description: "A flowy and free-spirited maxi dress for sunny adventures.",
detailedDescription: "Embrace your inner bohemian with our Summer Maxi Dress. This dress features a lightweight, airy fabric, a beautiful exclusive print, and a comfortable, relaxed silhouette perfect for warm weather escapades.",
availableSizes: ["S", "M", "L"], sizes: ["S", "M", "L"],
stockQuantity: { S:{current:7}, M:{current:10}, L:{current:6} },
rating: 4.5, reviewCount: 19, categories: ["Women's Fashion", "Dresses"], tags: ["New", "Maxi Dress", "Summer", "Boho"],
collections: ["New Arrivals", "Women's Fashion"], dateAdded: "2024-03-16T10:05:00Z"
},

{
id: 26, name: 'Urban Terrain Hoodie', brand: 'Al Karam', price: '$27.95', priceValue: 27.95,
images: [ { url: '/product-1.svg', colorHex: '#A0522D', altText: 'Urban Terrain Hoodie Brown' } ], // Sienna
allColors: ["#A0522D"],
description: "Rugged yet stylish hoodie for men's everyday explorations.",
detailedDescription: "The Urban Terrain Hoodie is built for comfort and durability. Its modern fit and earthy tone make it a versatile addition to any casual wardrobe.",
availableSizes: ["M", "L", "XL"], sizes: ["M", "L", "XL"],
stockQuantity: { M:{current:12}, L:{current:10}, XL:{current:8} },
rating: 4.7, reviewCount: 21, categories: ["Men's Fashion", "Hoodies"], tags: ["New", "Casual", "Urban", "Men"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:06:00Z"
},
{
id: 27, name: 'Statement Red Hoodie', brand: 'Al Karam', price: '$38.95', priceValue: 38.95,
images: [ { url: '/product-2.svg', colorHex: '#DC143C', altText: 'Statement Red Hoodie Men' } ], // Crimson
allColors: ["#DC143C"],
description: "Bold red hoodie that makes a statement.",
detailedDescription: "Stand out from the crowd with our Statement Red Hoodie. Premium fabric and a comfortable fit for all-day wear.",
availableSizes: ["L", "XL", "XXL"], sizes: ["L", "XL", "XXL"],
stockQuantity: { L:{current:9}, XL:{current:11}, XXL:{current:6} },
rating: 4.6, reviewCount: 17, categories: ["Men's Fashion", "Hoodies"], tags: ["New", "Red", "Bold", "Men"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:07:00Z"
},
{
id: 28, name: 'Collegiate Varsity Jacket', brand: 'Al Karam', price: '$22.95', priceValue: 22.95,
images: [ { url: '/product-6.svg', colorHex: '#191970', altText: 'Collegiate Varsity Jacket Navy' } ], // MidnightBlue
allColors: ["#191970"],
description: "Classic varsity jacket with a modern twist.",
detailedDescription: "The Collegiate Varsity Jacket offers a timeless sporty aesthetic. Features contrast sleeves, ribbed trim, and chenille patch details.",
availableSizes: ["S", "M", "L"], sizes: ["S", "M", "L"],
stockQuantity: { S:{current:7}, M:{current:10}, L:{current:8} },
rating: 4.5, reviewCount: 20, categories: ["Men's Fashion", "Jackets"], tags: ["New", "Varsity", "Streetwear", "Men"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:08:00Z"
},
{
id: 29, name: 'Minimalist Graphic Tee', brand: 'Urban Threads', price: '$29.99', priceValue: 29.99,
images: [ { url: '/product-10.jpg', colorHex: '#F5F5F5', altText: 'Minimalist Graphic Tee White' } ], // WhiteSmoke
allColors: ["#F5F5F5", "#2F4F4F"], // WhiteSmoke, DarkSlateGray
description: "Clean and modern graphic tee for men.",
detailedDescription: "This Minimalist Graphic Tee features a subtle yet impactful design on high-quality cotton. Perfect for a refined casual look.",
availableSizes: ["M", "L", "XL"], sizes: ["M", "L", "XL"],
stockQuantity: { M:{current:15}, L:{current:18}, XL:{current:12} },
rating: 4.4, reviewCount: 24, categories: ["Men's Fashion", "T-shirts"], tags: ["New", "Graphic Tee", "Minimalist", "Men"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:09:00Z"
},
{
id: 30, name: 'Tailored Slim Chinos', brand: 'Style Pro', price: '$49.50', priceValue: 49.50,
images: [ { url: '/product-11.jpg', colorHex: '#778899', altText: 'Tailored Slim Chinos Grey' } ], // LightSlateGray
allColors: ["#778899", "#5F9EA0"], // LightSlateGray, CadetBlue
description: "Sharp slim fit chinos for a polished appearance.",
detailedDescription: "Our Tailored Slim Chinos offer a perfect blend of comfort and sophistication. Crafted from premium twill with a hint of stretch.",
availableSizes: ["30", "32", "34"], sizes: ["30", "32", "34"],
stockQuantity: { "30":{current:8}, "32":{current:12}, "34":{current:9} },
rating: 4.8, reviewCount: 32, categories: ["Men's Fashion", "Pants"], tags: ["New", "Chinos", "Slim Fit", "Men", "Smart Casual"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:10:00Z"
},
{
id: 31, name: 'Everyday Casual Shirt', brand: 'Easy Wear', price: '$42.00', priceValue: 42.00,
images: [ { url: '/product-19.jpg', colorHex: '#B0E0E6', altText: 'Everyday Casual Shirt Blue' } ], // PowderBlue
allColors: ["#B0E0E6", "#90EE90"], // PowderBlue, LightGreen
description: "A versatile and comfortable casual shirt for men.",
detailedDescription: "The Everyday Casual Shirt is your go-to for effortless style. Made from soft, breathable cotton in a range of easy-to-wear colors.",
availableSizes: ["M", "L", "XL", "XXL"], sizes: ["M", "L", "XL", "XXL"],
stockQuantity: { M:{current:14}, L:{current:16}, XL:{current:11}, XXL:{current:7} },
rating: 4.3, reviewCount: 26, categories: ["Men's Fashion", "Shirts"], tags: ["New", "Casual Shirt", "Comfort", "Men"],
collections: ["New Arrivals", "Men's Fashion"], dateAdded: "2024-03-16T10:11:00Z"
},

// IDs 32-35 (Women Accessories)
{
id: 32, name: 'Lustrous Pearl Necklace', brand: 'Lustre Gems', price: '$75.00', priceValue: 75.00,
images: [ { url: '/product-16.jpg', colorHex: '#FFFACD', altText: 'Lustrous Pearl Necklace' } ], // LemonChiffon (pearl-like)
allColors: ["#FFFACD"],
description: "Elegant pearl necklace to elevate any attire.",
detailedDescription: "This Lustrous Pearl Necklace features hand-selected freshwater pearls with exceptional sheen, strung on a silk cord with a sterling silver clasp. A timeless piece of jewelry.",
availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:10, initial:15} },
rating: 4.9, reviewCount: 30, categories: ["Women Accessories", "Jewelry"], tags: ["New", "Pearl", "Necklace", "Elegant"],
collections: ["New Arrivals", "Women Accessories"], dateAdded: "2024-03-16T10:12:00Z"
},
{
  id: 33, name: 'Chic Leather Tote Bag WA', brand: 'CarryAll', price: '$120.99', priceValue: 120.99,
  images: [ { url: '/product-15.jpg', colorHex: '#D2B48C', altText: 'Chic Leather Tote Bag Tan' } ], 
  allColors: ["#D2B48C"], description: "Spacious and stylish leather tote.",
  detailedDescription: "Full details for Chic Leather Tote Bag (ID 33).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:8, initial:12} },
  rating: 4.7, reviewCount: 20, categories: ["Women Accessories", "Bags"], tags: ["New", "Tote", "Leather"],
  collections: ["New Arrivals", "Women Accessories"], dateAdded: "2024-03-16T10:13:00Z"
},
{
  id: 34, name: 'Designer Cat-Eye Sunglasses WA', brand: 'Shady Lady', price: '$88.00', priceValue: 88.00,
  images: [ { url: '/product-18.jpg', colorHex: '#FFB6C1', altText: 'Designer Cat-Eye Sunglasses Pink' } ], 
  allColors: ["#FFB6C1"], description: "Fashionable designer sunglasses.",
  detailedDescription: "Full details for Designer Cat-Eye Sunglasses (ID 34).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:12, initial:18} },
  rating: 4.8, reviewCount: 25, categories: ["Women Accessories", "Sunglasses"], tags: ["New", "Designer", "UV Protection"],
  collections: ["New Arrivals", "Women Accessories"], dateAdded: "2024-03-16T10:14:00Z"
},
{
  id: 35, name: 'Printed Silk Scarf WA', brand: 'Silky Ways', price: '$32.50', priceValue: 32.50,
  images: [ { url: '/product-17.jpg', colorHex: '#E0FFFF', altText: 'Printed Silk Scarf Blue Pattern' } ], 
  allColors: ["#E0FFFF"], description: "Versatile and luxurious silk scarf.",
  detailedDescription: "Full details for Printed Silk Scarf (ID 35).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:18, initial:25} },
  rating: 4.6, reviewCount: 15, categories: ["Women Accessories", "Scarves"], tags: ["New", "Silk", "Print"],
  collections: ["New Arrivals", "Women Accessories"], dateAdded: "2024-03-16T10:15:00Z"
},

{
  id: 41, name: 'Executive Chrono Watch MA', brand: 'Time Master', price: '$150.00', priceValue: 150.00,
  images: [ { url: '/product-12.jpg', colorHex: '#2F4F4F', altText: 'Executive Chrono Watch Dark Slate Gray' } ],
  allColors: ["#2F4F4F"], description: "Sophisticated chronograph watch.",
  detailedDescription: "Full details for Executive Chrono Watch (ID 41).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:7, initial:10} },
  rating: 4.8, reviewCount: 28, categories: ["Men Accessories", "Watches"], tags: ["New", "Watch", "Chronograph"],
  collections: ["New Arrivals", "Men Accessories"], dateAdded: "2024-03-16T10:16:00Z"
},
{
  id: 42, name: 'Premium Leather Belt MA', brand: 'Buckle Up', price: '$40.00', priceValue: 40.00,
  images: [ { url: '/product-14.jpg', colorHex: '#8B4513', altText: 'Premium Leather Belt Brown' } ], 
  allColors: ["#8B4513"], description: "Durable genuine leather belt.",
  detailedDescription: "Full details for Premium Leather Belt (ID 42).",
  availableSizes: ["32", "34", "36"], sizes: ["32", "34", "36"],
  stockQuantity: { "32":{current:10}, "34":{current:12}, "36":{current:9} },
  rating: 4.7, reviewCount: 35, categories: ["Men Accessories", "Belts"], tags: ["New", "Leather", "Durable"],
  collections: ["New Arrivals", "Men Accessories"], dateAdded: "2024-03-16T10:17:00Z"
},
{
  id: 43, name: 'Slim RFID Wallet MA', brand: 'Secure Hold', price: '$30.50', priceValue: 30.50,
  images: [ { url: '/product-13.jpg', colorHex: '#696969', altText: 'Slim RFID Wallet Grey' } ], 
  allColors: ["#696969"], description: "Secure and slim RFID blocking wallet.",
  detailedDescription: "Full details for Slim RFID Wallet (ID 43).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:20, initial:30} },
  rating: 4.9, reviewCount: 40, categories: ["Men Accessories", "Wallets"], tags: ["New", "RFID", "Slim", "Secure"],
  collections: ["New Arrivals", "Men Accessories"], dateAdded: "2024-03-16T10:18:00Z"
},
{
  id: 44, name: 'Luxury Tie & Pocket Square Set MA', brand: 'Gentleman Choice', price: '$25.99', priceValue: 25.99,
  images: [ { url: '/product-20.jpg', colorHex: '#B22222', altText: 'Luxury Tie & Pocket Square Set Red' } ], 
  allColors: ["#B22222"], description: "Elegant tie and pocket square set.",
  detailedDescription: "Full details for Luxury Tie & Pocket Square Set (ID 44).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:15, initial:20} },
  rating: 4.6, reviewCount: 18, categories: ["Men Accessories", "Ties"], tags: ["New", "Formal", "Set"],
  collections: ["New Arrivals", "Men Accessories"], dateAdded: "2024-03-16T10:19:00Z"
},

// --- Discount Deals (IDs 51-54) ---
{
  id: 51, name: 'Triple Tee Value Deal DD', brand: 'Value Pack', price: '$25.00', originalPrice: '$40.00', priceValue: 25.00,
  images: [ { url: '/product-25.jpg', colorHex: '#9ACD32', altText: 'Triple Tee Value Deal Assorted' } ],
  allColors: ["#9ACD32"], description: "Great value t-shirt bundle.",
  detailedDescription: "Full details for Triple Tee Value Deal (ID 51).",
  availableSizes: ["S", "M", "L", "XL"], sizes: ["S", "M", "L", "XL"],
  stockQuantity: { S:{current:30}, M:{current:40}, L:{current:35}, XL:{current:20} },
  rating: 4.1, reviewCount: 75, categories: ["Discount Deals", "Men's Fashion", "Women's Fashion"], tags: ["New", "Bundle", "Sale"],
  collections: ["New Arrivals", "Discount Deals"], dateAdded: "2024-03-16T10:20:00Z", isSaleItem: true
},
{
  id: 52, name: 'Accessory Starter Kit DD', brand: 'Bargain Bin', price: '$19.99', originalPrice: '$29.99', priceValue: 19.99,
  images: [ { url: '/product-30.jpg', colorHex: '#ADD8E6', altText: 'Accessory Starter Kit' } ],
  allColors: ["#ADD8E6"], description: "Combo offer on essential accessories.",
  detailedDescription: "Full details for Accessory Starter Kit (ID 52).",
  availableSizes: ["One Size"], sizes: ["One Size"], stockQuantity: { "One Size":{current:25, initial:40} },
  rating: 3.9, reviewCount: 55, categories: ["Discount Deals", "Men Accessories", "Women Accessories"], tags: ["New", "Combo", "Sale"],
  collections: ["New Arrivals", "Discount Deals"], dateAdded: "2024-03-16T10:21:00Z", isSaleItem: true
},
{
  id: 53, name: 'Comfy Hoodie Clearance DD', brand: 'Last Chance', price: '$20.00', originalPrice: '$35.00', priceValue: 20.00,
  images: [ { url: '/product-22.jpg', colorHex: '#FF6347', altText: 'Comfy Hoodie Clearance Tomato' } ], // Tomato
  allColors: ["#FF6347"], description: "Clearance sale on comfy hoodies.",
  detailedDescription: "Full details for Comfy Hoodie Clearance (ID 53).",
  availableSizes: ["M", "L"], sizes: ["M", "L"],
  stockQuantity: { M:{current:10}, L:{current:5} },
  rating: 4.0, reviewCount: 42, categories: ["Discount Deals", "Men's Fashion", "Women's Fashion"], tags: ["New", "Clearance", "Sale", "Hoodie"],
  collections: ["New Arrivals", "Discount Deals"], dateAdded: "2024-03-16T10:22:00Z", isSaleItem: true
},
{
  id: 54, name: 'VantaBlack', brand: 'Save More', price: '$35.50', originalPrice: '$50.00', priceValue: 35.50,
  images: [ { url: '/product-50.jpg', colorHex: '#000000', altText: 'Everyday Jeans Discount SteelBlue' } ], // SteelBlue
  allColors: ["#4682B4"], description: "Special price on everyday jeans.",
  detailedDescription: "Full details for Everyday Jeans Discount (ID 54).",
  availableSizes: ["28", "30", "32", "34"], sizes: ["28", "30", "32", "34"],
  stockQuantity: { "28":{current:10}, "30":{current:15}, "32":{current:12}, "34":{current:8} },
  rating: 4.2, reviewCount: 50, categories: ["Discount Deals", "Men's Fashion", "Women's Fashion"], tags: ["New", "Jeans", "Sale"],
  collections: ["New Arrivals", "Discount Deals"], dateAdded: "2024-03-16T10:23:00Z", isSaleItem: true
},
 {
      id: 1001,
      name: "Triple-Threat Deal Hoodie", // Name for the unified deal product
      brand: "DealMaster Flex",
      price: "$35.00", // 30% off $50
      priceValue: 35.00,
      originalPrice: "$50.00",
      images: [ // All three visual variants are part of this ONE product
        { colorHex: '#A52A2A', url: '/s2.svg', altText: 'Brown Deal Hoodie' }, // Brown
        { colorHex: '#000000', url: '/s3.svg', altText: 'Black Deal Hoodie' }, // Black
        { colorHex: '#FFA500', url: '/s4.svg', altText: 'Orange Deal Hoodie' }  // Orange
      ],
      allColors: ['#A52A2A', '#000000', '#FFA500'], // Brown, Black, Orange
      description: "Grab this amazing hoodie deal, available in three popular colors! 30% off for a limited time.",
      detailedDescription: "Our Triple-Threat Deal Hoodie is the perfect combination of style, comfort, and unbeatable value. Made from a premium cotton blend, it features a soft interior, durable construction, and a modern fit. Choose from classic Brown, sleek Black, or vibrant Orange. All colors are part of this special 30% off deal!",
      availableSizes: ['S', 'M', 'L', 'XL'],
      sizes: ['S', 'M', 'L', 'XL'],
      stockQuantity: { 
        S: { current: 15 }, 
        M: { current: 20 }, 
        L: { current: 18 }, 
        XL: { current: 12 } 
      },
      isSaleItem: true,
      collections: ["Deals of the Month", "Featured Deals", "Hoodies"],
      tags: ["Deal", "Hoodie", "Sale", "Multi-color", "Limited Time"],
      rating: 4.7,
      reviewCount: 150,
      dateAdded: "2024-03-10"
    },

    {
      id: 2001,
      name: "The Garrison Pink Cap", 
      brand: "Shelby & Co. Limited",
      price: "$99.99",
      priceValue: 99.99,
      images: [
        { colorHex: '#FFC0CB', url: '/pb1.svg', altText: 'Peaky Blinders Style Pink Cap' }, { colorHex: '#000000', url: '/images/pk2.svg', altText: 'Peaky Blinders Style Pink Cap' } // Assuming /pb1.svg is the cap visual
      ],
      allColors: ['#FFC0CB'], 
      description: "A dapper Peaky Blinders inspired cap in a striking pink. By order of the Peaky Blinders!",
      detailedDescription: "This finely crafted flat cap, inspired by the iconic Peaky Blinders style, comes in a unique and bold pink hue. Made from quality materials, it's the perfect accessory to complete your sharp, vintage look. Limited edition color.",
      availableSizes: ['One Size'], 
     sizes: ['One Size'],
      stockQuantity: { 'One Size': { current: 50 } },
      collections: ["Peaky Blinders Collection", "Headwear", "Vintage Inspired"],
      tags: ["Peaky Blinders", "Cap", "Pink", "Vintage", "Accessory"],
      rating: 4.8,
      reviewCount: 85,
      dateAdded: "2024-02-20"
    },
    
];