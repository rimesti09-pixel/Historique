import { getData, saveData } from "./storage.js";
import { getPlayers } from "./player.js";

const HISTORY_KEY = "history";
export const getHistory = () => getData(HISTORY_KEY);

export function enregistrerPartie({ playerId, playerScore, computerScore }) {
  const result = playerScore > computerScore ? "victoire" : playerScore < computerScore ? "défaite" : "égalité";
  const game = { id: `g_${Date.now()}`, playerId, date: new Date().toISOString(), playerScore, computerScore, result };
  saveData(HISTORY_KEY, [...getHistory(), game]);
  return game;
}

export function supprimerPartie(id) {
  saveData(HISTORY_KEY, getHistory().filter(game => game.id !== id));
}

export function filtrerHistorique({ search = "", result = "tous", period = "tout" } = {}) {
  const players = getPlayers();
  const names = new Map(players.map(player => [player.id, player.nickname]));
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  return getHistory().map(game => ({ ...game, nickname: names.get(game.playerId) || "Joueur supprimé" }))
    .filter(game => game.nickname.toLowerCase().includes(search.trim().toLowerCase()))
    .filter(game => result === "tous" || game.result === result)
    .filter(game => {
      const date = new Date(game.date);
      if (period === "aujourd-hui") return date >= startToday;
      if (period === "7-jours") return date >= sevenDaysAgo;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const compterPartiesJoueur = id => getHistory().filter(game => game.playerId === id).length;
