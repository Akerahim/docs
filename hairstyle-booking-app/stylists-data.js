// ========================================
// Sample Stylists Data
// ========================================

const stylistsData = [
    {
        id: 1,
        name: "Fatima Diallo",
        rating: 4.9,
        reviews: 127,
        specialties: ["Tresses", "Locks", "Tissage"],
        city: "Paris",
        address: "15 Rue de la République",
        location: {
            lat: 48.8566,
            lng: 2.3522
        },
        priceFrom: 35,
        homeService: true,
        salonService: true,
        description: "Coiffeuse professionnelle avec 10 ans d'expérience. Spécialiste des tresses africaines et des locks. Passionnée par mon métier, j'apporte le plus grand soin à chaque coiffure.",
        services: [
            { id: 1, name: "Tresses collées", price: 50, duration: 120 },
            { id: 2, name: "Box braids", price: 80, duration: 180 },
            { id: 3, name: "Locks (entretien)", price: 40, duration: 90 },
            { id: 4, name: "Tissage pose", price: 70, duration: 150 },
            { id: 5, name: "Tresses sénégalaises", price: 90, duration: 240 }
        ]
    },
    {
        id: 2,
        name: "Aminata Koné",
        rating: 4.8,
        reviews: 93,
        specialties: ["Défrisage", "Coupe", "Coloration"],
        city: "Lyon",
        address: "28 Avenue Jean Jaurès",
        location: {
            lat: 45.7640,
            lng: 4.8357
        },
        priceFrom: 30,
        homeService: true,
        salonService: false,
        description: "Je suis spécialisée dans les soins capillaires et le défrisage. Mon objectif est de prendre soin de vos cheveux tout en vous sublimant.",
        services: [
            { id: 1, name: "Défrisage + soin", price: 60, duration: 120 },
            { id: 2, name: "Coupe femme", price: 30, duration: 45 },
            { id: 3, name: "Coloration", price: 55, duration: 90 },
            { id: 4, name: "Brushing", price: 25, duration: 30 },
            { id: 5, name: "Soin profond", price: 40, duration: 60 }
        ]
    },
    {
        id: 3,
        name: "Mariama Touré",
        rating: 5.0,
        reviews: 156,
        specialties: ["Tresses", "Tissage", "Perruques"],
        city: "Marseille",
        address: "42 Boulevard de la Libération",
        location: {
            lat: 43.2965,
            lng: 5.3698
        },
        priceFrom: 40,
        homeService: true,
        salonService: true,
        description: "Coiffeuse afro passionnée depuis 12 ans. Je réalise tous types de tresses et poses de tissage. La satisfaction de mes clientes est ma priorité.",
        services: [
            { id: 1, name: "Vanilles", price: 45, duration: 120 },
            { id: 2, name: "Crochet braids", price: 65, duration: 150 },
            { id: 3, name: "Tissage complet", price: 85, duration: 180 },
            { id: 4, name: "Pose perruque", price: 50, duration: 60 },
            { id: 5, name: "Twists", price: 55, duration: 150 }
        ]
    },
    {
        id: 4,
        name: "Kadiatou Bah",
        rating: 4.7,
        reviews: 84,
        specialties: ["Locks", "Tresses", "Soins"],
        city: "Toulouse",
        address: "18 Rue Gambetta",
        location: {
            lat: 43.6047,
            lng: 1.4442
        },
        priceFrom: 35,
        homeService: false,
        salonService: true,
        description: "Spécialiste des locks et dreadlocks. J'accorde une attention particulière à la santé de vos cheveux avec des produits naturels.",
        services: [
            { id: 1, name: "Locks création", price: 120, duration: 300 },
            { id: 2, name: "Locks entretien", price: 45, duration: 90 },
            { id: 3, name: "Tresses simples", price: 35, duration: 90 },
            { id: 4, name: "Soin naturel", price: 30, duration: 60 },
            { id: 5, name: "Coiffure protectrice", price: 50, duration: 120 }
        ]
    },
    {
        id: 5,
        name: "Aïssatou Sow",
        rating: 4.9,
        reviews: 112,
        specialties: ["Tresses", "Défrisage", "Tissage"],
        city: "Nantes",
        address: "33 Rue de Strasbourg",
        location: {
            lat: 47.2184,
            lng: -1.5536
        },
        priceFrom: 38,
        homeService: true,
        salonService: true,
        description: "Je propose des prestations de qualité à domicile ou en salon. Expérience de 8 ans dans la coiffure afro.",
        services: [
            { id: 1, name: "Cornrows", price: 55, duration: 150 },
            { id: 2, name: "Tissage brésilien", price: 90, duration: 180 },
            { id: 3, name: "Défrisage doux", price: 58, duration: 120 },
            { id: 4, name: "Tresses papillons", price: 48, duration: 120 },
            { id: 5, name: "Chignon tressé", price: 42, duration: 90 }
        ]
    },
    {
        id: 6,
        name: "Bintou Camara",
        rating: 4.6,
        reviews: 67,
        specialties: ["Coupe", "Coloration", "Lissage"],
        city: "Bordeaux",
        address: "25 Cours Victor Hugo",
        location: {
            lat: 44.8378,
            lng: -0.5792
        },
        priceFrom: 32,
        homeService: true,
        salonService: false,
        description: "Coiffeuse visagiste, je saurai vous conseiller sur la coupe et la couleur qui vous sublimeront.",
        services: [
            { id: 1, name: "Coupe + brushing", price: 40, duration: 60 },
            { id: 2, name: "Coloration complète", price: 65, duration: 120 },
            { id: 3, name: "Lissage brésilien", price: 95, duration: 180 },
            { id: 4, name: "Mèches", price: 55, duration: 90 },
            { id: 5, name: "Coupe courte", price: 32, duration: 45 }
        ]
    },
    {
        id: 7,
        name: "Hawa Diaby",
        rating: 5.0,
        reviews: 98,
        specialties: ["Tresses", "Tissage", "Locks"],
        city: "Strasbourg",
        address: "12 Place Kléber",
        location: {
            lat: 48.5734,
            lng: 7.7521
        },
        priceFrom: 45,
        homeService: true,
        salonService: true,
        description: "Passionnée de coiffure afro depuis toujours. Je réalise des tresses impeccables et durables.",
        services: [
            { id: 1, name: "Goddess braids", price: 75, duration: 180 },
            { id: 2, name: "Fulani braids", price: 85, duration: 210 },
            { id: 3, name: "Tissage closure", price: 80, duration: 150 },
            { id: 4, name: "Starter locks", price: 100, duration: 240 },
            { id: 5, name: "Feed-in braids", price: 70, duration: 180 }
        ]
    },
    {
        id: 8,
        name: "Fatoumata Keita",
        rating: 4.8,
        reviews: 105,
        specialties: ["Soins", "Défrisage", "Coupe"],
        city: "Lille",
        address: "8 Rue de Béthune",
        location: {
            lat: 50.6292,
            lng: 3.0573
        },
        priceFrom: 35,
        homeService: false,
        salonService: true,
        description: "Mon salon vous accueille dans une ambiance chaleureuse. Spécialiste des soins capillaires.",
        services: [
            { id: 1, name: "Soin protéiné", price: 45, duration: 90 },
            { id: 2, name: "Défrisage + coupe", price: 70, duration: 150 },
            { id: 3, name: "Traitement kératine", price: 85, duration: 120 },
            { id: 4, name: "Coupe dégradée", price: 35, duration: 45 },
            { id: 5, name: "Botox capillaire", price: 75, duration: 120 }
        ]
    },
    {
        id: 9,
        name: "Mariam Cissé",
        rating: 4.9,
        reviews: 88,
        specialties: ["Tresses", "Tissage", "Perruques"],
        city: "Rennes",
        address: "30 Rue de la Monnaie",
        location: {
            lat: 48.1173,
            lng: -1.6778
        },
        priceFrom: 42,
        homeService: true,
        salonService: true,
        description: "Artiste capillaire avec une touche créative. J'aime créer des coiffures uniques et personnalisées.",
        services: [
            { id: 1, name: "Knotless braids", price: 95, duration: 240 },
            { id: 2, name: "Lemonade braids", price: 80, duration: 200 },
            { id: 3, name: "Tissage frontal", price: 90, duration: 180 },
            { id: 4, name: "Perruque sur mesure", price: 120, duration: 180 },
            { id: 5, name: "Passion twists", price: 85, duration: 210 }
        ]
    },
    {
        id: 10,
        name: "Awa Traoré",
        rating: 4.7,
        reviews: 76,
        specialties: ["Locks", "Tresses", "Soins naturels"],
        city: "Montpellier",
        address: "14 Rue Foch",
        location: {
            lat: 43.6108,
            lng: 3.8767
        },
        priceFrom: 38,
        homeService: true,
        salonService: false,
        description: "Adepte du naturel, j'utilise uniquement des produits bio pour prendre soin de vos cheveux.",
        services: [
            { id: 1, name: "Locks naturelles", price: 45, duration: 120 },
            { id: 2, name: "Tresses au crochet", price: 60, duration: 150 },
            { id: 3, name: "Soin bio maison", price: 38, duration: 75 },
            { id: 4, name: "Coiffure afro naturelle", price: 40, duration: 90 },
            { id: 5, name: "Twist-out styling", price: 35, duration: 60 }
        ]
    }
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = stylistsData;
}
