import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import TaskScreen from './screens/TaskScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import {SpeechProvider} from './components/SpeechContext';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SpeechProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'mic-outline';
              } else if (route.name === 'Tasks') {
                iconName = 'list-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#ff5c5c',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Tasks" component={TaskScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SpeechProvider>
  );
};

export default App;
