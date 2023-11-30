import React, { ReactNode } from 'react';
import { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { StackScreens } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type loginInfoProps = {
  username: string;
  password: string;
};

export type newUserInfoProps = {
  username: string;
  displayname: string;
  password: string;
};

export type AuthContextType = {
  signIn: (loginInfo: loginInfoProps) => Promise<void>;
  signUp: (newUserInfo: newUserInfoProps) => Promise<void>;
  signOut: () => Promise<void>;
  isAuth: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<StackScreens, 'Home'>;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);

  const authContextProvider: AuthContextType = {
    signIn: async (loginInfo: loginInfoProps) => {
      await fetch(`http://127.0.0.1:50000/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginInfo),
      })
        .then((response) => {
          response
            .json()
            .then((data) => {
              if (!response.ok) {
                console.error('Error:', response.status, response.statusText);
                return;
              } else {
                SecureStore.setItemAsync('SESSION-TOKEN', data.data.token);
                setIsAuth(true);

                console.log(data);
              }
            })
            .catch((jsonError) =>
              console.error('Error parsing JSON:', jsonError),
            );
        })
        .catch((e) => console.error(e));
    },
    signUp: async (newUserInfo: newUserInfoProps) => {
      await fetch(`http://127.0.0.1:50000/auth/register`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserInfo),
      })
        .then((response) => {
          response
            .json()
            .then((data) => {
              if (!response.ok) {
                console.log(data.message);
              } else {
                SecureStore.setItemAsync('SESSION-TOKEN', data.data.token);
                setIsAuth(true);
              }
            })
            .catch((jsonError) =>
              console.error('Error parsing JSON:', jsonError),
            );
        })
        .catch((e) => console.error(e));
    },
    signOut: async () => {
      await SecureStore.getItemAsync('SESSION-TOKEN').then((session) => {
        const sessionToken = session as string;
        const body = {
          token: session,
          isLoggedOut: true,
        };
        console.log(body);
        fetch(`http://127.0.0.1:50000/auth/logout`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            response
              .json()
              .then((data) => {
                if (!response.ok) {
                  console.log(data.message);
                } else {
                  SecureStore.deleteItemAsync(sessionToken);
                  if (!data.data.isAuth) {
                    setIsAuth(false);
                  }
                }
              })
              .catch((jsonError) =>
                console.error('Error parsing JSON:', jsonError),
              );
          })
          .catch((e) => console.error(e));
      });
    },
    isAuth: isAuth,
  };

  return (
    <AuthContext.Provider value={authContextProvider}>
      {children}
    </AuthContext.Provider>
  );
};
