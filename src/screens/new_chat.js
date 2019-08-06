import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Picker, Item, Text} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat';
import Style from '../components/style';
import Loading from "../components/loading";
import SocketIOClient from 'socket.io-client';

class NewChat extends Component {
    static navigationOptions = {
        title: 'New Chat'
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            users: [],
            messages: [],
            selectedUser: 'Select user',
            userName: '',
        };
        this.socket = SocketIOClient(Style.host);
    }

    componentDidMount() {
        let userArray = [{_id: 'Select user', profile:{name: 'Select user'}}];
        AsyncStorage.getItem('userId').then(id => {
            fetch(Style.host + '/api/user/get/all').then(res => {
                JSON.parse(res._bodyText).users.map(item => {
                    if(item._id !== id) {
                        userArray.push(item);
                    } else {
                        this.setState({userName: item.profile.name});
                    }
                });
                this.setState({users: userArray, userId: id, isLoading: false});
            }).catch(err => alert(err));
        }).catch(err => alert(err));
    }

    onSend(messages = []) {
        let state = this.state;
        if(state.selectedUser === 'Select user') {
            alert('Select a user');
        } else {
            fetch(Style.host + '/api/chat/new/' + state.userId + '/' + state.selectedUser, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: messages[0].text})
            }).then(res => {
                this.socket.emit('create message', {data: `${state.userName} : ${messages[0].text}`, recipient: JSON.parse(res._bodyText).recipient});
                this.props.navigation.navigate('ChatRoom', {id: JSON.parse(res._bodyText).conversationId});
            }).catch(err => alert(err));
        }
    }

    pickerOnChange(user) {
        if(user !== 'Select user') {
            fetch(Style.host + '/api/chat/exist/' + this.state.userId + '/' + user).then(res => {
                if(JSON.parse(res._bodyText).length == 1) {
                    this.props.navigation.navigate('ChatRoom', {id: JSON.parse(res._bodyText).conversationId});
                } else {
                    this.setState({selectedUser: user});
                }
            }).catch(err => alert(err));
        }
    }

    renderChat() {
        if(this.state.users.length > 0) {
            return (
                <Container>
                    <Picker
                        iosHeader="Select"
                        mode="dialog"
                        selectedValue={this.state.selectedUser}
                        onValueChange={val => this.pickerOnChange(val)}
                    >
                        {this.state.users.map((user, i) => {
                            return <Item value={`${user._id}`} label={`${user.profile.name}`} key={i} />
                        })}
                    </Picker>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        placeholder='Type a message...'
                        user={{_id: this.state.userId}}
                    />
                </Container>
            );
        } else {
            return (
                <Container style={Style.centeredPage}>
                    <Text>No user</Text>
                </Container>
            );
        }
    }

    render() {
        if (this.state.users.length > 0) {
            return (this.renderChat());
        } else {
            return <Loading/>;
        }
    }
}

export default NewChat;
