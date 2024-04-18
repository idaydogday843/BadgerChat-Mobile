import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={text => setUsername(text)} value={username}/>
        <Text>Password</Text>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={text => setPassword(text)} value={password}/>
        <Button color="crimson" title="Login" onPress={() => {
            // Alert.alert("Hmmm...", "I should check the user's credentials first!");
            
            props.handleLogin(username, password)
        }} />
        <Text>New here?</Text>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue As Guest" onPress={() => props.setIsGuest(true)}/>
    </View>;
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerLoginScreen;