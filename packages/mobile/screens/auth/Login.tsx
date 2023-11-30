import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackScreens } from '../../App';
import { useState, useContext } from 'react';
import React from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

export type loginInfoProps = {
  username: string;
  password: string;
};

export default function Login({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Login'>) {
  const [loginInfoState, setLoginInfoState] = useState<loginInfoProps>({
    username: '',
    password: '',
  });

  const { signIn } = useContext(AuthContext) as AuthContextType;
  // async function login(loginInfo: loginInfoProps) {
  //   await fetch(`http://127.0.0.1:50000/auth/login`, {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify(loginInfo),
  //   })
  //     .then((response) => {
  //       response
  //         .json()
  //         .then((data) => {
  //           if (!response.ok) {
  //             return <Text>${data.message}</Text>;
  //           } else {
  //             return navigation.navigate('Home');
  //           }
  //         })
  //         .catch((jsonError) =>
  //           console.error('Error parsing JSON:', jsonError),
  //         );
  //     })
  //     .catch((e) => console.error(e));
  // }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={styles.inputs}
        onChangeText={(username) =>
          setLoginInfoState({ ...loginInfoState, username: username })
        }
        autoCapitalize="none"
        placeholder="Username"
      ></TextInput>
      <TextInput
        style={styles.inputs}
        onChangeText={(password) =>
          setLoginInfoState({ ...loginInfoState, password: password })
        }
        autoCapitalize="none"
        placeholder="Password"
      ></TextInput>
      <TouchableOpacity onPress={() => signIn(loginInfoState)}>
        <Text> Submit </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputs: {
    fontSize: 18,
    marginVertical: 2,
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 10,
    width: 250,
    height: 40,
    textAlign: 'center',
  },
});
