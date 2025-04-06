import React, {createContext, useContext} from 'react';
import useSpeechHandler from './SpeechHandler';

const SpeechContext = createContext();

export const SpeechProvider = ({children}) => {
  const speech = useSpeechHandler();

  return (
    <SpeechContext.Provider value={speech}>{children}</SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
