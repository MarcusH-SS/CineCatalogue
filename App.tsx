
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { onAuthStateChanged, User } from 'firebase/auth';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

import { auth } from './src/services/firebase';
import { loginUser, registerUser } from './src/services/auth';

import { colors } from './src/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'login' | 'register'
  >('login');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica automaticamente se existe uma sessão ativa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Cadastro no Firebase
  async function handleRegister(
    name: string,
    email: string,
    password: string
  ) {
    await registerUser(name, email, password);
  }

  // Login no Firebase
  async function handleLogin(email: string, password: string) {
    await loginUser(email, password);
  }

  // Enquanto o Firebase verifica a sessão
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>
          Verificando sua conta...
        </Text>
      </View>
    );
  }

  // Se existir usuário autenticado, abre a tela principal
  if (user) {
    return <HomeScreen />;
  }

  // Tela de cadastro
  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegister={handleRegister}
        onBackToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  // Tela de login
  return (
    <LoginScreen
      onLogin={handleLogin}
      onGoToRegister={() => setCurrentScreen('register')}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 15,
    fontSize: 14,
  },
});
