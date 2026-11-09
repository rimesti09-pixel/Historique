import { getProfiles, saveProfiles } from "./storage.js";

export function validateNickname(nickname, playerId = null) {
  const regex = /^[A-Za-z0-9]{3,15}$/;

  if (!regex.test(nickname)) {
    return "Le pseudo doit contenir entre 3 et 15 caractères alphanumériques.";
  }

  const profiles = getProfiles();

  const exists = profiles.some(player =>
    player.nickname.toLowerCase() === nickname.toLowerCase() &&
    player.id !== playerId
  );

  if (exists) {
    return "Ce pseudo existe déjà.";
  }

  return null;
}

export function createPlayer(nickname, avatar) {
  const error = validateNickname(nickname);

  if (error) return { error };

  const profiles = getProfiles();

  const player = {
    id: "p_" + Date.now(),
    nickname,
    avatar,
    createdAt: new Date().toISOString(),
    gamesPlayed: 0
  };

  profiles.push(player);
  saveProfiles(profiles);

  return { player };
}

export function updatedPlayer(id, nickname, avatar) {
  const error = validateNickname(nickname, id);

  if (error) return { error };

  const profiles = getProfiles();

  const index = profiles.findIndex(player => player.id === id);

  if (index === -1) return { error: "Profil introuvable." };

  profiles[index] = {
    ...profiles[index],
    nickname,
    avatar
  };

  saveProfiles(profiles);

  return { player: profiles[index] };
}

export function deletePlayer(id) {
  const profiles = getProfiles().filter(player => player.id !== id);
  saveProfiles(profiles);
}