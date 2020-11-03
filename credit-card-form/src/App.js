import React, { useState } from 'react';
import DiscoverLogo from './assets/discover.svg';
import DinnersLogo from './assets/dinners.svg';
import MasterLogo from './assets/mastercard.svg';
import VisaLogo from './assets/visa.svg';
import Chip from './assets/chip.svg';

function App() {

  const [cardSide, setCardSide] = useState(false);
  const [cardFlag, setCardFlag] = useState(MasterLogo);

  const [numberInput, setNumberInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [cvvInput, setCvvInput] = useState("");

  const [lineFocus, setLineFocus] = useState("focus-disable");
  
  const [alert, setAlert] = useState({ show: false, ok: false, text: '' });

  const url = 'http://localhost:5000';

  const postData = async (data) => {
    const respose = await fetch(url, {
      mode: 'cors',
      method: 'POST', 
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return respose.json();
  }

  const masks = {
    number(value) {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4})(\d)/, '$1 $2')
        .replace(/(\d{4})(\d)/, '$1 $2')
    },
    name(value){
      return value
        .replace(/\d/g, '')
    }
  }

  const handleNumberInput = event => {
    const value = event.target.value;
    setNumberInput(masks.number(value));

    if(value.substring(0) === "6") setCardFlag(DiscoverLogo);
    if(value.substring(0) === "5") setCardFlag(MasterLogo);
    if(value.substring(0) === "4") setCardFlag(VisaLogo);
    if(value.substring(0) === "3") setCardFlag(DinnersLogo);
  }

  const handleNameInput = event => {
    const value = event.target.value;
    setNameInput(masks.name(value));
  }

  const handleMonthInput = event => {
    setMonthInput(event.target.value);
  }

  const handleYearInput = event => {
    setYearInput(event.target.value);
  }

  const handleCvvInput = event => {
    let str = event.target.value;
    str = str.replace(/\D/g, '')
    setCvvInput(str);
  }

  const flipCard = () => {
    cardSide? setCardSide(false):setCardSide(true);
  }

  const handleFocus = event => {
    if(event.target.id === "card-number"){
      setLineFocus("numberFocus");
    }
    if(event.target.id === "card-name"){
      setLineFocus("nameFocus");
    }
    if(event.target.id === "year" || event.target.id === "month"){
      setLineFocus("dateFocus");
    }
  }

  const handleBlur = () => {
    setLineFocus("focus-disable")
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      number: numberInput.replace(/ /g, ""),
      name: nameInput,
      date: monthInput+'/'+yearInput,
      cvv: cvvInput
    }

    const respose = await postData(data);
    const json = await respose

    if(json === 200){
      setAlert({show: true, ok: true, text: 'Card successfully registered!'})
    }else{
      const field = json.details.body[0].path[0];

      if(field === "number"){
        setAlert({ show: true, ok: false, text: 'Your Card Number field must have 16 numbers.' })
        document.querySelector("#card-number").focus()
      }
      if(field === "name"){
        setAlert({ show: true, ok: false, text: 'Your Name field must have at least 5 letters.' })
        document.querySelector("#card-name").focus()
      }
      if(field === "date"){
        setAlert({ show: true, ok: false, text: 'Date field is invalid.' })
        document.querySelector("#month").focus()
      }
      if(field === "cvv"){
        setAlert({ show: true, ok: false, text: 'Your CVV field must have at least 3 numbers.' })
        document.querySelector("#cvv").focus()
      }
    }
  }

  const createAlert = () => {
    return(
      <div 
        className={`alert ${alert.show?"active":"disable"} ${alert.ok?"alert-success":"alert-danger"}`}
        role="alert">
        {alert.text}
      </div>
    )
  }

  return (
    <div className="App">

      {createAlert()}

      <div className="credit-card">
        <div className={"credit-card-inner " + (cardSide? "toggle": '')}>

          <div className="credit-card-front">
            <div id="focus-border" className={lineFocus}></div>

            <div className="chip"><img src={Chip} alt="chip"/></div>
            <div className="type"><img src={cardFlag} alt="flag"/></div>
            <div className="number">{numberInput?numberInput:'#### #### #### ####'}</div>
            <div className="name"><span>Card Holder</span>{nameInput?nameInput:"Some Body"}</div>
            <div className="date"><span>Expires</span>{`${monthInput?monthInput:'MM'}/${yearInput?yearInput:'YY'}`}</div>
          </div>

          <div className="credit-card-back">
            <div className="dark-bar"></div>
            <div className="cvv-bar">{cvvInput?cvvInput:'###'}</div>
            <div className="type"><img src={cardFlag} alt="flag"/></div>
          </div>

        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="card-number">Card Number</label>
            <input type="text" 
              className="form-control form-control-lg" 
              id="card-number" 
              maxLength="19"
              value={numberInput}
              onInput={handleNumberInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-name">Card Name</label>
            <input type="text" 
            className="form-control form-control-lg" 
            id="card-name"
            value={nameInput}
            onInput={handleNameInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            />
          </div>
          <div className="bottom-row">
            <div className="form-group month">
              <label htmlFor="month">Expiration Date</label>
              <select onChange={handleMonthInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                defaultValue="Month" 
                className="form-control form-control-lg" 
                id="month"
              >
                <option value="Month" disabled>Month</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div className="form-group year">
              <select onChange={handleYearInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                defaultValue="Year"
                className="form-control form-control-lg" 
                id="year"
              >
                <option value="Year" disabled>Year</option>
                <option value="20">2020</option>
                <option value="21">2021</option>
                <option value="22">2022</option>
                <option value="23">2023</option>
                <option value="24">2024</option>
                <option value="25">2025</option>
                <option value="26">2026</option>
                <option value="27">2027</option>
                <option value="28">2028</option>
                <option value="29">2029</option>
                <option value="30">2030</option>
              </select>
            </div>
            <div className="form-group cvv">
              <label htmlFor="cvv">CVV</label>
              <input type="text" 
              className="form-control form-control-lg" 
              id="cvv"
              maxLength="4"
              value={cvvInput}
              onInput={handleCvvInput} 
              onBlur={flipCard} 
              onFocus={flipCard}
              />
            </div>
          </div>
          <button type="submit"
            className="btn btn-primary btn-lg"
           >Submit</button>
        </form>
      </div>
      
    </div>
  );
}

export default App;
