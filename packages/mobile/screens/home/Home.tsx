import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackScreens } from '../../App';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

export default function Home({
  navigation,
}: NativeStackScreenProps<StackScreens, 'Home'>) {
  const { signOut } = useContext(AuthContext) as AuthContextType;
  const { isAuth } = useContext(AuthContext) as AuthContextType;
  const handleLoginPress = useCallback(
    () => navigation.navigate('Login'),
    [navigation?.navigate],
  );
  const handleRegisterPress = useCallback(
    () => navigation.navigate('Register'),
    [navigation?.navigate],
  );
  const handleWebviewPress = useCallback(
    () => navigation.navigate('App'),
    [navigation?.navigate],
  );

  return (
    <View style={styles.container}>
      {isAuth ? (
        <Button title="Logout" onPress={() => signOut()} />
      ) : (
        <Button title="Login" onPress={handleLoginPress} />
      )}
      {!isAuth ? (
        <Button title="Register" onPress={handleRegisterPress} />
      ) : null}
      <Button title="Skip to Webview" onPress={handleWebviewPress} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
