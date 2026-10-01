import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';

export const LoginScreen: React.FC = () => {
  const isPhone = VARIANT.authField === 'phone';
  const defaultVal = isPhone ? `09${STUDENT.mssv}` : `${STUDENT.mssv}@iuh.edu.vn`;
  const [inputValue, setInputValue] = useState(defaultVal);
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login(inputValue);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.brandTitle}>KTXGO</Text>
          <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={isPhone ? `Số điện thoại — 09${STUDENT.mssv}` : `Email — ${STUDENT.mssv}@iuh.edu.vn`}
              placeholderTextColor={theme.textLight}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          <Text style={styles.authStackHint}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'space-between',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.primary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.textLight,
    marginTop: 8,
    marginBottom: 40,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '500',
    padding: 0,
  },
  loginButton: {
    width: '100%',
    backgroundColor: theme.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  authStackHint: {
    fontSize: 13,
    color: theme.textLight,
    marginTop: 24,
  },
});

export default LoginScreen;
