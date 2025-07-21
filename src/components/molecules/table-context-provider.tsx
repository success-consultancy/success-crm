import * as React from 'react';

type TableContextState = {
  rowSelectionState: {} | undefined;
  isLoading: boolean;
};

const TableContext = React.createContext<TableContextState | null>(null);

interface EventContextProviderProps {
  state: TableContextState;
  children?: React.ReactNode;
}

/** info: This component is used to provide the event context to the children component */
const TableContextProvider: React.FC<EventContextProviderProps> = ({ state, children }) => {
  return <TableContext.Provider value={state}>{children}</TableContext.Provider>;
};

/** info: This hook is used to get the event context from the context provider */
const useTableContext = () => {
  const context = React.useContext(TableContext);

  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableContextProvider');
  }

  return context;
};

export { TableContextProvider, useTableContext };
