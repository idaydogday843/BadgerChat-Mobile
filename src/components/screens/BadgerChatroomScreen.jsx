import { Alert, Modal, StyleSheet, Text, View, ScrollView, Button, TextInput } from "react-native";
import { useEffect, useState } from "react";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    // const [JWT, setJWT] = useState('')
    function loadMessages() {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
            }
        }).then(res => res.json()).then(data => {
            // console.log(props.name)
            setMessages(data.messages)
        })
    }

    useEffect(loadMessages, [page])

    function post() {
        SecureStore.getItemAsync('jwt').then(result => {
            // console.log(result)
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${result}`,
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
            },
            body: JSON.stringify({
                title: title,
                content: body
            })
        }).then(res => {
            // console.log(res.status)
            alert("Successfully posted!");
            setPage(1)
            loadMessages();
    })})
    .then(setModalVisible(false)).then(setBody('')).then(setTitle(''))
    }
    const handleDelete = (message) => {
        SecureStore.getItemAsync('jwt').then(result => {
            fetch(`https://cs571.org/api/f23/hw9/messages?id=${message.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${result}`,
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_9e261082708e6b61cd4c7f0275ac08b9a6821b730bfbe5510a08e9d6b65a4707"
            },
    }).then(res => {
        alert("Successfully Deleted");
        setPage(1)
        loadMessages()
      })
    })
    }

    return <View style={{ flex: 1 }}>
        <Modal
        style={styles.centeredView}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text>Create A Post</Text>
            <Text>Title</Text>
            <TextInput style={styles.titleinput} onChangeText={text => setTitle(text)} value={title}/>
            <Text>Body</Text>
            <TextInput style={styles.bodyinput} onChangeText={text => setBody(text)} value={body}/>
            <Button title="CREATE POST" disabled={(title==='' || body==='')} onPress={post}/>
            <Button title="CANCEL" onPress={() => setModalVisible(!modalVisible)}/>
            </View>
            </View>
        </Modal>
        <ScrollView>
        {messages.length > 0 ?
            messages.map(message => {
                return <BadgerChatMessage key={message.id} props={message} id={message.id} title={message.title} poster={message.poster} content={message.content} created={message.created} onDelete={handleDelete}/>
            })
            :
            <Text>There's nothing here!</Text>
        }
        </ScrollView>
        <Text>You are on page {page} of 4.</Text>
        <Button title="PREVIOUS PAGE" disabled={page===1} onPress={() => setPage(page => page - 1)}/>
        <Button title="NEXT PAGE" disabled={page===4} onPress={() => setPage(page => page + 1)}/>
        {props.isGuest ?
        <></>
        :
            <Button color="crimson" title="ADD POST" onPress={() => setModalVisible(true)}/>
        }
    </View>
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    titleinput: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    bodyinput: {
        height: 100,
        width: 200,
        margin:12,
        borderWidth: 1,
        padding: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
});

export default BadgerChatroomScreen;