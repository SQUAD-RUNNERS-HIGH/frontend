import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface InputProps {
  type?: string;
  placeholder: string;
  value: string | number; // Controlled Component로 변경
  role?: 'search' | 'password';
  isImg?: boolean; // Input에 이미지 추가 여부 ex)password, search
  onChange: (text: string) => void; // React Native에서는 text만 반환
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  role,
  onChange,
  isImg = false,
}: InputProps) {
  // Input Focus Border Control
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Show Password Control
  const [inputType, setInputType] = useState(type);
  const togglePWVisibility = () => {
    setInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? '#007AFF' : '#D1D5DB' },
      ]}
    >
      <TextInput
        onChangeText={onChange}
        value={value?.toString()} // 숫자일 경우 문자열로 변환
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={inputType === 'password'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.input}
        keyboardType={type === 'number' ? 'numeric' : 'default'} // type이 'number'일 때 numeric keyboard 적용
      />

      {isImg && (
        <TouchableOpacity onPress={role === 'password' ? togglePWVisibility : undefined}>
          <Image
            source={
              role === 'search'
                ? require('../../assets/images/search.png')
                : inputType === 'password'
                ? require('../../assets/images/visibility_off.png')
                : require('../../assets/images/visibility.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    color: "#6B7280",
    fontSize: 16,
    fontWeight: 400,
    lineHeight:24,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});
