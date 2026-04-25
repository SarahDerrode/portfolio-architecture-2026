# Portfolio — Sarah Derrode

Site web statique reproduisant le portfolio d'architecture (L2, ENSA Lyon).

## Contenu du dossier 

```
.
├── index.html                    Page unique du site
├── style.css                     Feuille de style (typographie serif, palette sobre)
├── script.js                     Lightbox + navigation
├── favicon.svg                   Favicon « S. »
├── Portfolio_Sarah_Derrode.pdf   PDF complet à télécharger (~107 Mo)
├── images/
│   ├── cover.jpg                 Couverture en haute résolution
│   ├── pages/                    22 pages du PDF en 1600 px (pour la lightbox)
│   └── thumbs/                   Vignettes 600 px (pour la grille)
└── README.md
```

Le site tient dans un seul fichier HTML ; aucune dépendance de build, aucun framework.

---

## Tester en local

Ouvrir `index.html` directement dans un navigateur ne suffit **pas** (certains navigateurs bloquent le chargement des polices Google en `file://`). Il faut lancer un petit serveur local :

```bash
# Depuis le dossier du site
python3 -m http.server 8080
# Puis ouvrir http://localhost:8080 dans le navigateur
```

---

## Déployer sur GitHub Pages (recommandé — gratuit, permanent)

### Étape 1 — Créer un compte GitHub

