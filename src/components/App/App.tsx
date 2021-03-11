import React, { useEffect, useState } from 'react';
import componentStyles from './App.module.css';
import { GameState, Deal, Message } from './types';
import { Alert, Button } from 'reactstrap';
import Hand from './../Hand';

const App: React.FC = () => {

    const generateDeck = () => {
        const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
        const suits = ['spades','diamonds','clubs','hearts'];
        const deck = [];
        for (let i = 0; i < cards.length; i++) {
          for (let j = 0; j < suits.length; j++) {
            deck.push({value: cards[i], suit: suits[j]});
          }
        }
        return deck;
    }
      
    const [deck, setDeck]: any[] = useState(generateDeck());

    const [userCards, setUserCards]: any[] = useState([]);
    const [userScore, setUserScore] = useState(0);
    const [userCount, setUserCount] = useState(0);
  
    const [dealerCards, setDealerCards]: any[] = useState([]);
    const [dealerScore, setDealerScore] = useState(0);
    const [dealerCount, setDealerCount] = useState(0);

    const [gameState, setGameState] = useState(GameState.init);
    const [message, setMessage] = useState(Message.hitStand);
    const [buttonState, setButtonState] = useState({
        hitDisabled: false,
        standDisabled: false,
        resetDisabled: true
    });

    useEffect(() => {
        if (gameState === GameState.init) {
            drawCard(Deal.user);
            drawCard(Deal.hidden);
            drawCard(Deal.user);
            drawCard(Deal.dealer);
            setGameState(GameState.userTurn);
            setMessage(Message.hitStand);
        }
    }, [gameState]);
    
    useEffect(() => {
        calculate(userCards, setUserScore);
        setUserCount(userCount + 1);
    }, [userCards]);
    
    useEffect(() => {
        calculate(dealerCards, setDealerScore);
        setDealerCount(dealerCount + 1);
    }, [dealerCards]);
    
    useEffect(() => {
        if (gameState === GameState.userTurn) {
            if (userScore === 21) {
                buttonState.hitDisabled = true;
                setButtonState({ ...buttonState });
            } else if (userScore > 21) {
                bust();
            }
        }
    }, [userCount]);
    
    useEffect(() => {
        if (gameState === GameState.dealerTurn) {
            if (dealerScore >= 17) {
                checkWin();
            } else {
                drawCard(Deal.dealer);
            }
        }
    }, [dealerCount]);
    
    const resetGame = () => {

        setDeck(generateDeck());
    
        setUserCards([]);
        setUserScore(0);
        setUserCount(0);
    
        setDealerCards([]);
        setDealerScore(0);
        setDealerCount(0);
    
        setGameState(GameState.init);
        setMessage(Message.hitStand);
        setButtonState({
            hitDisabled: false,
            standDisabled: false,
            resetDisabled: true
        });
    }
    
    const drawCard = (dealType: Deal) => {
        if (deck.length > 0) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            const card = deck[randomIndex];
            deck.splice(randomIndex, 1);
            setDeck([...deck]);

            switch (card.suit) {
                case 'spades':
                    dealCard(dealType, card.value, '♠');
                    break;
                case 'diamonds':
                    dealCard(dealType, card.value, '♦');
                    break;
                case 'clubs':
                    dealCard(dealType, card.value, '♣');
                    break;
                case 'hearts':
                    dealCard(dealType, card.value, '♥');
                    break;
                default:
                    break;
            }
        } else {
          alert('All cards have been drawn');
        }
    }
    
    const dealCard = (dealType: Deal, value: string, suit: string) => {
        switch (dealType) {
            case Deal.user:
                userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
                setUserCards([...userCards]);
                break;
            case Deal.dealer:
                dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
                setDealerCards([...dealerCards]);
                break;
            case Deal.hidden:
                dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
                setDealerCards([...dealerCards]);
                break;
            default:
                break;
        }
    }
    
    const revealCard = () => {
        dealerCards.filter((card: any) => {
            if (card.hidden === true) {
                card.hidden = false;
            }
            return card;
        });
        setDealerCards([...dealerCards])
    }
    
    const calculate = (cards: any[], setScore: any) => {
        let total = 0;
        cards.forEach((card: any) => {
            if (card.hidden === false && card.value !== 'A') {
                switch (card.value) {
                case 'K':
                    total += 10;
                    break;
                case 'Q':
                    total += 10;
                    break;
                case 'J':
                    total += 10;
                    break;
                default:
                    total += Number(card.value);
                    break;
                }
            }
        });
        const aces = cards.filter((card: any) => {
            return card.value === 'A';
        });
        aces.forEach((card: any) => {
            if (card.hidden === false) {
                if ((total + 11) > 21) {
                    total += 1;
                } else if ((total + 11) === 21) {
                    if (aces.length > 1) {
                        total += 1;
                    } else {
                        total += 11;
                    }
                } else {
                    total += 11;
                }
            }
        });
        setScore(total);
    }
    
    const hit = () => {
        drawCard(Deal.user);
    }
    
    const stand = () => {
        buttonState.hitDisabled = true;
        buttonState.standDisabled = true;
        buttonState.resetDisabled = false;
        setButtonState({ ...buttonState });
        setGameState(GameState.dealerTurn);
        revealCard();
    }
    
    const bust = () => {
        buttonState.hitDisabled = true;
        buttonState.standDisabled = true;
        buttonState.resetDisabled = false;
        setButtonState({ ...buttonState });
        setMessage(Message.bust);
    }
    
    const checkWin = () => {
        if (userScore > dealerScore || dealerScore > 21) {
          setMessage(Message.userWin);
        }
        else if (dealerScore > userScore) {
          setMessage(Message.dealerWin);
        }
        else {
          setMessage(Message.tie);
        }
    }


    return (
        <div className={componentStyles['app-container']}>
            <h1 className={componentStyles['app-header']}>Blackjack</h1>
            {message &&
                <Alert color="primary" className={componentStyles['status-message']}>
                    {message}
                </Alert>
            }
            <div className={componentStyles['buttons']}>
                <Button color="primary" onClick={resetGame} disabled={buttonState.resetDisabled} className={componentStyles['button']}>New Game</Button>
                <Button color="primary" onClick={hit} disabled={buttonState.hitDisabled} className={componentStyles['button']}>Hit</Button>
                <Button color="primary" onClick={stand} disabled={buttonState.standDisabled} className={componentStyles['button']}>Stick</Button>
            </div>
            <Hand title={`Your Hand (${userScore})`} cards={userCards} />
            <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
        </div>
    );
}

export default App;
