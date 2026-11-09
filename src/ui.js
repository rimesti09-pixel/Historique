export const $ = selector => document.querySelector(selector);

export function makeButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  if (onClick) button.addEventListener("click", onClick);
  return button;
}

export function renderProfiles(container, countElement, players, activeId, countGames, actions) {
  countElement.textContent = players.length;
  container.replaceChildren();
  if (!players.length) {
    const empty = document.createElement("p"); empty.className = "app-empty";
    empty.textContent = "Aucun profil créé pour le moment."; container.append(empty); return;
  }
  players.forEach(player => {
    const row = document.createElement("div"); row.className = "app-player-row";
    const identity = document.createElement("div"); identity.className = "app-player-identity";
    const avatar = document.createElement("span"); avatar.className = "app-avatar"; avatar.textContent = player.avatar;
    const details = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = player.nickname;
    const count = document.createElement("small"); count.textContent = `${countGames(player.id)} partie(s)`;
    details.append(name, count); identity.append(avatar, details);
    const buttons = document.createElement("div"); buttons.className = "app-actions";
    const choose = makeButton(activeId === player.id ? "Sélectionné" : "Choisir", "app-small-button", () => actions.choose(player));
    choose.disabled = activeId === player.id;
    const edit = makeButton("Modifier", "app-small-button secondary", () => actions.edit(player));
    const remove = makeButton("Supprimer", "app-small-button danger", () => actions.remove(player));
    buttons.append(choose, edit, remove); row.append(identity, buttons); container.append(row);
  });
}

export function renderHistory(container, countElement, games, actions) {
  countElement.textContent = games.length; container.replaceChildren();
  if (!games.length) {
    const empty = document.createElement("p"); empty.className = "app-empty";
    empty.textContent = "Aucune partie ne correspond à votre recherche."; container.append(empty); return;
  }
  games.forEach(game => {
    const row = document.createElement("div"); row.className = "app-history-row";
    const info = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = game.nickname;
    const date = document.createElement("small"); date.textContent = new Date(game.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    info.append(name, date);
    const score = document.createElement("strong"); score.className = "app-history-score"; score.textContent = `${game.playerScore} – ${game.computerScore}`;
    const status = document.createElement("span"); status.className = `app-result-tag ${game.result}`; status.textContent = game.result;
    const remove = makeButton("Supprimer", "app-small-button danger", () => actions.remove(game));
    row.append(info, score, status, remove); container.append(row);
  });
}

export function renderHand(container, cards, disabled, onPlay, labels) {
  const images = {
    empereur: "./cards/Empreur.png",
    citoyen: "./cards/Citoyen.png",
    esclave: "./cards/Esclave.png"
  };

  container.replaceChildren();

  cards.forEach((card, index) => {
    const button = makeButton("", "app-playing-card app-card-button", () => onPlay(index));
    const image = document.createElement("img");

    image.src = images[card];
    image.alt = labels[card];
    image.className = "app-card-image";

    button.append(image);
    button.disabled = disabled;
    container.append(button);
  });
}
