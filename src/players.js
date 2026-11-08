
import { getProfiles, saveProfiles } from "./storage.js";

export function validateNickname(nickname){

    const regex = /^[A-Za-z0-9]{3,15}$/;
    if (!nickname || !regex.test(nickname.trim())){
        return{ valid: false,
             message : 'le pseudo doit contenir entre 3 et 15 caractères(lettres et chiffres uniquement).'};
    };

    const profiles= getProfiles();

    const exist = profiles.some(
        p=> p.nickname.toLowerCase() === nickname.toLowerCase());
    if (exist){
        return{valid:false,
            message:'ce pseudo est déjà pris.'};
    }
    return{valid:true,
        message:''
    };
}
export function createPlayer(nickname,avatar = '👤'){

    const validation = validateNickname(nickname);

    if(!validation.valid){
        throw new Error(validation.message);
    }
    const newPlayer = {
        id: "p_"+ Date.now(),
        nickname:nickname.trim(),
        avatar : avatar,
        createdAt:new Date().toISOString(),
        gamesPlayed:0
    };
    const profiles=getProfiles();
    profiles.push(newPlayer);
    saveProfiles(profiles);
    return newPlayer;
}

export function updatedPlayer(id,nickname,avtar){
const regex=/^[A-Za-z0-9]{3,15}$/;
if(!regex.test(nickname.trim())){
    throw new Error("Pseudo invalide :3 à 15 caractères.")
}
const profiles=getProfiles();
const exist=profiles.some(
    p=> p.id !==id && 

p.nickname.toLowerCase() === nickname.trim().toLowerCase()
    );

    if (exist) {
        throw new Error("Ce pseudo est déjà pris.");
    }

    const index = profiles.findIndex(p => p.id === id);

    if (index === -1) {
        throw new Error("Profil introuvable.");
    }

    profiles[index] = {
        ...profiles[index],
        nickname: nickname.trim(),
        avatar: avatar
    };

    saveProfiles(profiles);
}