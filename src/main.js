

import { getCurrentPlayer, getProfiles,  saveCurrenPlayer, saveProfiles } from "./storage.js";
import {createPlayer, updatedPlayer}from"./players.js";
import { renderCurrentPlayer,renderProfilesList } from "./ui.js";


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
    const saveBtn=document.getElementById('save-profile-btn');

function resetForm (){
    profilForm.reset();
    playerIdInput.value="";
    saveBtn.textContent="Enregistrer le profil";
    formError.textContent="";
    formError.classList.add("hidden")

}
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
                    playerIdInput.value = player.id;
                    saveBtn.textContent="Modifier le profil";
                    formError.textContent="";
                    formError.classList.add("hidden");
                    
                }
            },

            (id)=>{
                if(!confirm("Voulez-vous vraiment supprimer ce profil ?")){
                    return;
                }
                    const updatedProfiles= getCurrentPlayer().filter((player)=>player.id !== id);
                    saveProfiles(updatedProfiles);

                    const currentPlayer=getCurrentPlayer();
                    if (currentPlayer && currentPlayer.id===id) {
                        saveCurrenPlayer(null);
                    }
                    if (playerIdInput.value === id){
                        resetForm();
                    }
                        renderCurrentPlayer();
                        refreshProfiles();
                
            }

        );
  
    }
        openBtn.addEventListener("click",()=> {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        refreshProfiles();
        });
    

    closeBtn.addEventListener("click",() =>{
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });
 
 profilForm.addEventListener("sumbit",(event)=>{
    event.preventDefault();

    const nickname=nicknameInput.value.trim();
    const avatar = avatarSelect.value;
    const playerId = playerIdInput.value;

    formError.textContent="";
    formError.classList.add("hidden");

    try{
        if(playerId){
            updatedPlayer(playerId,nickname,avatar);
        const currentPlayer=getCurrentPlayer();
        if(currentPlayer&&getProfiles.id === playerId){

        const updatedCurrentPlayer=getProfiles().find((player)=>player.id===playerId);
        if(updatedCurrentPlayer){
            saveCurrenPlayer(updatedCurrentPlayer);
        }
    }
}else{
            createPlayer(nickname,avatar);
        }
        
        resetForm();
        renderCurrentPlayer();
        refreshProfiles();
    }catch(error){
        formError.textContent = error.message;
        formError.classList.remove("hidden");
    }
 });

    renderCurrentPlayer();
});