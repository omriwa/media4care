import React, { CSSProperties, useState, ChangeEvent, useEffect } from 'react';
import { IParticipant } from '../interfaces';
import { setTimeout } from 'timers';
import { callbackify } from 'util';


const greenButtonStyle: CSSProperties = {
    borderRadius: '100%',
    width: 25,
    height: 25,
    backgroundColor: 'green'
};
const redButtonStyle: CSSProperties = {
    ...greenButtonStyle,
    backgroundColor: 'red'
}

const stateChangeDelay = 500;

export const ParticipantWindow = (props: IParticipant) => {
    const { callNumber, participantState, participantsNumber, selectedRecipient: recepientNumber, updateState,rejectCall } = props;
    const { state } = participantState;
    const [selectedRecipient, setSelectedRecipient] = useState(recepientNumber);
    const style: CSSProperties = {
        width: (participantsNumber.length === 0 ? 0 : 100 / participantsNumber.length) + '%',
        height: (participantsNumber.length === 0 ? 0 : 100 / participantsNumber.length) + '%',
        backgroundColor: 'white',
        border: '1px solid gray'
    }
    const onChangeRecipient = (e: any) => {
        const selectedRecipient = parseInt(e.currentTarget.value);

        setSelectedRecipient(selectedRecipient);
        updateState({
            ...props,
            selectedRecipient
        })
    };
    const onCall = () => {
        if (participantsNumber.find(pn => pn === selectedRecipient)) {
            updateState({
                ...props,
                participantState: { state: 'Placing call' }
            });
        }
        else {
            updateState({
                ...props,
                participantState: { state: 'remote unknown' }
            });
        }

        if (state === 'Remote is ringing') {
            updateState({
                ...props,
                participantState: { state: 'Talking' }
            });
        }
    }
    const onReject = async () => {
        await updateState({
            ...props,
            participantState: { state: 'remote rejected' }
        });
        rejectCall(selectedRecipient);
    }

    const callbackDelay = (callback: any) => setTimeout(callback, stateChangeDelay);

    const handleState = () => {
        switch (state) {
            case 'Placing call':
                callbackDelay(() => {
                    updateState({
                        ...props,
                        participantState: { state: 'Ringing' },
                    });
                });
                break;
        }
    }

    useEffect(() => {
        handleState();
    }, [state]);

    useEffect(() => {
        setSelectedRecipient(recepientNumber);
    },[recepientNumber]);

    return <div
        style={style}
    >
        <div>
            <h3>
                <span>
                    {
                        callNumber
                    }
                </span>
                :
                <span>
                    {
                        state
                    }
                </span>
            </h3>
        </div>

        <div>
            <input
                type='number'
                onChange={onChangeRecipient}
                value={selectedRecipient}
            />
        </div>

        <div>
            <button
                style={greenButtonStyle}
                onClick={onCall}
            />

            <button
                style={redButtonStyle}
                onClick={onReject}
            />
        </div>
    </div>
}