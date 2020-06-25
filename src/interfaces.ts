export interface IParticipantState {
    state: 'Idle'
    | 'Ringing'
    | 'Talking'
    | 'Placing call'
    | 'Remote is ringing'
    | 'remote unknown'
    | 'remote busy'
    | 'remote rejected';
}

export interface IParticipant {
    callNumber: number;
    selectedRecipient: number;
    participantState: IParticipantState;
    participantsNumber: number[];
    updateState?: (participant: IParticipant) => void;
    rejectCall: (participantNumber: number) => void;
}