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
import { useContext, useState } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

export type newUserInfoProps = {
  username: string;
  displayname: string;
  password: string;
};

export default function Register({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Register'>) {
  const { signUp } = useContext(AuthContext) as AuthContextType;
  const [newUserInfoState, setNewUserInfoState] = useState<newUserInfoProps>({
    username: '',
    displayname: '',
    password: '',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={styles.inputs}
        onChangeText={(username) =>
          setNewUserInfoState({ ...newUserInfoState, username: username })
        }
        autoCapitalize="none"
        placeholder="Username"
      ></TextInput>
      <TextInput
        style={styles.inputs}
        onChangeText={(displayName) =>
          setNewUserInfoState({ ...newUserInfoState, displayname: displayName })
        }
        autoCapitalize="none"
        placeholder="Displayname"
      ></TextInput>
      <TextInput
        style={styles.inputs}
        onChangeText={(password) =>
          setNewUserInfoState({ ...newUserInfoState, password: password })
        }
        autoCapitalize="none"
        placeholder="Password"
      ></TextInput>
      <TouchableOpacity onPress={() => signUp(newUserInfoState)}>
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
