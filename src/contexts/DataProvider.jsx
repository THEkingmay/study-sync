import { useContext, createContext, useState } from "react";

const DataContext = createContext()


export default function DataContextProvider({ children }) {
    const [studyData, setStudyData] = useState([]);
    const [examData, setExamData] = useState([]);

    const [plannerData, setPlannerData] = useState({
        activities: [],
        study: []
    });

    const [profileData, setProfileData] = useState({
        fullname: "",
        studentId: "",
        faculty: "",
        year: ""
    });

    const resetAllData = () => {
        setStudyData([]);
        setExamData([]);
        setPlannerData({
            activities: [],
            study: []
        });
        setProfileData({
            fullname: "",
            studentId: "",
            faculty: "",
            year: ""
        });
    };

    return (
        <DataContext.Provider value={{
            studyData, setStudyData,
            examData, setExamData,
            profileData, setProfileData,
            plannerData, setPlannerData,
            resetAllData
        }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)