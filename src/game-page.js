import {creerMain,choisirCarteAleatoire,duel,retirerCarte,calculerPoints,obtenirCamp} from "./game.js";

const playerName = document.getElementById("player-name");
const playerCards = document.getElementById("player-cards");

const computerImage = document.getElementById("computer-image");
const computerChoice = document.getElementById("computer-choice");

const result = document.getElementById("result");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");

const mancheElement = document.getElementById("manche");
const campsElement = document.getElementById("camps");

const nextButton = document.getElementById("next-manche");
const restartButton = document.getElementById("restart");

const images = {citoyen: "./assets/images/citoyen.png",empereur: "./assets/images/empereur.png",esclave: "./assets/images/esclave.png"};

const activePlayer = JSON.parse(
    localStorage.getItem("activePlayer")
);

if (!activePlayer) {
    alert("Veuillez choisir un profil avant de jouer !");
    window.location.href = "./index.html";
}
else {
    playerName.textContent =
        `${activePlayer.avatar} ${activePlayer.nickname}`;
}

let manche = 1;
let scoreJoueur = 0;
let scoreOrdinateur = 0;

let mainJoueur = [];
let mainOrdinateur = [];

let campJoueur;
let campOrdinateur;

function afficherScores() {
    playerScoreElement.textContent = scoreJoueur;
    computerScoreElement.textContent = scoreOrdinateur;
}

function commencerManche() {
    if (manche > 12) {
        terminerPartie();
        return;
    }

    campJoueur = obtenirCamp(manche);

    campOrdinateur = campJoueur === "empereur"
        ? "esclave"
        : "empereur";

    mainJoueur = creerMain(campJoueur);
    mainOrdinateur = creerMain(campOrdinateur);

    mancheElement.textContent = manche;

    campsElement.textContent =
        `Ton camp : ${campJoueur} | Camp ordinateur : ${campOrdinateur}`;

    computerChoice.textContent = "En attente...";
    computerImage.src = images.citoyen;

    result.textContent = "Choisis une carte !";

    nextButton.classList.add("hidden");
    afficherCartes();
}

function afficherCartes() {
    playerCards.innerHTML = "";

    mainJoueur.forEach((carte, index) => {
        const button = document.createElement("button");

        button.className =
            "bg-slate-700 p-2 rounded-xl hover:bg-amber-700 transition";

        const img = document.createElement("img");

        img.src = images[carte];
        img.alt = carte;
        img.className = "w-full h-36 object-cover rounded-lg";

        const name = document.createElement("p");
        name.textContent = carte;
        name.className = "mt-2 font-bold capitalize";

        button.append(img, name);

        button.addEventListener("click", () => {
            jouer(index);
        });

        playerCards.appendChild(button);
    });
}

function jouer(index) {
    if (manche > 12 || !mainJoueur[index]) return;

    const carteJoueur = mainJoueur[index];
    const carteOrdinateur = choisirCarteAleatoire(mainOrdinateur);

    const resultat = duel(carteJoueur, carteOrdinateur);

    computerImage.src = images[carteOrdinateur];
    computerChoice.textContent = carteOrdinateur;

    mainJoueur = retirerCarte(mainJoueur, carteJoueur);
    mainOrdinateur = retirerCarte(mainOrdinateur, carteOrdinateur);

    if (resultat === "victoire") {
        scoreJoueur += calculerPoints(campJoueur);

        result.textContent =
            `Bravo ! Tu as gagné ce duel. +${calculerPoints(campJoueur)} points`;

        finManche();

    } else if (resultat === "défaite") {
        scoreOrdinateur += calculerPoints(campOrdinateur);

        result.textContent =
            `L'ordinateur a gagné. +${calculerPoints(campOrdinateur)} points`;

        finManche();

    } else {
        result.textContent =
            "Égalité ! Les deux cartes sont retirées. Choisis une autre carte.";

        if (mainJoueur.length === 0) {
            result.textContent =
                "Égalité ! Toutes les cartes sont épuisées.";

            finManche();
        } else {
            afficherCartes();
        }
    }

    afficherScores();
}

function finManche() {
    playerCards.innerHTML = "";

    manche++;

    if (manche <= 12) {
        nextButton.classList.remove("hidden");
    } else {
        terminerPartie();
    }
}

function terminerPartie() {
    playerCards.innerHTML = "";
    nextButton.classList.add("hidden");

    if (scoreJoueur > scoreOrdinateur) {
        result.textContent =
            `🏆 Tu as gagné la partie ! Score : ${scoreJoueur} - ${scoreOrdinateur}`;
    } else if (scoreJoueur < scoreOrdinateur) {
        result.textContent =
            `L'ordinateur a gagné ! Score : ${scoreJoueur} - ${scoreOrdinateur}`;
    } else {
        result.textContent =
            `Match nul ! Score : ${scoreJoueur} - ${scoreOrdinateur}`;
    }

    restartButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
    commencerManche();
});

restartButton.addEventListener("click", () => {
    manche = 1;
    scoreJoueur = 0;
    scoreOrdinateur = 0;

    afficherScores();

    restartButton.classList.add("hidden");

    commencerManche();
});

afficherScores();
commencerManche();