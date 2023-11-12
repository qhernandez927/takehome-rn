import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackScreens } from '../../App';

export default function Login({}: NativeStackScreenProps<
  StackScreens,
  'Login'
>) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput style={styles.inputs} placeholder="Username"></TextInput>
      <TextInput style={styles.inputs} placeholder="Password"></TextInput>
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
