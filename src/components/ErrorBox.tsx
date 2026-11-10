import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.errorBg, borderColor: colors.errorBorder, borderWidth: 1, borderRadius: radius.md, padding: 16 },
  text: { color: colors.errorText, fontSize: 15, lineHeight: 22 },
});
