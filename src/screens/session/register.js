import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { Container, Content, Form, Input, Item, Label, Button, Text } from 'native-base';
import Style from '../../components/style';
//
class Register extends Component {
    static navigationOptions = {
        title: 'Register'
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mail: '',
            password: '',
            repassword: '',
            disabled: false
        };
        this.loginSuccess = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Main'})
            ]
        });
    }

    register() {
        this.setState({disabled: true});
        let state = this.state;
        if (state.name !== "" && state.mail !== "" && state.password !== "") {
            if (state.password === state.repassword) {
                let user = {
                    name: state.name,
                    mail: state.mail,
                    password: state.password
                };
                fetch(Style.host + '/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: user.mail, password: user.password, name: user.name})
                }).then(res => res.json()).then(res => {
                    if (res.exist == 1) {
                        alert('That mail address is already in use.');
                        this.setState({disabled: false});
                    } else {
                        AsyncStorage.setItem('isLogin', JSON.stringify({mail: user.mail, password: user.password}));
                        AsyncStorage.setItem('userId', res.id);
                        this.props.navigation.dispatch(this.loginSuccess);
                    }
                }).catch(err => alert(err));
            } else {
                alert('Passwords are not the same');
                this.setState({disabled: false});
            }
        } else {
            alert('Do not leave fields blank');
            this.setState({disabled: false});
        }
    }

    render() {
        return (
            <Container>
                <Content padder>
                    <Form>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Name</Label>
                            <Input value={this.state.name} onChangeText={text => this.setState({name: text})} autoCorrect={false}/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Mail</Label>
                            <Input value={this.state.mail} keyboardType="email-address" onChangeText={text => this.setState({mail: text})} autoCorrect={false} autoCapitalize='none'/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Password</Label>
                            <Input value={this.state.password} onChangeText={text => this.setState({password: text})} autoCorrect={false}secureTextEntry={true}/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Again Password</Label>
                            <Input value={this.state.repassword}
                                   onChangeText={text => this.setState({repassword: text})} secureTextEntry={true}/>
                        </Item>
                        <Button onPress={() => this.register()} disabled={this.state.disabled} block style={{backgroundColor: Style.color, marginTop: 45}}>
                            <Text style={{color: '#fff'}}>Register</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.goBack()} block style={{backgroundColor: Style.color, marginTop: 25}}>
                            <Text style={{color: '#fff'}}>Login</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default Register;
