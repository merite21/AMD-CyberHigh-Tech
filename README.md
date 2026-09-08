# AMD CyberHigh Tech

Site web vitrine pour AMD CyberHigh Tech — développement web/mobile, cybersécurité, cloud, design graphique et maintenance informatique.

## Structure

```
├── index.html                          Accueil (hero collage, services, process, témoignages)
├── about.html                          À propos (histoire, valeurs, timeline, équipe)
├── services.html                       Services détaillés, formules tarifaires, FAQ
├── portfolio.html                      Études de cas / réalisations avec filtres
├── team.html                           Équipe complète
├── blog.html                           Liste des articles
├── blog-proteger-entreprise.html       Article : cybersécurité
├── blog-site-web.html                  Article : pourquoi créer un site web
├── blog-erreurs-cybersecurite.html     Article : erreurs de cybersécurité
├── blog-nouveautes-developpement.html  Article : nouveautés développement
├── careers.html                        Offres d'emploi + candidature en ligne
├── quote.html                          Demande de devis
├── faq.html                            Questions fréquentes (catégorisées)
├── contact.html                        Formulaire de contact, informations
└── assets/
    ├── css/style.css                   Système de design (thème bleu/navy, mode clair/sombre)
    └── js/main.js                      Interactions (menu mobile, thème, dropdown, scroll reveal, formulaires)
```

## Lancer le site en local

Aucune dépendance ni build requis — c'est un site statique.

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000` dans un navigateur.

## Design

- Thème navy/bleu électrique avec accents cyan, mode clair/sombre (bouton dans la nav, mémorisé en local)
- Typographie : Space Grotesk (titres) + Inter (texte)
- Hero en collage avec badges statistiques flottants, menu "Pages" déroulant, bouton WhatsApp flottant
- Animations au scroll, compteurs animés, menu mobile plein écran, accordéon FAQ, filtres de projets
- Entièrement responsive (mobile, tablette, desktop)

## Phase 2 (non incluse)

Portail client, tableau de bord administrateur, paiements, chat IA, prise de rendez-vous et multilingue nécessitent une infrastructure backend (comptes utilisateurs, base de données) — non couverts par cette phase statique.
