const PROFILES_KEY= "ec_profiles";
const CURRENT_PLAYER_KEY ="ec_current_player";
export function getProfiles(){
    const data =localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];

} 
export function saveProfiles(profiles){
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}
export function getCurrentPlayer(){
    const data = localStorage.getItem(CURRENT_PLAYER_KEY);
    return data ? JSON.parse(data) : null;
}
export function saveCurrenPlayer(player){
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player))
}