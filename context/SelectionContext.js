// context/SelectionContext.js
import React, { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selections, setSelections] = useState({
    Probe: [],
    CPP: "없음",
    CPPAcc: [],
    CRP: "없음",
    CRPAcc: [],
    HeTransferline: "없음",
  });

  return (
    <SelectionContext.Provider value={{ selections, setSelections }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
