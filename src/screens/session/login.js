import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import {Container, Content, Form, Item, Label, Input, Button, Text} from 'native-base';
import Style from '../../components/style';
import Loading from '../../components/loading';

class Login extends Component {
    static navigationOptions = {
        title: "Login"
    };

    constructor(props) {
        super(props);
        this.state = {
            mail: "",
            password: "",
            isLoading: true,
            disabled: false
        };
        this.loginSuccess = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Main'})
            ]
        });
    }

    componentWillMount() {
        AsyncStorage.getItem('isLogin').then(data => {
            if(data !== null) {
                let user = JSON.parse(data);
                fetch(Style.host + '/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: user.mail, password: user.password})
                }).then(res => res.json()).then(res => {
                    if(res.login === 1) {
                        AsyncStorage.setItem('userId', res.id);
                        this.props.navigation.dispatch(this.loginSuccess);
                    } else {
                        AsyncStorage.removeItem('isLogin');
                        this.setState({isLoading: false, disabled: false});
                    }
                }).catch(err => alert(err));
            } else {
                this.setState({isLoading: false, disabled: false});
            }
        });
    }

    login() {
        this.setState({disabled: true});
        let state = this.state;
        if (state.mail !== '' || state.password !=='') {
            let user = {
                mail: state.mail,
                password: state.password
            };
            fetch(Style.host + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: user.mail, password: user.password})
            }).then(res => res.json()).then(res => {
                if(res.login === 1) {
                    AsyncStorage.setItem('isLogin', JSON.stringify(user));
                    AsyncStorage.setItem('userId', res.id);
                    this.props.navigation.dispatch(this.loginSuccess);
                } else {
                    alert('Invalid mail or password');
                    this.setState({disabled: false});
                }
            }).catch(err => console.log('fetch - ' + err));
        } else {
            alert('Do not leave fields blank');
            this.setState({disabled: false});
        }
    }

    render() {
        if(!this.state.isLoading) {
            return (
                <Container>
                    <Content padder>
                        <Form>
                            <Item style={Style.input.item} floatingLabel last>
                                <Label style={Style.input.label}>Email</Label>
                                <Input value={this.state.mail} keyboardType="email-address" onChangeText={text => this.setState({mail: text})} autoCapitalize='none' autoCorrect={false}/>
                            </Item>
                            <Item style={Style.input.item} floatingLabel last>
                                <Label style={Style.input.label}>Password</Label>
                                <Input value={this.state.password} onChangeText={text => this.setState({password: text})} autoCorrect={false} secureTextEntry={true}/>
                            </Item>
                            <Button onPress={() => this.login()} block style={{backgroundColor: Style.color, marginTop: 45}}>
                                <Text style={{color: '#fff'}}>Login</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate('Register')} block style={{backgroundColor: Style.color, marginTop: 25}}>
                                <Text style={{color: '#fff'}}>Register</Text>
                            </Button>
                        </Form>
                    </Content>
                </Container>
            );
        } else {
            return (
                <Loading/>
            );
        }
    }
}

export default Login;
