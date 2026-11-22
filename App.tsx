import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Network from 'expo-network';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';

import { auth } from './src/services/firebase';
import { loginUser, registerUser } from './src/services/auth';
import {
  initLocalAuthDB,
  LocalUser,
  loginOffline,
  saveUserLocally,
} from './src/services/sqliteAuth';

import { colors } from './src/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'login' | 'register'
  >('login');

  const [loggedScreen, setLoggedScreen] = useState<'home' | 'favorites'>('home');

  const [user, setUser] = useState<User | null>(null);
  const [offlineUser, setOfflineUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // Inicializa o SQLite e verifica automaticamente se existe sessão ativa no Firebase
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function initialize() {
      try {
        await initLocalAuthDB();
        if (cancelled) return;

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            setOfflineUser(null);
          } else {
            setLoggedScreen('home');
          }
          setLoading(false);
        });
      } catch (error) {
        if (cancelled) return;
        setInitializationError(
          error instanceof Error ? error.message : 'Erro desconhecido.'
        );
        setLoading(false);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // Verifica se há internet disponível
  async function checkIsOnline(): Promise<boolean> {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  }

  // Cadastro híbrido (Firebase + cache local no SQLite)
  async function handleRegister(
    name: string,
    email: string,
    password: string
  ) {
    const isOnline = await checkIsOnline();

    if (isOnline) {
      await registerUser(name, email, password);
      await saveUserLocally(
        name,
        email,
        password,
        auth.currentUser?.uid ?? null,
        1
      );
      return;
    }

    // Cadastro offline local
    await saveUserLocally(name, email, password, null, 0);
    const created = await loginOffline(email, password);
    setOfflineUser(created);
  }

  // Login híbrido (Firebase com fallback para SQLite)
  async function handleLogin(email: string, password: string) {
    const isOnline = await checkIsOnline();

    if (isOnline) {
      try {
        await loginUser(email, password);
        await saveUserLocally(
          auth.currentUser?.displayName || email.split('@')[0],
          email,
          password,
          auth.currentUser?.uid ?? null,
          1
        );
        return;
      } catch (error: any) {
        if (error?.code !== 'auth/network-request-failed') {
          throw error;
        }
      }
    }

    const localAccount = await loginOffline(email, password);
    if (!localAccount) {
      throw new Error(
        'Sem conexão com a internet e nenhuma conta local encontrada para essas credenciais.'
      );
    }

    setOfflineUser(localAccount);
  }

  async function handleLogout() {
    if (user) {
      await signOut(auth);
    }

    setOfflineUser(null);
    setLoggedScreen('home');
  }

  if (initializationError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Não foi possível inicializar o banco de dados local: {initializationError}
        </Text>
      </View>
    );
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

  // Se existir usuário autenticado (online ou offline), alterna entre Favoritos e Home
  if (user || offlineUser) {
    const activeUserId = user?.uid ?? offlineUser?.uid ?? null;

    if (loggedScreen === 'favorites') {
      return (
        <FavoritesScreen
          userId={activeUserId}
          onBackToHome={() => setLoggedScreen('home')}
        />
      );
    }

    return (
      <HomeScreen
        onOpenFavorites={() => setLoggedScreen('favorites')}
        onLogout={handleLogout}
        userId={activeUserId}
      />
    );
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