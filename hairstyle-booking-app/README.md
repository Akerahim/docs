# BeautyConnect - Application de Réservation de Coiffure

## 📋 Description

BeautyConnect est une application web de mise en relation entre clientes et coiffeuses professionnelles, inspirée du modèle Uber/Bolt. L'application permet de :

- 🔍 Trouver des coiffeuses professionnelles près de chez vous grâce à la géolocalisation
- 📅 Réserver des rendez-vous en ligne facilement
- 🏠 Choisir entre un service à domicile ou en salon
- 💇‍♀️ Découvrir différents styles de coiffure (tresses, locks, tissage, défrisage, etc.)
- ⭐ Consulter les avis et notes des coiffeuses
- 💳 Payer en ligne ou en espèces

## 🚀 Fonctionnalités

### Pour les Clientes

1. **Recherche de Coiffeuses**
   - Géolocalisation automatique
   - Recherche par ville, quartier ou code postal
   - Filtrage par type de service, distance et spécialité
   - Tri par distance, note ou prix

2. **Réservation en 4 Étapes**
   - Étape 1 : Choix de la coiffeuse
   - Étape 2 : Sélection des services
   - Étape 3 : Choix de la date et de l'heure
   - Étape 4 : Confirmation et paiement

3. **Options de Service**
   - Service à domicile (la coiffeuse vient chez vous)
   - Service en salon (vous vous déplacez)

4. **Profils de Coiffeuses**
   - Informations détaillées
   - Spécialités et services proposés
   - Avis et évaluations
   - Tarifs transparents

### Pour les Coiffeuses

- Gestion des rendez-vous
- Définition des disponibilités
- Choix des types de services offerts
- Gestion des tarifs

## 🛠️ Technologies Utilisées

- **HTML5** : Structure des pages
- **CSS3** : Mise en forme et design responsive
- **JavaScript (Vanilla)** : Logique applicative
- **Font Awesome** : Icônes
- **Geolocation API** : Géolocalisation des utilisateurs

## 📁 Structure du Projet

```
hairstyle-booking-app/
│
├── index.html              # Page d'accueil
├── coiffeuses.html        # Page de recherche de coiffeuses
├── reservation.html       # Page de réservation
├── styles.css             # Feuille de style principale
├── script.js              # JavaScript principal
├── booking.js             # Logique de réservation
├── stylists-data.js       # Données des coiffeuses (mock)
└── README.md              # Documentation
```

## 🚀 Installation et Lancement

### Prérequis

- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un serveur web local (optionnel mais recommandé)

### Option 1 : Ouverture Directe

1. Clonez ou téléchargez le projet
2. Ouvrez `index.html` dans votre navigateur

### Option 2 : Avec un Serveur Local

**Avec Python :**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Avec Node.js (http-server) :**
```bash
npx http-server
```

**Avec PHP :**
```bash
php -S localhost:8000
```

Ensuite, accédez à `http://localhost:8000` dans votre navigateur.

## 📱 Utilisation

### Trouver une Coiffeuse

1. Cliquez sur "Trouver une coiffeuse" dans le menu
2. Autorisez la géolocalisation ou entrez votre adresse
3. Appliquez des filtres selon vos préférences
4. Consultez les profils des coiffeuses disponibles

### Réserver un Rendez-vous

1. Sélectionnez une coiffeuse
2. Cliquez sur "Réserver"
3. Choisissez vos services
4. Sélectionnez la date et l'heure
5. Remplissez vos informations
6. Confirmez votre réservation

## 🔐 Géolocalisation

L'application utilise l'API Geolocation du navigateur pour :
- Trouver automatiquement votre position
- Calculer les distances avec les coiffeuses
- Trier les résultats par proximité

**Note :** Vous devez autoriser l'accès à votre localisation dans votre navigateur.

## 📊 Données de Démonstration

Le fichier `stylists-data.js` contient des données fictives de 10 coiffeuses avec :
- Noms et localisations
- Spécialités et services
- Tarifs et disponibilités
- Notes et avis

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez les variables CSS dans `styles.css` :

```css
:root {
    --primary-color: #d946ef;
    --secondary-color: #8b5cf6;
    --dark-color: #1f2937;
    /* ... */
}
```

### Ajouter des Coiffeuses

Modifiez le fichier `stylists-data.js` :

```javascript
const stylistsData = [
    {
        id: 1,
        name: "Nom de la coiffeuse",
        rating: 4.9,
        specialties: ["Tresses", "Locks"],
        // ... autres propriétés
    }
];
```

## 🔄 Prochaines Étapes / Améliorations

### Backend & Base de Données

- [ ] Créer une API REST (Node.js/Express, Django, Laravel)
- [ ] Base de données (PostgreSQL, MongoDB)
- [ ] Système d'authentification (JWT)
- [ ] Gestion des utilisateurs et coiffeuses

### Fonctionnalités Avancées

- [ ] Paiement en ligne (Stripe, PayPal)
- [ ] Notifications SMS/Email
- [ ] Chat en temps réel
- [ ] Système d'avis et commentaires
- [ ] Upload de photos (portfolio coiffeuses)
- [ ] Application mobile (React Native, Flutter)
- [ ] Tableau de bord pour coiffeuses
- [ ] Gestion des disponibilités en temps réel
- [ ] Historique des rendez-vous
- [ ] Programmes de fidélité

### Intégrations

- [ ] Google Maps API (carte interactive)
- [ ] API de géocodage (adresses)
- [ ] Calendrier Google/Outlook
- [ ] Paiement mobile (Orange Money, Wave)
- [ ] Réseaux sociaux (partage, connexion)

### Optimisations

- [ ] Progressive Web App (PWA)
- [ ] Service Workers (mode hors ligne)
- [ ] Optimisation SEO
- [ ] Performance et lazy loading
- [ ] Tests unitaires et d'intégration

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout de...'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 👥 Auteurs

Développé avec ❤️ pour faciliter l'accès aux services de coiffure professionnelle.

## 📞 Support

Pour toute question ou suggestion :
- Email : contact@beautyconnect.fr
- Téléphone : +33 1 23 45 67 89

## 🙏 Remerciements

- Font Awesome pour les icônes
- La communauté des développeurs web
- Toutes les coiffeuses professionnelles

---

**BeautyConnect** - La beauté à portée de clic 💇‍♀️✨
