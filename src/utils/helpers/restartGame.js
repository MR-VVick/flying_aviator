import { game } from "../contants/gameVar";

export default function resetGame(){
    fieldLevel.innerHTML = Math.floor(game.level);
}