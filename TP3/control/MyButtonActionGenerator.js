function pauseGame(state) {
    console.log("paused game!");
}

function setEasyDifficulty(state) {
    console.log("easy!");
}

function setMediumDifficulty(state) {
    console.log("medium!");
}

function setHardDifficulty(state) {
    console.log("hard!");
}

function setHvHMode(state) {

}

function setHvMMode(state) {

}

function setMvMMode(state) {

}

function exitGame(state) {

}

function undoMove(state) {
    console.log("undo!");
}

function seeGameMovie(state) {
    console.log("movie!");
}

const actionGenerator = {
    "pause": pauseGame,
    "easy": setEasyDifficulty,
    "medium": setMediumDifficulty,
    "hard": setHardDifficulty,
    "hvh": setHvHMode,
    "hvm": setHvMMode,
    "mvm": setMvMMode,
    "exit": exitGame,
    "undo": undoMove,
    "movie": seeGameMovie
}