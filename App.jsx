import React from 'react';
import DataContextProvider from "./src/contexts/DataProvider";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet ,Image } from 'react-native';

import DashboardScreen from "./src/screens/Dashboard";
import PlannerScreen from "./src/screens/Planner";
import ProfileScreen from "./src/screens/Profile";
import TimetableScreen from "./src/screens/Timetable";


const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <DataContextProvider>
      <NavigationContainer>
        <Tabs.Navigator
          screenOptions={({ route }) => ({
            headerShown : false ,
            tabBarStyle: {
              position : "absolute",
              backgroundColor: '#D8BFD8', 
              borderWidth : 1, 
              borderTopLeftRadius : 20,
              borderTopRightRadius : 20 ,
              height: 100,
              borderTopWidth: 0,
              paddingTop : 20 , 
              paddingBottom : 100 ,
              elevation : 20
            },
            tabBarShowLabel: false, 
            tabBarIcon: ({ focused }) => {
              let iconName;
              let label;
              switch (route.name) {
                case 'dashboard':
                  iconName = focused ? 'home' : 'home-outline';
                  label = 'หน้าแรก';
                  break;
                case 'timetable':
                  iconName = focused ? 'calendar' : 'calendar-outline';
                  label = 'ตารางเรียน';
                  break;
                case 'planner':
                  iconName = focused ? 'checkbox' : 'checkbox-outline';
                  label = 'กิจกรรม';
                  break;
                case 'profile':
                  iconName = focused ? 'person' : 'person-outline';
                  label = 'โปรไฟล์';
                  break;
              }

              return (
                <View style={[
                  styles.tabItemContainer,
                  focused && styles.tabItemActive 
                ]}>
                  <Ionicons 
                    name={iconName} 
                    size={28} 
                    color={focused ? '#5E35B1' : '#455A64'} 
                  />
                  <Text style={[
                    styles.tabLabel,
                    { color: focused ? '#5E35B1' : '#455A64' }
                  ]}>
                    {label}
                  </Text>
                </View>
              );
            },
          })}
        >
          <Tabs.Screen name="dashboard" component={DashboardScreen} />
          <Tabs.Screen name="timetable" component={TimetableScreen} />
          <Tabs.Screen name="planner" component={PlannerScreen} />
          <Tabs.Screen name="profile" component={ProfileScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </DataContextProvider>
  );
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width:80,
    height: 70,
    borderRadius: 20,
    marginTop: 15,
  },
  tabItemActive: {
    backgroundColor: '#ffeeff', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});