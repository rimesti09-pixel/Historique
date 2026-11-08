import { getCurrentPlayer } from "./storage.js";

export function renderCurrentPlayer() {

    const displayElement = document.getElementById(
        'current-player-display'
    );
    if(!displayElement) return;

    const currentPlayer = getCurrentPlayer();
    if (currentPlayer) {
        displayElement.textContent = `${currentPlayer.avatar} ${currentPlayer.nickname}`;

        displayElement.className ="text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-medium";

    }else{
        displayElement.textContent = "Aucun joueur sélectionné";

        displayElement.className = "text-sm bg-slate-700 px-3 py-1 rounded-full text-slate-300";
    
    }
}
export function renderProfilesList(
    profiles,
    currentPlayerId,
    onSelect,
    onEdit,
    onDelete
   ){
    const listContainer=document.getElementById('profiles-list')

    if (!listContainer) return;

    if(profiles.length===0){
        listContainer.innerHTML=` <p class="text-xs text-slate-400 text-center py-2">  Aucun profil pour le moment.</p> `;
        return
    }

   listContainer.innerHTML=profiles.map(player=>{

    const isSelected= player.id === currentPlayerId;

    return`
    <div class="flex items-center justify-between bg-slate-900 border ${isSelected ? 'border-amber-500': 'border-slate-700'}p-2.5 rounded-lg text-xs">

       <div class ="flex items-center gap-2">

       <span class="text-base">${player.avatar}</span>

       <div>
         <div class="font-bold text-white">${player.nickname}</div>
         <div class="text-[10px] text-slate-400">Parties :${player.gamesPlayed || 0}</div>
     </div>   
   </div>    
       <div class ="flex items-center gap-1">
       <button data-action = "select" data-id ="${player.id}" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded transition cursor-pointer font-medium">
           ${isSelected? 'Actif': 'Choisir'}
       </button>
     <button data-action="edit" data-id="${player.id}" class="text-slate-400 hover:text-white px-1.5 py-1 cursor-pointer" title="Modifier">✏️</button>
     <button data-action="delete" data-id="${player.id}" class="text-red-400 hover:text-red-300 px-1.5 py-1 cursor-pointer" title="Supprimer">🗑️</button>
    </div>
</div>
    `;
}).join('');
   
   listContainer.querySelectorAll('button').forEach(button => {
const action =button.dataset.action;
const id = button . dataset.id;

if(action === 'select'){
    button.onclick =()=> onSelect(id);
}
if(action === 'edit'){
    button.onclick =()=> onEdit(id);
}
if(action=== 'delete'){
    button.onclick = ()=>onDelete(id);
   }
   });
}
