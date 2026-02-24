import { useContext, createContext , useState } from "react";

const DataContext = createContext()


export default function DataContextProvider({ children }) {
    const [studyData, setStudyData] = useState([]);
    const [examData, setExamData] = useState([]);
    return (
        <DataContext.Provider value={{studyData, setStudyData , examData , setExamData}}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)