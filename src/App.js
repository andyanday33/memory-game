import { useEffect, useState, useRef } from 'react';
import './App.css';
import SingleCard from './components/SingeCard';

const cardImages = [
  { "src" : "/img/helmet-1.png", matched: false},
  { "src" : "/img/potion-1.png", matched: false},
  { "src" : "/img/ring-1.png", matched: false},
  { "src" : "/img/scroll-1.png", matched: false},
  { "src" : "/img/shield-1.png", matched: false},
  { "src" : "/img/sword-1.png", matched: false}
]
 

function App() {

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const numberOfFlippedCards = useRef(0);
  //shuffle cards
  const shuffleCards = () => {
    //Take twelve cards and shuffle them randomly
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setChoiceOne(null);
    setChoiceTwo(null);
    setGameWon(false);
    setCards(shuffledCards);
    setTurns(0);
  }

  
  //handle card choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  //compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if(choiceOne.src === choiceTwo.src && choiceOne.id !== choiceTwo.id) {
        numberOfFlippedCards.current = numberOfFlippedCards.current + 2;
        setCards(prevCards => {
          return prevCards.map(card => {
            // const regex = /http(s)*:\/\/(www\.)*[a-zA-Z0-9.:]*\//g;
            // //Delete preceding text from url (http:/localhost:8080/ or something)
            // let choiceOneSource = choiceOne.src.replace(regex, '/')
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })

        if(numberOfFlippedCards.current === 12) {
          setGameWon(true)
        }
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  //Start the game automatically
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Memory Game</h1>
      {gameWon && (<h2>Game Won!</h2>)}
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard 
          key={card.id} 
          card={card} 
          handleChoice={handleChoice}
          flipped={card === choiceOne || card === choiceTwo || card.matched}
          disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
