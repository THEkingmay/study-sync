import DataContextProvider from "./src/contexts/DataProvider";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "./src/screens/Dashboard";
import PlannerScreen from "./src/screens/Planner";
import ProfileScreen from "./src/screens/Profile";
import TimetableScreen from "./src/screens/Timetable";

const Tabs = createBottomTabNavigator()

export default function App() {
  return (
    <DataContextProvider>
      <NavigationContainer>
        <Tabs.Navigator>
          <Tabs.Screen name="dashboard" component={DashboardScreen} />
          <Tabs.Screen name="timetable" component={TimetableScreen} />
          <Tabs.Screen name="planner" component={PlannerScreen} />
          <Tabs.Screen name="profile" component={ProfileScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </DataContextProvider>
  );
}