Aller sur [github.com](https://github.com) et créer un compte si ce n'est pas déjà fait. Idéalement choisir un nom d'utilisateur court et propre (ex. `sarahderrode`, `sderrode`, etc.), car il apparaîtra dans l'URL publique du site.

### Étape 2 — Créer le dépôt

- Cliquer sur le `+` en haut à droite, puis « New repository ».
- Nom du dépôt : `portfolio` (ou `portfolio-sarah`, au choix).
- Laisser « Public ». **Important** : sur un compte GitHub gratuit, GitHub Pages ne fonctionne qu'avec des dépôts publics. Le contenu étant déjà destiné à être public, ce n'est pas un souci.
- Ne pas cocher « Add a README file » (on en a déjà un).
- Cliquer « Create repository ».

### Étape 3 — Pousser les fichiers

Deux options.

**Option A — Glisser-déposer (la plus simple, sans ligne de commande).**

Sur la page du dépôt fraîchement créé :
1. Cliquer sur « uploading an existing file » (ou « Add file → Upload files »).
2. Ouvrir le dossier du site dans votre explorateur de fichiers.
3. Sélectionner **tout le contenu** (Ctrl+A sous Windows, Cmd+A sous macOS) et le glisser sur la zone de dépôt du navigateur.
4. Attendre la fin du transfert — le PDF de 107 Mo prend quelques minutes selon la connexion.
5. **Important** : GitHub refuse par défaut les fichiers > 100 Mo. Voir la section « Limite des 100 Mo » plus bas si c'est bloquant.
6. Saisir un message de commit (ex. « Initial portfolio site ») et cliquer « Commit changes ».

**Option B — Avec Git en ligne de commande.**

```bash
cd chemin/vers/le/dossier/du/site
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<votre-username>/portfolio.git
git push -u origin main
```

### Étape 4 — Activer GitHub Pages

Sur la page du dépôt :
1. Onglet **Settings** (en haut à droite).
2. Menu gauche : **Pages**.
3. Sous « Build and deployment » :
   - **Source** : « Deploy from a branch »
   - **Branch** : `main`, dossier `/ (root)`
   - Cliquer **Save**.
4. Attendre 1 à 2 minutes. Recharger la page : l'URL du site apparaît en haut (format `https://<votre-username>.github.io/portfolio/`).

Le site est en ligne.

### Étape 5 (optionnel) — Nom de domaine personnalisé

Si Sarah veut `sarahderrode.fr` plutôt que `sderrode.github.io/portfolio` :

1. Acheter le domaine chez un registrar (OVH, Gandi, Infomaniak, Namecheap — compter 10 à 15 € par an pour un `.fr`).
2. Dans le panneau DNS du registrar, créer deux enregistrements pointant vers GitHub :
   - Quatre `A records` vers : `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Un `CNAME` pour `www` vers `<votre-username>.github.io`
3. Sur GitHub, Settings → Pages → Custom domain → saisir `sarahderrode.fr`, cocher « Enforce HTTPS » (disponible après quelques minutes de propagation DNS).

---

## Limite des 100 Mo sur GitHub

Le PDF du portfolio fait ~107 Mo et GitHub refuse les fichiers > 100 Mo dans un push normal. Trois solutions, par ordre de simplicité :

### Solution 1 — Héberger le PDF sur Google Drive (recommandé)

C'est la solution la plus simple et la plus propre, et c'est d'ailleurs celle que nous utiliserons pour les mails aux cabinets.

1. Uploader `Portfolio_Sarah_Derrode.pdf` sur Google Drive.
2. Clic droit → « Partager » → « Tous ceux qui ont le lien » → Lecteur.
3. Copier le lien.
4. **Avant** de pousser sur GitHub :
   - Supprimer le fichier `Portfolio_Sarah_Derrode.pdf` du dossier local.
   - Dans `index.html`, remplacer les deux occurrences de `href="Portfolio_Sarah_Derrode.pdf"` par le lien Drive. Ajouter `target="_blank" rel="noopener"` à la place de `download` pour ouvrir le lien dans un nouvel onglet.

Exemple (à faire aux 2 endroits dans `index.html`) :

```html
<!-- Avant -->
<a class="btn-download" href="Portfolio_Sarah_Derrode.pdf" download>

<!-- Après -->
<a class="btn-download" href="https://drive.google.com/file/d/XXXXXXXXXXXXXXX/view" target="_blank" rel="noopener">
```

Astuce : pour **forcer le téléchargement** plutôt que l'ouverture dans le viewer Drive, utiliser l'URL de la forme `https://drive.google.com/uc?export=download&id=XXXXXXXXXXXXXXX` (remplacer `XXX` par l'ID du fichier extrait de l'URL de partage).

### Solution 2 — Git LFS

GitHub supporte « Git Large File Storage » pour les gros fichiers, mais la bande passante gratuite est limitée à 1 Go/mois. Pour un portfolio de 107 Mo, ça peut rapidement poser problème en cas de fort trafic. Non recommandé.

### Solution 3 — Compresser le PDF

Ouvrir le PDF dans un outil de compression (Smallpdf, iLovePDF, ou Ghostscript en ligne de commande). Viser < 100 Mo. Attention à la perte de qualité d'image — vérifier que les pages restent lisibles.

En ligne de commande :
```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=Portfolio_compressed.pdf Portfolio_Sarah_Derrode.pdf
```

---

## Alternatives d'hébergement

- **Netlify** : `app.netlify.com` → glisser-déposer le dossier directement, URL immédiate type `xyz-abc.netlify.app`. Permet des fichiers jusqu'à 100 Mo. Aussi simple que GitHub Pages, voire plus.
- **Cloudflare Pages** : équivalent, excellent CDN mondial.
- **Vercel** : équivalent, principalement orienté sites JS modernes mais fonctionne très bien pour du HTML statique.

Tous les trois sont gratuits pour un usage personnel.

---

## Modifier le site plus tard

Le contenu éditorial est centralisé dans `index.html`. Chaque projet est dans un bloc `<article class="project">` facile à dupliquer. Pour ajouter un projet :

1. Extraire les pages en JPEG (ou demander à Sarah de fournir les images).
2. Les déposer dans `images/pages/` (version 1600 px) et `images/thumbs/` (version 600 px).
3. Dupliquer un bloc `<article class="project">` dans `index.html` et adapter le titre, la date, la question de projet et les chemins d'images.
4. Commit + push → le site se met à jour automatiquement en ~1 minute sur GitHub Pages.

Pour mettre à jour le PDF : remplacer le fichier et pousser le nouveau (ou mettre à jour le lien Drive si on a choisi la solution 1).

---

## Typographies

Le site utilise deux polices Google Fonts chargées en ligne :
- **Cormorant Garamond** — titres, hero, citations (serif classique proche du Garamond)
- **Libre Caslon Text** — corps de texte (serif éditorial chaud)

Elles reproduisent fidèlement l'ambiance typographique du PDF. Aucun fichier de police à héberger soi-même.

---

## Accessibilité

- Structure HTML sémantique (nav, header, section, article, footer).
- Attributs `alt` descriptifs sur toutes les images.
- Navigation clavier complète (y compris la lightbox : flèches ← →, Échap).
- `prefers-reduced-motion` respecté (désactive les animations pour les utilisateurs concernés).
- Contrastes texte/fond au-dessus des seuils WCAG AA.

---

## Crédits

- Portfolio et tous les dessins, photos, maquettes : © Sarah Derrode.
- Conception et code du site : avril 2026.
