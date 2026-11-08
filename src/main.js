import { renderCurrentPlayer } from "./ui";

document.addEventListener('DOMContentLoaded', () =>{
    renderCurrentPlayer();
});
import { getCurrentPlayer,
    getProfiles,
    saveCurrenPlayer,
     saveProfiles } from "./storage.js";
import {createPlayer, updatedPlayer}from"./players.js";
import { renderCurrentPlayer,
    renderProfilesList } from "./ui.js";


document.addEventListener('DOMContentLoaded', ()=>{
    renderCurrentPlayer();
     
    const modal =document.getElementById('profiles-modal');
    const openBtn = document.getElementById('open-profiles-btn');
    const closeBtn = document.getElementById('close-profiles-btn');

    const profilForm=document.getElementById('profile-form');
    const nicknameInput=document.getElementById('nickname-input');
    const avatarSelect= document.getElementById('avatar-select');
    const formError=document.getElementById('form-error');

    const playerIdInput = document.getElementById('player-id');

    renderCurrentPlayer();

    function refreshProfiles(){
        
        const profiles = getProfiles();
        const currentPlayer=getCurrentPlayer();
        renderProfilesList(
            profiles,
            currentPlayer? currentPlayer.id : null,

            (id)=>{
                
                const selected= profiles.find(p=>p.id ===id);
                if (selected){
                    saveCurrenPlayer(selected);
                    renderCurrentPlayer();
                    refreshProfiles();
                
                }
            },

            (id)=>{
                const player = profiles.find(p => p.id ===id);
                if (player) {
                    nicknameInput.value = player.nickname;
                    avatarSelect.value = player.avatar;
                    playerIdInput.value = player.id

                    saveBtn.textContent="Modifier le profil";
                    
                }
            },

            (id)=>{
                if(!confirm("Voulez-vous vraiment supprimer ce profil ?")){
                    return;
                }

                    saveProfiles(updatedProfiles);

                    const currentPlayer=getCurrentPlayer();

                    if(currentPlayer&&currentPlayer.id===id){
                        saveCurrenPlayer(null);
                    }
                        renderCurrentPlayer();
                
                    refreshProfiles();
                
            }

        );
  
    }
        openBtn.onclick=()=>{
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        refreshProfiles();
        };
    

    closeBtn.onclick = () =>{
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    };
 
 profilForm.add("sumbit",(e)=>{
    e.preventDefault();
    const nickname=nicknameInput.value.trim();
    const avatar = avatarSelect.value;
    const playerId = playerIdInput.value;

    formError.classList.add("hidden");

    try{
        if(playerId){
            updatedPlayer(playerId,nickname,avatar);
        }else{
            createPlayer(nickname,avatar);
        }
        
        profilForm.reset();
        playerIdInput.value = "";
        saveBtn.textContent="Enregistrer le Profil";
    
        refreshProfiles();
    }catch(error){
        formError.textContent = error.message;
        formError.classList.remove("hidden");
    }
 });
});