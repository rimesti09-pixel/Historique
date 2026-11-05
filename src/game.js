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
export function gestInitialHand(camp){
    if(camp ==='Emperur'){
          return[ 'Empereur','Citoyen','Citoyen','Citoyen','Citoyen',];
    }else {
         return[ 'Esclave','Citoyen','Citoyen','Citoyen','Citoyen',];
    }
}
export function getCampForRound(roundNumber){
    if(roundNumber<=3)return 'Empereur';
    if (roundNumber<=6)return'Esclave';
    if(roundNumber<=9)return'Empereur';
    return 'Esclave';
}
export function getPointsForWin(camp){
    return camp === 'Empereur'? 1:5;
}
export function removeCardsAfterDuel(playerHand,computerHand,playerCardIndex,computerCardIndex){
const newPlayerHand = [...playerHand];
const newComputerHand =[...computerHand];
newPlayerHand.splice(playerCardIndex,1)
newComputerHand.splice(computerCardIndex,1)

return{
    playerHand: newPlayerHand,
    computerHand: newComputerHand
};
}