import { getPlayers, ajouterJoueur, modifierJoueur, supprimerJoueur, setActivePlayer, getActivePlayer } from "./player.js";
import { getHistory, enregistrerPartie, supprimerPartie, filtrerHistorique, compterPartiesJoueur } from "./history.js";
import { creerMain, choisirCarteAleatoire, duel, retirerCarte, calculerPoints, obtenirCamp, obtenirPremierJoueur, obtenirGroupe } from "./game.js";
import { renderProfiles as drawProfiles, renderHistory as drawHistory, renderHand, makeButton } from "./ui.js";

const $ = selector => document.querySelector(selector);
const elements = {
  currentPlayer: $("#current-player-display"), noPlayer: $("#game-no-player"), board: $("#game-board"),
  playerScore: $("#player-score"), computerScore: $("#computer-score"), playerName: $("#player-name"),
  manche: $("#manche"), group: $("#group-label"), camp: $("#player-camp"), first: $("#first-player"), duelCount: $("#duel-count"),
  computerCard: $("#computer-card"), computerChoice: $("#computer-choice"), playerCards: $("#player-cards"), result: $("#result"),
  next: $("#next-manche"), restart: $("#restart"), form: $("#profile-form"), nickname: $("#nickname-input"), avatar: $("#avatar-select"),
  playerId: $("#player-id"), formError: $("#form-error"), formTitle: $("#form-title"), save: $("#save-profile-btn"), cancel: $("#cancel-edit"),
  profiles: $("#profiles-list"), profileCount: $("#profile-count"), history: $("#history-list"), historyCount: $("#history-count"),
  historySearch: $("#history-search"), historyResult: $("#history-result"), historyDate: $("#history-date")
};

const cardLabels = { empereur: "Empereur", citoyen: "Citoyen", esclave: "Esclave" };
const cardImages = {
  empereur: "./cards/Empreur.png",
  citoyen: "./cards/Citoyen.png",
  esclave: "./cards/Esclave.png"
};
let manche = 1, scoreJoueur = 0, scoreOrdinateur = 0, mainJoueur = [], mainOrdinateur = [], campJoueur = "empereur", campOrdinateur = "esclave";
let duelNumber = 1, locked = false, roundFinished = false, gameFinished = false;

function switchView(view) {
  document.querySelectorAll(".app-view").forEach(section => { section.hidden = section.id !== `view-${view}`; });
  document.querySelectorAll(".app-tab").forEach(button => button.classList.toggle("active", button.dataset.view === view));
}

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.go)));

function updateActivePlayer() {
  const player = getActivePlayer();
  elements.currentPlayer.textContent = player ? `Joueur : ${player.avatar} ${player.nickname}` : "Aucun joueur sélectionné";
  elements.noPlayer.hidden = Boolean(player);
  elements.board.hidden = !player;
  if (player) elements.playerName.textContent = `${player.avatar} ${player.nickname}`;
}

function clearForm() {
  elements.form.reset(); elements.playerId.value = ""; elements.formTitle.textContent = "Créer un profil";
  elements.save.textContent = "Enregistrer le profil"; elements.cancel.hidden = true; elements.formError.hidden = true;
}

function showFormError(message) { elements.formError.textContent = message; elements.formError.hidden = false; }

function renderProfiles() {
  drawProfiles(elements.profiles, elements.profileCount, getPlayers(), getActivePlayer()?.id, compterPartiesJoueur, {
    choose: player => { setActivePlayer(player); updateActivePlayer(); renderProfiles(); beginGame(); switchView("game"); },
    edit: player => { elements.playerId.value = player.id; elements.nickname.value = player.nickname; elements.avatar.value = player.avatar; elements.formTitle.textContent = "Modifier le profil"; elements.save.textContent = "Enregistrer les modifications"; elements.cancel.hidden = false; elements.formError.hidden = true; elements.nickname.focus(); },
    remove: player => { if (confirm(`Supprimer le profil ${player.nickname} ? Ses parties resteront dans l'historique.`)) { supprimerJoueur(player.id); updateActivePlayer(); renderProfiles(); renderHistory(); } }
  });
}


elements.form.addEventListener("submit", event => {
  event.preventDefault();
  const id = elements.playerId.value;
  const result = id ? modifierJoueur(id, elements.nickname.value, elements.avatar.value) : ajouterJoueur(elements.nickname.value, elements.avatar.value);
  if (result !== true && (!result || typeof result === "string")) { showFormError(typeof result === "string" ? result : "Impossible d'enregistrer ce profil."); return; }
  clearForm(); renderProfiles(); updateActivePlayer();
});
elements.cancel.addEventListener("click", clearForm);

