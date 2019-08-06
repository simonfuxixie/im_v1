import React from "react";
import { Button, View, Text } from "react-native";
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";

import HomeScreen from './src/screens/home';
import LoginScreen from './src/screens/session/login';
import RegisterScreen from './src/screens/session/register';
import ChatRoomScreen from './src/screens/chat_room';
import NewChat from './src/screens/new_chat';

import Style from './src/components/style';

const Main = createBottomTabNavigator(
  {
    Home: HomeScreen,
    NewChat: NewChat
  },
  {
    tabBarOptions: {
      labelStyle: {fontSize: 15},
      style: {backgroundColor: Style.color, paddingBottom: 13},
      inactiveTintColor: 'rgba(255,255,255, 0.7)',
      activeTintColor: '#fff',
      indicatorStyle: {backgroundColor: '#fff', height: 4}
    }
  }
);

const HomeStack = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    Main: Main,
    ChatRoom: ChatRoomScreen
  },
  {
  	navigationOptions: {
      title: 'Chat',
      headerStyle: {backgroundColor: Style.color, elevation: 0},
      headerTintColor: '#fff'
    }
  }
);


const AppContainer = createAppContainer(HomeStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
