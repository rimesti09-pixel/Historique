
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
        return{valide:false,
            message:'ce pseudo est déjà pris.'};
    }
    return{valide:true,
        message:''
    };
}
export function createPlayer(nickname,avatar = '👤'){

    const validation = validateNickname(nickname);

    if(!validation.valide){
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