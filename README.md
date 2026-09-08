# AMD CyberHigh Tech

Site web vitrine pour AMD CyberHigh Tech — cybersécurité, cloud, développement sur mesure, formation (CyberHigh Academy) et managed IT services.

## Structure

```
├── index.html          Accueil
├── about.html          À propos (histoire, valeurs, équipe, timeline)
├── services.html       Services détaillés, formules tarifaires, FAQ
├── portfolio.html       Études de cas / réalisations avec filtres
├── contact.html         Formulaire de contact, informations, FAQ
└── assets/
    ├── css/style.css    Système de design (thème bleu/navy, animations)
    └── js/main.js       Interactions (menu mobile, scroll reveal, compteurs, accordéon, formulaires)
```

## Lancer le site en local

Aucune dépendance ni build requis — c'est un site statique.

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000` dans un navigateur.

## Design

- Thème sombre navy/bleu électrique avec accents cyan
- Typographie : Space Grotesk (titres) + Inter (texte)
- Animations au scroll, compteurs animés, menu mobile plein écran, accordéon FAQ, filtres de projets
- Entièrement responsive (mobile, tablette, desktop)
