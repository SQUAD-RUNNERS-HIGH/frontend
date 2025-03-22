import { Control, ControllerRenderProps } from "react-hook-form";
import Input from "../Input";
import { StyleSheet,Text } from "react-native";
interface FormInputProps {
  errorMessage?: string;
  type?: string;
  placeholder: string;
  hideError?: boolean;
  field: ControllerRenderProps<any, string>;
}

export function StringInput({
  errorMessage,
  type = "text",
  placeholder,
  field,
  hideError,
}:FormInputProps){
  return (
              <>
                <Input
                  type={type}
                  placeholder={placeholder}
                  isImg
                  value={field.value} // 빈 문자열로 초기화
                  onChange={field.onChange}
                  
                />
                {!hideError && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
              </>
            );
}

const styles = StyleSheet.create({ 
  error: {
  fontSize: 14,
  color: "#EF4444",
},
});