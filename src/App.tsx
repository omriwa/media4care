import React, { memo, useState, useEffect } from 'react';
// components
import { ParticipantWindow } from './components/participantWindow';
import { IParticipant } from './interfaces';

const appStyle = {
  position: 'relative' as 'relative',
      height: '100%',
  width: '100%',
      display: 'flex' as 'flex'
}

export const App = memo(() => {
  const [participants, setParticipants] = useState([]);

  const generate3Digit: () => number = () => {
    let number = 0;

    while (number < 100 || number >= 1000) {
      number = Math.ceil(Math.random() * 999);
    }

    return number;
  }

  const initParticipants = () => {
    let newParticipants: IParticipant[] = [];

      for (let i = 0; i < 4; i++){
        const participant:IParticipant = {
          callNumber: generate3Digit(),
          selectedRecipient: null,
          participantState: { state: 'Idle' },
          participantsNumber: [],
          rejectCall
        }
        newParticipants.push(participant);
      }

      setParticipants(newParticipants.map((p,i) => {
        return {
          ...p,
          participantsNumber: newParticipants.map(np => np.callNumber),
        }
      }));
  }

  const ringingHandler = () => {
    participants.forEach((p1: IParticipant,p1Index) => {
      if (p1.participantState.state === 'Ringing') {
        const p2Index = participants.findIndex((p: IParticipant) => p.callNumber === p1.selectedRecipient);
        const participantsCopy = [...participants];

        if (p2Index !== -1 && participants[p2Index].participantState.state === 'Idle') {        
          const p2Copy:IParticipant = {
            ...participants[p2Index],
            selectedRecipient: p1.callNumber,
            participantState: {state: 'Remote is ringing'}
          }
          participantsCopy[p2Index] = p2Copy;

          setParticipants(participantsCopy);
        }
        else if (p2Index !== -1 && participants[p2Index].participantState.state === 'Talking') {
          const participantsCopy = [...participants];
          const p1Copy:IParticipant = {
            ...participants[p1Index],
            participantState: {state: 'Talking'}
          }

          participantsCopy[p1Index] = p1Copy;

          setParticipants(participantsCopy);
        }
      }
    });
  }

  const rejectCall = async (participantNumber: number) => {
    const participantIndex = participants.findIndex((p: IParticipant) => p.callNumber === participantNumber);
    const participantState = participants[participantIndex].participantState;
    const pCopy:IParticipant = {
      ...participants[participantIndex],
      participantState: {state: participantState && participantState.state === 'Talking' ? 'Idle' : 'remote busy'}
    };
    const participantsCopy = [...participants];

    participantsCopy[participantIndex] = pCopy;

    await setParticipants(participantsCopy);
    pCopy.participantState.state = 'Idle';
    participantsCopy[participantIndex] = pCopy;
    setParticipants(participantsCopy);
  } 

  const handleParticipants = () => {
    console.log({participants})
    ringingHandler();
    // rejectingHandler();
  }

  useEffect(() => {
    if (participants.length === 0) {// init
      initParticipants();
    }
    else {
      handleParticipants();
    }
  }, [participants]);

  return <div
    style={appStyle}
  >
    {
      participants.map((p: IParticipant, pIndex) => <ParticipantWindow
        {...p}
        updateState={(participant: IParticipant) => {
          const participantsCopy = [...participants];

          participantsCopy[pIndex] = { ...participant };
          setParticipants(participantsCopy);
        }}
        key={pIndex}
      />)
    }
  </div>
});
