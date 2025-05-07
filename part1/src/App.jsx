//Define un componente con el nombre App
//El componente se define como una función de JavaScript
import { useState } from "react";

const App = ()=>{
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [zero, setZero] = useState(0);
  const [allClicks, setAll] = useState([]);
  //const [total,setTotal] = useState(0);
  

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'));
    const updatedLeft = left + 1;
    setLeft(updatedLeft);
    //setTotal(updatedLeft + right);
  }
  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    setRight(right + 1);
    //setTotal(left + right);
  }
  const handleZeroClick = () => {
    setRight(0);
    setLeft(0);
    setAll([]);
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text={'left'}/>
      <Button handleClick={handleRightClick} text={'right'}/>
      {right}
      <History allClicks = {allClicks}/>
      <Suma a={left}  b={right}/>
      <Button handleClick={handleZeroClick} text={'zero'}/>
    </div>
  )
}

const Suma =({a, b})=>{
  return(
    <div>
      {a} + {b} = {a+b}
    </div>
  )

}

const Button =({handleClick, text})=>(
  <button onClick={handleClick}>
    {text}
  </button>
)



const History = ({allClicks}) =>{
  if(allClicks.length === 0){
    return(
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return(
    <div>
      button press history: {allClicks.join(' ')}
    </div>
  )
}

export default App;