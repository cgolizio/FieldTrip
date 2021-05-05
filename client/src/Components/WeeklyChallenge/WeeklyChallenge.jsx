import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import axios from 'axios';

import IconButtons from '../Navigation/IconButtons.jsx';

const Container = styled.div`
background-color: lavender;
border-radius: 10px !important;
border: 3px !important;
border-color: whitesmoke !important;
margin: 50px;
padding: 50px;
display: flex;
flex-flow: column;
width: 50%;
/* justify-content: center; */
position: absolute;
top: 40%;
left: 48%;
transform: translate(-50%, -50%);
opacity: 85%;
.challenge-header{
  color: #1d1d1d;
  text-align: start;
  /* text-decoration: underline; */
  /* font-weight: bold; */
  font-size: 44px;
}
.challenge{
  color: #1d1d1d;
  text-align: center;
  font-size: 38px;
}
.complete{
  color: #736bfb;
  font-size: 20px;
  text-align: center;

}
`

const challenges = [
  { 0: 'Collect a stamp from each category.' },
  { 1: 'Earn at least 3 \'Earth\' stamps.' },
  { 2: 'Read at least 5 news articles, and view your 5 new stamps in your passport.' },
  { 3: 'Earn at least 3 \'Space\' stamps.' },
  { 4: 'Watch at least 1 documentary in the category of your choice.' },
  { 5: 'Earn at least 3 \'Natural History\' stamps.' },
  { 6: 'six' },
];

const WeeklyChallenge = ({ getStamps, user }) => {
  const [daily, setDaily] = useState(0);
  const [challenge, setChallenge] = useState(challenges[daily][daily]);
  const [clicked, setClicked] = useState(false);
  const [completed, setCompleted] = useState([{ daily: challenge, complete: clicked }]);

    useEffect(() => {
      let date = new Date();
      const day = date.getDay();
      setDaily(day);
    }, []);

    useEffect(() => {
      setChallenge(challenges[daily][daily])
    }, [daily]);


    const handleClick = () => {
      setClicked(!clicked);
      let today = new Date().toISOString().slice(0, 10)

      axios.post('/challenge', {
        title: 'trophy',
        category: 'daily challenge',
        date: today,

      })
        .then(() => {
          console.log('trophy worked');
          getStamps()

        })
        .catch();
      console.log('CLICKED', clicked);
    };

    useEffect(() => {
       setCompleted((prev) => {
        if (prev.daily === completed.daily) {
          return [ { daily: challenge, completed: !clicked } ]
        } else {
          return [...prev, { daily: challenge, complete: !clicked }];
        }
      });
      console.log('COMPLETED', completed);
    }, [clicked]);


  return (
    <>
      <Container>
        <p className='challenge-header'>Daily Challenge:</p>
        <br/>
        <p className='challenge'>
          {challenge}
        </p>
        <div className='complete'>
          <IconButtons clicked={clicked} handleClick={handleClick} completed={completed} setCompleted={setCompleted} challenge={challenge} />
          {
            clicked ?
            <div style={{textAlign: 'center' }}>Completed!</div> : null
          }
        </div>
      </Container>
    </>
  );
};

export default WeeklyChallenge;
