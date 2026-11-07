import { renderCurrentPlayer } from "./ui";

document.addEventListener('DOMContentLoaded', () =>{
    renderCurrentPlayer();
});
import { getCurrentPlayer,getProfiles,saveCurrenPlayer, saveProfiles } from "./storage.js";
import {createPlayer,validateNickname}from"./players.js";
import { renderCurrentPlayer,renderProfilesList } from "./ui.js";
import { Profiler } from "react";

document.addEventListener('DOMContentLoaded', ()=>{
    renderCurrentPlayer();
     
    const modal =document.getElementById('profiles-modal');
    const openBtn = document.getElementById('open-Profiles-btn');
    const closeBtn = document.getElementById('close-profiles-btn');
    const profilFrom=document.getElementById('profile-from');
    const nicknameInput=document.getElementById('nickname-input');
    const avatarSelect= document.getElementById('avatar-select');
    const fromError=document.getElementById('from-error');
    const playerIdInput = document.getElementById('player-id');

    function refreshProfiles(){
        const profile = getProfiles();
        const currentPlayer=getCurrentPlayer();
        renderProfilesList(
            profiles,
            currentPlayer? currentPlayer.id : null,

            (id)=>{
                const profiles = getProfiles();
                const selected= profiles.find(p=>p.id ===id);
                if (selected){
                    saveCurrenPlayer();
                    renderCurrentPlayer();
                    refreshProfiles();
                
                }
            },
            (id)=>{
                if(confirm("Voulez-vous vraiment supprimer ce profil ?")){
                    let profiles=getProfiles();
                    profile=profiles.filtes(p=>p.id !== id);
                    saveProfiles(profiles);

                    const currentPlayer=getCurrentPlayer();
                    if(currentPlayer&&currentPlayer.id===id){
                        saveCurrenPlayer(null);
                        renderCurrentPlayer();
                    }
                    refreshProfiles();
                }
            }

        );
  
    }
    if (openBtn){
        openBtn.onclick=()=>{
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        refreshProfiles();
        };
    }
    
})