import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    fetch("https://cs571.org/api/f23/hw9/chatrooms", {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
      }
    }).then(res => res.json()).then(data => {
      setChatrooms(data)
    })
  }, []);

  function handleLogin(username, password) {
    fetch("https://cs571.org/api/f23/hw9/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
  }).then(res => {
    if (res.status === 401) {
      alert("Incorrect login, please try again")
    }
    if (res.status === 200) {
      alert("You have successfully logged in")
      setIsLoggedIn(true);
      return res.json()
    }
  }).then(data => {
    SecureStore.setItemAsync('jwt', data.token)
    SecureStore.setItemAsync('username', username)
    setIsGuest(false)
  })
  }

  function handleSignup(username, password) {
    fetch("https://cs571.org/api/f23/hw9/register", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
      },
      body: JSON.stringify({
          username: username,
          password: password
      })
  }).then(res => {
    if (res.status === 409) {
      alert("That username has already been taken")
    }
    if (res.status === 400) {
      alert("Please enter a password")
    }
    if (res.status === 200) {
      alert("You have successfully registered")
      setIsLoggedIn(true);
      return res.json()
    }
  }).then(data => {
    SecureStore.setItemAsync('jwt', data.token)
    SecureStore.setItemAsync('username', username)
    setIsGuest(false)
  })
  }

  function handleLogout() {
    SecureStore.deleteItemAsync('jwt').then(SecureStore.deleteItemAsync('username')).then(() => {
    alert("You have successfully logged out")
    setIsRegistering(false)
    setIsLoggedIn(false)
    })
    
  }

  if (isLoggedIn | isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            })
          }
          {isGuest ?
            <ChatDrawer.Screen name="Signup">{
              (props) => <BadgerConversionScreen {...props} setIsGuest={setIsGuest} setIsRegistering={setIsRegistering} />
            }</ChatDrawer.Screen>
            :
            <ChatDrawer.Screen name="Logout">{
              (props) => <BadgerLogoutScreen {...props} doExit={handleLogout} />
            }</ChatDrawer.Screen>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsGuest={setIsGuest} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>
  }
}