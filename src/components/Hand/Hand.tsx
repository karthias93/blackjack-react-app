import React from 'react'
import { HandProps} from './types'
import componentStyles from './Hand.module.css'
import Card from './../Card'

const Hand: React.FC<HandProps> = ({ title, cards }) => {

    const getTitle = () => {
        if (cards.length > 0) {
          return (
            <h3 className={componentStyles.title}>{title}</h3>
          );
        }
      }

    return (
        <div className={componentStyles['hand-container']}>
            {getTitle()}
            <div className={componentStyles['card-container']}>
                {cards.map((card: any, index: number) => {
                    return (
                        <Card key={index} value={card.value} suit={card.suit} hidden={card.hidden} />
                    );
                })}
            </div>
      </div>
    )
}

export default Hand;