function updateScores() { elements.playerScore.textContent = scoreJoueur; elements.computerScore.textContent = scoreOrdinateur; }
function beginGame() {
  manche = 1; scoreJoueur = 0; scoreOrdinateur = 0; gameFinished = false; locked = false;
  elements.restart.hidden = true; updateScores(); startRound();
}
function startRound() {
  if (manche > 12) { finishGame(); return; }
  campJoueur = obtenirCamp(manche); campOrdinateur = campJoueur === "empereur" ? "esclave" : "empereur";
  mainJoueur = creerMain(campJoueur); mainOrdinateur = creerMain(campOrdinateur);
  duelNumber = 1; locked = false; roundFinished = false;
  elements.manche.textContent = manche; elements.group.textContent = `Groupe ${obtenirGroupe(manche)}/4`;
  elements.camp.textContent = campJoueur === "empereur" ? "👑 Empereur" : "⛓️ Esclave";
  elements.next.hidden = true; elements.restart.hidden = true; elements.computerCard.replaceChildren(); elements.computerCard.textContent = "?"; elements.computerCard.className = "app-playing-card back";
  elements.computerChoice.textContent = "Carte cachée"; elements.result.textContent = "Choisissez une carte pour lancer le duel.";
  renderGameState();
}
function renderGameState() {
  elements.duelCount.textContent = `${duelNumber} / 5`;
  const firstCamp = obtenirPremierJoueur(duelNumber);
  elements.first.textContent = firstCamp === campJoueur ? "Vous" : "Ordinateur";
  renderHand(elements.playerCards, mainJoueur, locked || roundFinished || gameFinished, playCard, cardLabels);
}

function playCard(index) {
  if (locked || roundFinished || gameFinished || !mainJoueur[index]) return;
  locked = true;
  const playerCard = mainJoueur[index];
  const computerCard = choisirCarteAleatoire(mainOrdinateur);
  mainJoueur = retirerCarte(mainJoueur, index);
  const computerIndex = mainOrdinateur.indexOf(computerCard);
  mainOrdinateur = retirerCarte(mainOrdinateur, computerIndex);
  elements.computerCard.className = "app-playing-card revealed";
  elements.computerCard.replaceChildren();
  const computerImage = document.createElement("img");
  computerImage.src = cardImages[computerCard];
  computerImage.alt = cardLabels[computerCard];
  computerImage.className = "app-card-image";
  elements.computerCard.append(computerImage);
  elements.computerChoice.textContent = cardLabels[computerCard];
  elements.result.textContent = `Vous jouez ${cardLabels[playerCard]}…`;
  renderGameState();
  window.setTimeout(() => {
    const outcome = duel(playerCard, computerCard);
    if (outcome === "victoire") {
      const points = calculerPoints(campJoueur); scoreJoueur += points;
      elements.result.textContent = `Victoire ! ${cardLabels[playerCard]} bat ${cardLabels[computerCard]}. +${points} point(s).`;
      endRound();
    } else if (outcome === "défaite") {
      const points = calculerPoints(campOrdinateur); scoreOrdinateur += points;
      elements.result.textContent = `Défaite. ${cardLabels[computerCard]} bat ${cardLabels[playerCard]}. L'ordinateur gagne ${points} point(s).`;
      endRound();
    } else {
      elements.result.textContent = "Égalité ! Les deux cartes sont retirées. Le duel continue.";
      elements.computerCard.replaceChildren(); elements.computerCard.textContent = "?"; elements.computerCard.className = "app-playing-card back";
      elements.computerChoice.textContent = "Carte cachée";
      duelNumber += 1;
      if (!mainJoueur.length || !mainOrdinateur.length) endRound();
      else { locked = false; renderGameState(); }
    }
    updateScores();
  }, 550);
}
function endRound() {
  locked = false; roundFinished = true; elements.playerCards.replaceChildren();
  if (manche < 12) elements.next.hidden = false;
  else finishGame();
}
function finishGame() {
  if (gameFinished) return;
  gameFinished = true; roundFinished = true;
  const player = getActivePlayer();
  if (player) enregistrerPartie({ playerId: player.id, playerScore: scoreJoueur, computerScore: scoreOrdinateur });
  const verdict = scoreJoueur > scoreOrdinateur ? "🏆 Vous remportez la partie !" : scoreJoueur < scoreOrdinateur ? "L'ordinateur remporte la partie." : "Match nul !";
  elements.result.textContent = `${verdict} Score final : ${scoreJoueur} – ${scoreOrdinateur}.`;
  elements.next.hidden = true; elements.restart.hidden = false; elements.playerCards.replaceChildren();
  renderHistory(); renderProfiles();
}
elements.next.addEventListener("click", () => { if (roundFinished && !gameFinished) { manche += 1; startRound(); } });
elements.restart.addEventListener("click", beginGame);

function renderHistory() {
  const games = filtrerHistorique({ search: elements.historySearch.value, result: elements.historyResult.value, period: elements.historyDate.value });
  drawHistory(elements.history, elements.historyCount, games, {
    remove: game => { if (confirm("Supprimer cette partie de l'historique ?")) { supprimerPartie(game.id); renderHistory(); renderProfiles(); } }
  });
}

[elements.historySearch, elements.historyResult, elements.historyDate].forEach(control => control.addEventListener("input", renderHistory));

updateActivePlayer(); renderProfiles(); renderHistory();
if (getActivePlayer()) beginGame();
