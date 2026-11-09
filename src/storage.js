// Les noms historiques des clés sont conservés pour ne pas perdre les données
// déjà enregistrées par la première version du projet.
export function getData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export function removeData(key) {
  localStorage.removeItem(key);
}
