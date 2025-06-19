export const products = [
    {
        id: 'elec-001',
        name: 'Wireless Noise-Cancelling Headphones',
        category: 'Electronics',
        price: 199.99,
        description: 'Experience immersive sound with active noise cancellation and comfortable over-ear design. Up to 30 hours battery life.',
        image: 'headphones_electronics.png',
        reviews: [
            {
                rating: 5,
                title: "Amazing Headphones!",
                text: "These headphones are fantastic. The noise cancellation is superb, blocking out almost everything. Sound quality is crisp and clear, and they are super comfortable for long listening sessions. Battery life is also impressive.",
                author: "Audio Enthusiast",
                date: "2023-10-20"
            },
            {
                rating: 4,
                title: "Great sound, minor comfort issue",
                text: "Sound is top-notch and ANC works really well. My only complaint is that they get a bit warm on my ears after a couple of hours. Still highly recommend them.",
                author: "Music Lover",
                date: "2023-11-05"
            },
            {
                rating: 1,
                title: "Disappointing Battery",
                text: "Battery life is nowhere near 30 hours. I get maybe 15 hours on a good day with ANC off. Very disappointed.",
                author: "Frequent Traveler",
                date: "2023-11-18"
            }
        ]
    },
     {
        id: 'elec-002',
        name: 'Smart Home Assistant Speaker',
        category: 'Electronics',
        price: 89.50,
        description: 'Voice-controlled speaker for music, news, smart home control, and more.',
        image: 'smartspeaker_electronics.png',
        reviews: [
            {
                rating: 4,
                title: "Convenient and smart",
                text: "Works well with my smart home devices. Voice recognition is pretty accurate. Sound quality is decent for its size.",
                author: "Tech Savvy",
                date: "2023-10-25"
            },
             {
                rating: 3,
                title: "Okay speaker, sometimes glitches",
                text: "It does the job for basic commands and playing music. Sometimes it struggles to understand or connect. Could be more reliable.",
                author: "Casual User",
                date: "2023-11-10"
            }
        ]
    },
     {
        id: 'elec-003',
        name: 'Portable Bluetooth Projector',
        category: 'Electronics',
        price: 249.00,
        description: 'Compact projector with Bluetooth connectivity for streaming movies anywhere.',
        image: 'projector_electronics.png',
        reviews: [
            {
                rating: 5,
                title: "Perfect for movie nights!",
                text: "Absolutely love this little projector! It's so easy to set up anywhere, and the picture quality is surprisingly good for its size. Bluetooth connection for sound is a bonus.",
                author: "Movie Buff",
                date: "2023-11-01"
            }
        ]
    },
     {
        id: 'mobile-001',
        name: 'SleekPhone X',
        category: 'Mobile Devices',
        price: 799.00,
        description: 'Our flagship smartphone with a stunning OLED display, powerful processor, and advanced camera system.',
        image: 'smartphone_mobile.png',
         reviews: [
            {
                rating: 5,
                title: "Best phone I've ever had",
                text: "Fast, beautiful screen, amazing camera. Worth every penny. The design is also super sleek.",
                author: "Early Adopter",
                date: "2023-09-30"
            },
             {
                rating: 4,
                title: "Excellent phone, pricey",
                text: "Performance is top-tier, handles everything I throw at it. Camera is fantastic. Just wish it was a bit more affordable.",
                author: "Happy User",
                date: "2023-10-15"
            }
        ]
    },
     {
        id: 'mobile-002',
        name: 'ProTab 10',
        category: 'Mobile Devices',
        price: 349.95,
        description: 'Versatile 10-inch tablet perfect for work and entertainment.',
        image: 'tablet_mobile.png',
         reviews: [
            {
                rating: 4,
                title: "Solid all-around tablet",
                text: "Good screen, decent speed for browsing and videos. Great for reading and light work. Battery lasts a long time.",
                author: "Student",
                date: "2023-11-08"
            }
        ]
    },
     {
        id: 'mobile-003',
        name: 'SleekWatch Fit',
        category: 'Mobile Devices',
        price: 129.00,
        description: 'Track your fitness goals and stay connected with this stylish smartwatch.',
        image: 'smartwatch_mobile.png',
         reviews: [
            {
                rating: 5,
                title: "Motivational and stylish",
                text: "Helps me stay active and I love how it looks on my wrist. Syncs easily with my phone. Battery life is great for a smartwatch.",
                author: "Fitness Fan",
                date: "2023-10-05"
            },
             {
                rating: 2,
                title: "Connectivity issues",
                text: "Looks good, but I constantly have issues keeping it connected to my phone. Notifications are unreliable.",
                author: "Frustrated Buyer",
                date: "2023-11-20"
            }
        ]
    },
    {
        id: 'clothing-001',
        name: 'Classic Cotton T-Shirt (Blue)',
        category: 'Clothing',
        subcategory: 'Shirts',
        price: 19.90,
        description: 'Soft, comfortable 100% cotton t-shirt. Available in various colors.',
        image: 'tshirt_clothing.png',
        reviews: [
            {
                rating: 5,
                title: "New favorite t-shirt!",
                text: "Incredibly soft and fits perfectly. The blue color is vibrant. Washes well without shrinking.",
                author: "Happy Customer",
                date: "2023-10-10"
            }
        ]
    },
    {
        id: 'clothing-002',
        name: 'Slim Fit Jeans (Dark Wash)',
        category: 'Clothing',
        subcategory: 'Pants',
        price: 49.50,
        description: 'Durable denim jeans with a modern slim fit.',
        image: 'jeans_clothing.png',
         reviews: [
            {
                rating: 4,
                title: "Great fit and quality",
                text: "These jeans fit exactly as expected and the denim feels durable. Dark wash looks good. A bit stiff initially but comfortable after a wash.",
                author: "Jean Wearer",
                date: "2023-11-15"
            }
        ]
    },
    {
        id: 'clothing-003',
        name: 'Leather Wallet (Brown)',
        category: 'Clothing',
        subcategory: 'Accessories',
        price: 35.00,
        description: 'Genuine leather wallet with multiple card slots.',
        image: 'wallet_clothing.png'
    },
     {
        id: 'clothing-004',
        name: 'Summer Shorts (Khaki)',
        category: 'Clothing',
        subcategory: 'Pants',
        price: 29.00,
        description: 'Lightweight and comfortable shorts for warm weather.',
        image: 'shorts_clothing.png'
    },
     {
        id: 'clothing-005',
        name: 'Button-Up Shirt (White Linen)',
        category: 'Clothing',
        subcategory: 'Shirts',
        price: 45.00,
        description: 'Breathable linen shirt, perfect for casual or semi-formal occasions.',
        image: 'linen_shirt_clothing.png',
         reviews: [
            {
                rating: 5,
                title: "Perfect summer shirt",
                text: "This linen shirt is lightweight and keeps me cool. Looks great for beach days or casual dinners. Minimal ironing needed.",
                author: "Summer Ready",
                date: "2023-08-20"
            }
        ]
    },
     {
        id: 'clothing-006',
        name: 'Stylish Scarf (Floral Print)',
        category: 'Clothing',
        subcategory: 'Accessories',
        price: 25.00,
        description: 'Add a touch of elegance with this lightweight floral print scarf.',
        image: 'scarf_clothing.png'
    },
    {
        id: 'lifestyle-001',
        name: 'Scented Soy Candle',
        category: 'Lifestyle',
        price: 15.00,
        description: 'Relaxing lavender scent made with natural soy wax.',
        image: 'candle_lifestyle.png',
         reviews: [
            {
                rating: 5,
                title: "Lovely relaxing scent",
                text: "The lavender scent is subtle but fills the room nicely. Burns evenly. Great value for a soy candle.",
                author: "Home Spa Fan",
                date: "2023-11-03"
            }
        ]
    },
     {
        id: 'lifestyle-002',
        name: 'Yoga Mat (Eco-Friendly)',
        category: 'Lifestyle',
        price: 39.99,
        description: 'Non-slip and durable yoga mat made from sustainable materials.',
        image: 'yogamat_lifestyle.png',
         reviews: [
            {
                rating: 4,
                title: "Good grip, minor smell",
                text: "This mat has excellent grip, even during sweaty sessions. Feels durable. There was a slight smell when first unrolled, but it dissipated.",
                author: "Yogi Bear",
                date: "2023-10-18"
            }
        ]
    },
     {
        id: 'lifestyle-003',
        name: 'Travel Mug (Insulated)',
        category: 'Lifestyle',
        price: 22.50,
        description: 'Keep your drinks hot or cold for hours with this stylish travel mug.',
        image: 'travelmug_lifestyle.png',
         reviews: [
            {
                rating: 5,
                title: "Keeps coffee hot!",
                text: "Seriously impressed by how long this mug keeps my coffee hot. Leak-proof lid is a plus. Stylish design too.",
                author: "Commuter",
                date: "2023-09-25"
            }
        ]
    },
     {
        id: 'lifestyle-004',
        name: 'Indoor Succulent Plant',
        category: 'Lifestyle',
        price: 12.00,
        description: 'Easy-care succulent to bring a touch of nature indoors.',
        image: 'succulent_lifestyle.png',
         reviews: [
            {
                rating: 5,
                title: "Adorable and low maintenance",
                text: "Perfect little plant for my desk. Looks healthy and requires minimal watering. Great for beginners.",
                author: "Green Thumb (Beginner)",
                date: "2023-11-22"
            }
        ]
    },
    {
        id: 'elec-004',
        name: 'Portable Power Bank (10000mAh)',
        category: 'Electronics',
        price: 29.99,
        description: 'High-capacity power bank to keep your devices charged on the go.',
        image: 'powerbank_electronics.png'
    },
    {
        id: 'elec-005',
        name: 'Wireless Mouse',
        category: 'Electronics',
        price: 19.50,
        description: 'Ergonomic wireless mouse with adjustable DPI for comfortable work.',
        image: 'wirelessmouse_electronics.png'
    },
    {
        id: 'mobile-004',
        name: 'Smartphone Stand with Charger',
        category: 'Mobile Devices',
        price: 35.00,
        description: 'Convenient desk stand that wirelessly charges your compatible smartphone.',
        image: 'phonestand_mobile.png',
         reviews: [
            {
                rating: 4,
                title: "Handy desk accessory",
                text: "Charges reliably and holds my phone at a good angle for video calls. Doesn't feel cheap. Wish it came with a power brick though.",
                author: "Desk Jockey",
                date: "2023-11-19"
            }
        ]
    },
    {
        id: 'mobile-005',
        name: 'Tablet Protective Case',
        category: 'Mobile Devices',
        price: 24.00,
        description: 'Durable and lightweight case to protect your tablet from drops and scratches.',
        image: 'tabletcase_mobile.png'
    },
    {
        id: 'clothing-007',
        name: 'Basic Hoodie (Grey)',
        category: 'Clothing',
        subcategory: 'Outerwear',
        price: 39.00,
        description: 'Comfortable and warm grey hoodie, perfect for casual wear.',
        image: 'hoodie_clothing.png',
         reviews: [
            {
                rating: 5,
                title: "Very comfy!",
                text: "Soft lining and perfect fit. My go-to hoodie for lounging or running errands. Holds up well after washing.",
                author: "Comfort Seeker",
                date: "2023-10-01"
            }
        ]
    },
    {
        id: 'clothing-008',
        name: 'Running Socks (3-Pack)',
        category: 'Clothing',
        subcategory: 'Accessories',
        price: 14.95,
        description: 'Moisture-wicking athletic socks for running and sports.',
        image: 'runningsocks_clothing.png'
    },
     {
        id: 'clothing-009',
        name: 'Leather Belt (Black)',
        category: 'Clothing',
        subcategory: 'Accessories',
        price: 30.00,
        description: 'Classic black leather belt with a simple buckle.',
        image: 'leatherbelt_clothing.png'
    },
     {
        id: 'clothing-010',
        name: 'Summer Dress (Floral)',
        category: 'Clothing',
        subcategory: 'Dresses',
        price: 55.00,
        description: 'Light and airy floral summer dress.',
        image: 'summerdress_clothing.png',
         reviews: [
            {
                rating: 4,
                title: "Lovely print, runs a bit small",
                text: "The floral pattern is beautiful and the fabric is very light. Fits nicely but I'd recommend sizing up if you prefer a looser fit.",
                author: "Dress Lover",
                date: "2023-07-10"
            }
        ]
    },
    {
        id: 'lifestyle-005',
        name: 'Reusable Shopping Bag',
        category: 'Lifestyle',
        price: 8.50,
        description: 'Eco-friendly, durable, and foldable shopping bag.',
        image: 'reusableshoppingbag_lifestyle.png',
         reviews: [
            {
                rating: 5,
                title: "Durable and convenient",
                text: "Much sturdier than other reusable bags I've used. Folds up small to keep in my purse. Great for groceries.",
                author: "Eco Shopper",
                date: "2023-09-01"
            }
        ]
    },
    {
        id: 'lifestyle-006',
        name: 'Notebook and Pen Set',
        category: 'Lifestyle',
        price: 18.00,
        description: 'High-quality notebook with a sleek pen for journaling or notes.',
        image: 'notebookset_lifestyle.png'
    },
    {
        id: 'homeapp-001',
        name: 'Compact Coffee Maker',
        category: 'Home Appliances',
        price: 59.99,
        description: 'Single-serve coffee maker, perfect for small spaces.',
        image: 'coffeemaker_homeapp.png',
         reviews: [
            {
                rating: 4,
                title: "Good coffee, simple to use",
                text: "Makes a quick cup of coffee, perfect for my small kitchen. Easy to clean. Brews a bit cooler than I prefer, but still good.",
                author: "Coffee Drinker",
                date: "2023-10-08"
            }
        ]
    },
    {
        id: 'homeapp-002',
        name: 'Handheld Vacuum Cleaner',
        category: 'Home Appliances',
        price: 45.00,
        description: 'Cordless and powerful handheld vacuum for quick cleanups.',
        image: 'handheldvacuum_homeapp.png',
         reviews: [
            {
                rating: 5,
                title: "Powerful little vacuum",
                text: "Great suction for crumbs and small messes. Easy to empty and charge. Essential for quick cleanups.",
                author: "Clean Freak",
                date: "2023-11-07"
            }
        ]
    },
     {
        id: 'homeapp-003',
        name: 'Electric Kettle',
        category: 'Home Appliances',
        price: 34.90,
        description: 'Fast-boiling electric kettle with automatic shut-off.',
        image: 'electrickettle_homeapp.png'
    },
     {
        id: 'homeapp-004',
        name: 'Toaster (2-Slice)',
        category: 'Home Appliances',
        price: 29.95,
        description: 'Simple 2-slice toaster with defrost and reheat functions.',
        image: 'toaster_homeapp.png'
    },
    {
        id: 'outdoor-001',
        name: 'Camping Chair (Foldable)',
        category: 'Outdoor Gear',
        price: 35.00,
        description: 'Lightweight and foldable camping chair with cup holder.',
        image: 'campingchair_outdoor.png',
         reviews: [
            {
                rating: 4,
                title: "Comfortable and portable",
                text: "Easy to fold and carry. Surprisingly comfortable for its size. Cup holder is a nice touch. Seems sturdy enough for casual use.",
                author: "Camper",
                date: "2023-09-15"
            }
        ]
    },
     {
        id: 'outdoor-002',
        name: 'Insulated Water Bottle (1L)',
        category: 'Outdoor Gear',
        price: 25.00,
        description: 'Keeps water cold for 24 hours or hot for 12 hours.',
        image: 'waterbottle_outdoor.png',
         reviews: [
            {
                rating: 5,
                title: "Keeps drinks cold all day!",
                text: "Tested this on a hot hike, and my water stayed icy cold. The 1L size is perfect. Durable finish.",
                author: "Hiker",
                date: "2023-10-02"
            }
        ]
    },
     {
        id: 'outdoor-003',
        name: 'Backpack (Day Trip)',
        category: 'Outdoor Gear',
        price: 49.00,
        description: 'Compact and comfortable backpack for hiking or daily use.',
        image: 'backpack_outdoor.png'
    },
    {
        id: 'elec-006',
        name: 'USB-C Hub (Multiport)',
        category: 'Electronics',
        price: 39.99,
        description: 'Expand your laptop ports with this compact USB-C hub.',
        image: 'usbc_hub_electronics.png',
         reviews: [
            {
                rating: 3,
                title: "Works, but gets hot",
                text: "Adds the ports I need for my laptop. Functions as expected, but it gets quite warm to the touch when using multiple ports.",
                author: "Remote Worker",
                date: "2023-11-25"
            }
        ]
    },
    {
        id: 'lifestyle-007',
        name: 'Aromatherapy Diffuser',
        category: 'Lifestyle',
        price: 28.00,
        description: 'Create a relaxing atmosphere with this essential oil diffuser.',
        image: 'diffuser_lifestyle.png'
    },
     {
        id: 'homeapp-005',
        name: 'Digital Kitchen Scale',
        category: 'Home Appliances',
        price: 22.00,
        description: 'Precise digital scale for cooking and baking.',
        image: 'kitchenscale_homeapp.png',
         reviews: [
            {
                rating: 5,
                title: "Accurate and easy to use",
                text: "Perfectly accurate for baking ingredients. Simple design, easy to clean. Great value.",
                author: "Home Baker",
                date: "2023-11-05"
            }
        ]
    }
];