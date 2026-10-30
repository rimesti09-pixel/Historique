import { Profiler } from "react";
import { getProfiles, saveCurrenPlayer, saveProfiles } from "./storage.js";
export function validateNickname(nickname){
    const regx = /^[A-Za-z0-9]{3,15}$/;
    if (!nickname || !regex.test(nickname)){
        return{ valid: false, message : 'le pseudo doit contenir entre 3 et 15 caractères(lettres et chiffres uniquement).'};
    }
    const profiles= getProfiles();
    const exist = profiles.some(p=> p.nickname .tolowerCase()=== nickname.tolowerCase());
    if (exist){
        return{valide:false,message:'ce pseudo est déjà pris.'};
    }
    return{valide:true,message:''};
}
export function createPlayer(nickname,avatar = '👤'){
    const validation = validateNickname(nickname);
    if(!validation.valid){
        throw new Error(validation.message);
    }
    const newPlayer = {
        id:Data.now().toString(),
        nickname:nickname.trim(),
        avatar : avatar,
        createdAt:new Data().toISOString(),
        gamesPlayed:0
    };
    const profiles=getProfiles();
    profiles.push(newPlayer);
    saveProfiles(Profiler);
    return newPlayer;
}