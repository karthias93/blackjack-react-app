import React from 'react'
import { CardProps } from './types'
import componentStyles from './Card.module.css'

const Card: React.FC<CardProps> = ({ value, suit, hidden }) => {

    const getColor = () => {
      if (suit === '♠' || suit === '♣') {
        return componentStyles.black;
      }
      else {
        return componentStyles.red;
      }
    }
  
    const getCard = () => {
      if (hidden) {
        return (
          <div className={componentStyles.hiddenCard} />
        );
      }
      else {
        return (
          <div className={componentStyles.card}>
            <div className={getColor()}>
              <h1 className={componentStyles.value}>{value}</h1>
              <h1 className={componentStyles.suit}>{suit}</h1>
            </div>
          </div>
        );
      }
    }
  
    return (
      <>
        {getCard()}
      </>
    );
  }
  
  export default Card;