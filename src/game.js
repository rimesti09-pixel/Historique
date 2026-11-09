export const creerMain = camp => camp === "empereur"
  ? ["empereur", "citoyen", "citoyen", "citoyen", "citoyen"]
  : camp === "esclave" ? ["esclave", "citoyen", "citoyen", "citoyen", "citoyen"] : [];

export const choisirCarteAleatoire = main => main.length ? main[Math.floor(Math.random() * main.length)] : null;

export function duel(carteJoueur, carteOrdinateur) {
  if (carteJoueur === carteOrdinateur) return "égalité";
  if ((carteJoueur === "empereur" && carteOrdinateur === "citoyen") ||
      (carteJoueur === "citoyen" && carteOrdinateur === "esclave") ||
      (carteJoueur === "esclave" && carteOrdinateur === "empereur")) return "victoire";
  return "défaite";
}

export const retirerCarte = (main, index) => main.filter((_, cardIndex) => cardIndex !== index);
export const calculerPoints = camp => camp === "empereur" ? 1 : camp === "esclave" ? 5 : 0;
export const obtenirCamp = manche => Math.floor((manche - 1) / 3) % 2 === 0 ? "empereur" : "esclave";
export const obtenirPremierJoueur = numeroDuel => numeroDuel % 2 === 1 ? "empereur" : "esclave";
export const obtenirGroupe = manche => Math.ceil(manche / 3);
