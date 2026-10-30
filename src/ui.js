import { getCurrentPlayer } from "./storage";

export function renderCurrentPlayer() {
    const displayElement = document.getElementById('current-player-display');
    if(!displayElement) return;

    const currentPlayer = getCurrentPlayer();
    if (currentPlayer) {
        displayElement.textContent ='${currentPlayer.avatar} ${currentPlayer.nickname}';
        displayElement.className = "text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-medium";

    }else{
        displayElement.textContent = "Aucun joueur sélectionné";
        displayElement.className = "text-sm bg-slate-700 px-3 py-1 rounded-full text-slate-300";
    
    }
}