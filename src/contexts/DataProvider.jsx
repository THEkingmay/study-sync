import { useContext , createContext } from "react";

const DataContext = createContext()


export default function DataContextProvider({children}){
    
    return(
        <DataContext.Provider value={null}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)