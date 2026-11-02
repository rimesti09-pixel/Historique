export function duel(playerCard, computerCard){
if (playerCard===computerCard){
    return"égalité";
}
if(
    (playerCard==='Empereur'&&computerCard==='Citoyen')||
    (playerCard === 'Citoyen'&& computerCard === 'Esclave') ||
    (playerCard === 'Esclave'&& computerCard ==='Empereur' )
){
    return"victoire";
}
return"défaite";
}