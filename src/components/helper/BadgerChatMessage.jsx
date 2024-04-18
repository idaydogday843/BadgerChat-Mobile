import { Text, Button } from "react-native";
import BadgerCard from "./BadgerCard"
import { useState } from "react";
import * as SecureStore from 'expo-secure-store';

function BadgerChatMessage({props, onDelete}) {

    const dt = new Date(props.created);
    const [myPost, setMyPost] = useState(false)
    SecureStore.getItemAsync('username').then(result => {
        if (result === props.poster) {
            setMyPost(true)
        }
    })

    const handleDelete = () => {
        onDelete(props)
    }

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {myPost ? 
        <Button color="crimson" title="DELETE POST" onPress={handleDelete}/> : <></>}
    </BadgerCard>
}

export default BadgerChatMessage;