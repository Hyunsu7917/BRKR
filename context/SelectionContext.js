import React, { createContext, useState } from "react";

export const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [selections, setSelections] = useState({});

  return (
    <SelectionContext.Provider value={{ selections, setSelections }}>
      {children}
    </SelectionContext.Provider>
  );
};
