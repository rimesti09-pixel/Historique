import { getData, saveData, removeData } from "./storage.js";

const PLAYERS_KEY = "players";
const ACTIVE_PLAYER_KEY = "activePlayer";
const pseudoRegex = /^[A-Za-z0-9]{3,15}$/;
const AVATARS = ["👤", "👑", "🗡️", "⛓️", "🐉"];

export const getPlayers = () => getData(PLAYERS_KEY);

export function ajouterJoueur(nickname, avatar) {
  const name = nickname.trim();
  if (!pseudoRegex.test(name)) return "Le pseudo doit contenir 3 à 15 lettres ou chiffres, sans espace.";
  if (!AVATARS.includes(avatar)) return "Veuillez choisir un avatar valide.";
  const players = getPlayers();
  if (players.some(player => player.nickname.toLowerCase() === name.toLowerCase())) return "Ce pseudo existe déjà.";
  const player = { id: `p_${Date.now()}`, nickname: name, avatar, createdAt: new Date().toISOString().slice(0, 10) };
  saveData(PLAYERS_KEY, [...players, player]);
  return player;
}

export function modifierJoueur(id, nickname, avatar) {
  const name = nickname.trim();
  if (!pseudoRegex.test(name)) return "Le pseudo doit contenir 3 à 15 lettres ou chiffres, sans espace.";
  if (!AVATARS.includes(avatar)) return "Veuillez choisir un avatar valide.";
  const players = getPlayers();
  if (!players.some(player => player.id === id)) return "Ce profil n'existe plus.";
  if (players.some(player => player.id !== id && player.nickname.toLowerCase() === name.toLowerCase())) return "Ce pseudo existe déjà.";
  const updated = players.map(player => player.id === id ? { ...player, nickname: name, avatar } : player);
  saveData(PLAYERS_KEY, updated);
  const active = getActivePlayer();
  if (active?.id === id) setActivePlayer(updated.find(player => player.id === id));
  return true;
}

export function supprimerJoueur(id) {
  saveData(PLAYERS_KEY, getPlayers().filter(player => player.id !== id));
  if (getActivePlayer()?.id === id) removeData(ACTIVE_PLAYER_KEY);
}

export const setActivePlayer = player => saveData(ACTIVE_PLAYER_KEY, player);
export const getActivePlayer = () => getData(ACTIVE_PLAYER_KEY, null);
