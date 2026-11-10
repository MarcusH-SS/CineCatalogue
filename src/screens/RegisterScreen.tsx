
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { colors, radius, spacing } from '../theme';

interface Props {
  onRegister: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  onBackToLogin: () => void;
}

export default function RegisterScreen({
  onRegister,
  onBackToLogin,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setError('');
  
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }
  
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    if (!emailValid) {
      setError('Digite um e-mail válido.');
      return;
    }
  
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      await onRegister(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );
    } catch (error) {
      const code = (error as { code?: string }).code;
  
      if (code === 'auth/email-already-in-use') {
        setError('Este e-mail já possui uma conta cadastrada.');
      } else if (code === 'auth/invalid-email') {
        setError('Digite um e-mail válido.');
      } else if (code === 'auth/weak-password') {
        setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else if (code === 'auth/network-request-failed') {
        setError('Falha na conexão. Verifique sua internet.');
      } else {
        setError('Não foi possível criar a conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
        <Text style={styles.logo}>
  Cine<Text style={styles.gold}>Catalogue</Text>
</Text>
          <Text style={styles.subtitle}>FILMES E TRADUÇÕES</Text>
        </View>

        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.description}>
          Cadastre-se para começar sua experiência.
        </Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          placeholderTextColor={colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
  style={styles.button}
  onPress={handleRegister}
  activeOpacity={0.8}
  disabled={isLoading}
>
  <Text style={styles.buttonText}>
    {isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToLogin}
        >
          <Text style={styles.backText}>
            Já possui uma conta? <Text style={styles.gold}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
  },
  gold: {
    color: colors.accent,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 5,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: colors.textSubtle,
    fontSize: 14,
    marginBottom: 24,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 14,
    borderRadius: radius.md,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#453960',
  },
  error: {
    color: colors.errorText,
    fontSize: 13,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  backText: {
    color: colors.textSubtle,
    fontSize: 13,
  },
});
