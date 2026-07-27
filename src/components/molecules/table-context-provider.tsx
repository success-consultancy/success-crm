import * as React from 'react';

type TableContextState = {
  rowSelectionState: {} | undefined;
  isLoading: boolean;
  /** Hide a column by id (and persist the change). Provided by TableComponent. */
  hideColumn?: (columnId: string) => void;
};

const TableContext = React.createContext<TableContextState | null>(null);

// Per-column context so a header (e.g. ColumnHeader) knows its own column id
// without every column definition having to pass it explicitly.
const ColumnIdContext = React.createContext<string | undefined>(undefined);
export const ColumnIdProvider = ColumnIdContext.Provider;
export const useColumnId = () => React.useContext(ColumnIdContext);

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
