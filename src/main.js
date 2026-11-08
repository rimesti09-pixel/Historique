import { getCurrentPlayer, getProfiles,  saveCurrentPlayer, saveProfiles } from "./storage.js";
import {createPlayer, updatedPlayer}from"./players.js";
import { renderCurrentPlayer,renderProfilesList } from "./ui.js";


document.addEventListener('DOMContentLoaded', ()=>{
     
    const modal =document.getElementById('profiles-modal');
    const openBtn = document.getElementById('open-profiles-btn');
    const closeBtn = document.getElementById('close-profiles-btn');
    const profileForm=document.getElementById('profile-form');
    const nicknameInput=document.getElementById('nickname-input');
    const avatarSelect= document.getElementById('avatar-select');
    const formError=document.getElementById('form-error');
    const playerIdInput = document.getElementById('player-id');
    const saveBtn=document.getElementById('save-profile-btn');

function resetForm (){
    profileForm.reset();
    playerIdInput.value="";
    saveBtn.textContent="Enregistrer le profil";
    formError.textContent="";
    formError.classList.add("hidden");

}
    function refreshProfiles(){
        
        const profiles = getProfiles();
        const currentPlayer=getCurrentPlayer();
        renderProfilesList(
            profiles,
            currentPlayer? currentPlayer.id : null,

            (id)=>{
                
                const selectedPlayer= profiles.find(p=>p.id ===id);
                if (selectedPlayer){
                    saveCurrentPlayer(selectedPlayer);
                    renderCurrentPlayer();
                    refreshProfiles();
                
                }
            },

            (id)=>{
                const selectedPlayer= profiles.find(player => player.id ===id);
                if (selectedPlayer) {
                    nicknameInput.value = selectedPlayer.nickname;
                    avatarSelect.value = selectedPlayer.avatar;
                    playerIdInput.value = selectedPlayer.id;

                    saveBtn.textContent="Modifier le profil";
                    formError.textContent="";
                    formError.classList.add("hidden");
                    
                }
            },

            (id)=>{
                if(!confirm("Voulez-vous vraiment supprimer ce profil ?")){
                    return;
                }
                    const updatedProfiles= getProfiles().filter((player)=>player.id !== id);
                    saveProfiles(updatedProfiles);

                    const currentPlayer=getCurrentPlayer();
                    if (currentPlayer && currentPlayer.id===id) {
                        saveCurrentPlayer(null);
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
 
 profileForm.addEventListener("submit",(event)=>{
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
        if(currentPlayer && currentPlayer.id === playerId){

        const updatedCurrentPlayer=getProfiles().find(
            (player)=>player.id===playerId);
        if(updatedCurrentPlayer){
            saveCurrentPlayer(updatedCurrentPlayer);

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