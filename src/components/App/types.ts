export enum GameState {
    bet,
    init,
    userTurn,
    dealerTurn
}

export enum Deal {
    user,
    dealer,
    hidden
}

export enum Message {
    hitStand = 'Hit or Stand?',
    bust = 'Bust!',
    userWin = 'You Win!',
    dealerWin = 'Dealer Wins!',
    tie = 'Tie!'
}