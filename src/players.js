
import { getProfiles, saveProfiles } from "./storage.js";

export function validateNickname(nickname){
    const trimmedNickname = nickname.trim();
    const regex = /^[A-Za-z0-9]{3,15}$/;

    if (!trimmedNickname || !regex.test(trimmedNickname)){
        return{ valid: false,
             message : "le pseudo doit contenir entre 3 et 15 caractères(lettres et chiffres uniquement)."
    };
    }
    const profiles= getProfiles();

    const exist = profiles.some(
        (player)=> player.nickname.toLowerCase() === trimmedNickname.toLowerCase()
    );
    if (exist){
        return{
            valid:false,
            message:'ce pseudo est déjà pris.'
        };
    }
    return{valid:true,
        message:''
    };
}
export function createPlayer(nickname,avatar = '👤'){
const trimmedNickname=nickname.trim();
    const validation = validateNickname(trimmedNickname);

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

export function updatedPlayer(id,nickname,avatar){
    const trimmedNickname=nickname.trim();
const regex=/^[A-Za-z0-9]{3,15}$/;

if(!regex.test(trimmedNickname)){
    throw new Error("Pseudo invalide :3 à 15 caractères.lettres et chiffres uniquement.")
}
const profiles=getProfiles();
const exists=profiles.some(
    (player)=> player.id !==id && player.nickname.toLowerCase() === trimmedNickname.toLowerCase()
    );

    if (exists) {
        throw new Error("Ce pseudo est déjà pris.");
    }

    const index = profiles.findIndex(player => player.id === id);

    if (index === -1) {
        throw new Error("Profil introuvable.");
    }

    profiles[index] = {
        ...profiles[index],
        nickname: nickname.trim(),
        avatar
    };

    saveProfiles(profiles);
    return profiles[index];
}