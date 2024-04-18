import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repeat, setRepeat] = useState("")

    function warning() {
        if (password === '') {
            return <Text style={{color:"red"}}>Please enter a password</Text>
        }
        else if (password !== repeat) {
            return <Text style={{color:"red"}}>Passwords do not match</Text>
        }
        return <></>
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={text => setUsername(text)} value={username}/>
        <Text>Password</Text>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={text => setPassword(text)} value={password}/>
        <Text>Confirm Password</Text>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={text => setRepeat(text)} value={repeat}/>
        {
            warning()
        }
        <Button color="crimson" title="Signup" disabled={password === '' || password !== repeat} onPress={() => {
            if (password === '') {
                Alert.alert("Please enter a password");
            }
            if (password !== repeat) {
                alert("Passwords do not match")
            }
            else {
                props.handleSignup(username, password)
            }
        }} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;