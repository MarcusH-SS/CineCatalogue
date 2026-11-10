

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
  onLogin: (email: string, password: string) => Promise<void>;
  onGoToRegister: () => void;
}

export default function LoginScreen({
  onLogin,
  onGoToRegister,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');
  
    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha.');
      return;
    }
  
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    if (!emailValid) {
      setError('Digite um e-mail válido.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      await onLogin(email.trim().toLowerCase(), password);
    } catch (error) {
      const code = (error as { code?: string }).code;
  
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setError('E-mail ou senha incorretos. Verifique seus dados.');
      } else if (code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde um pouco e tente novamente.');
      } else if (code === 'auth/network-request-failed') {
        setError('Falha na conexão. Verifique sua internet.');
      } else {
        setError('Não foi possível entrar. Tente novamente.');
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
            CINE<Text style={styles.gold}>+</Text>
          </Text>
          <Text style={styles.subtitle}>FILMES E TRADUÇÕES</Text>
        </View>

        <Text style={styles.title}>Bem-vindo de volta!</Text>

        <Text style={styles.description}>
          Entre para descobrir filmes e explorar sinopses em outros idiomas.
        </Text>

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPassword}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
  style={styles.button}
  onPress={handleLogin}
  activeOpacity={0.8}
  disabled={isLoading}
>
  <Text style={styles.buttonText}>
    {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={onGoToRegister}
        >
          <Text style={styles.registerText}>
            Ainda não tem conta? <Text style={styles.gold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Sua experiência com filmes começa aqui.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logo: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 3,
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: colors.textSubtle,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: radius.md,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#453960',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#453960',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 15,
    fontSize: 15,
  },
  showPassword: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 13,
    paddingLeft: 8,
  },
  error: {
    color: colors.errorText,
    fontSize: 13,
    marginBottom: 15,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 22,
  },
  registerText: {
    color: colors.textSubtle,
    fontSize: 13,
  },
  footer: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 25,
  },
});
