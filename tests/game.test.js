import test from "node:test";
import assert from "node:assert/strict";
import { creerMain, duel, retirerCarte, calculerPoints, obtenirCamp, obtenirPremierJoueur } from "../src/game.js";

test("duel applique les trois relations de victoire", () => {
  assert.equal(duel("empereur", "citoyen"), "victoire");
  assert.equal(duel("citoyen", "esclave"), "victoire");
  assert.equal(duel("esclave", "empereur"), "victoire");
});
test("deux citoyens font égalité et le résultat est relatif au joueur", () => {
  assert.equal(duel("citoyen", "citoyen"), "égalité");
  assert.equal(duel("citoyen", "empereur"), "défaite");
});
test("les deux mains contiennent quatre citoyens et leur carte spéciale", () => {
  assert.deepEqual(creerMain("empereur"), ["empereur", "citoyen", "citoyen", "citoyen", "citoyen"]);
  assert.deepEqual(creerMain("esclave"), ["esclave", "citoyen", "citoyen", "citoyen", "citoyen"]);
});
test("retirerCarte copie la main sans modifier l'original", () => {
  const hand = ["empereur", "citoyen", "citoyen"];
  assert.deepEqual(retirerCarte(hand, 1), ["empereur", "citoyen"]);
  assert.equal(hand.length, 3);
});
test("les points et les camps changent tous les trois tours", () => {
  assert.equal(calculerPoints("empereur"), 1);
  assert.equal(calculerPoints("esclave"), 5);
  assert.deepEqual([1, 3, 4, 6, 7, 9, 10, 12].map(obtenirCamp), ["empereur", "empereur", "esclave", "esclave", "empereur", "empereur", "esclave", "esclave"]);
});
test("le camp qui commence alterne à chaque duel", () => {
  assert.equal(obtenirPremierJoueur(1), "empereur");
  assert.equal(obtenirPremierJoueur(2), "esclave");
  assert.equal(obtenirPremierJoueur(3), "empereur");
});
