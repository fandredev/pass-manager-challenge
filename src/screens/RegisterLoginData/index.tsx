import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import { Button } from "../../components/Form/Button";
import { Input } from "../../components/Form/Input";
import { Container, Form, HeaderTitle } from "./styles";

interface FormData {
  title: string;
  email: string;
  password: string;
}
enum EnumRegister {
  navigateToHome = "Home",
  errorMessage = "Aconteceu um erro. Por favor, entre em contato com o suporte ou tente novamente mais tarde.",
}

const schema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório!"),
  email: Yup.string()
    .email("Não é um email válido")
    .required("Email é obrigatório!"),
  password: Yup.string().required("Senha é obrigatória!"),
});

export function RegisterLoginData() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const navigation = useNavigation();
  async function handleRegister(formData: FormData) {
    const keyAsyncStoragePassManager = "@passmanager:logins";
    const newLoginData = Object.freeze({
      id: String(uuid.v4()),
      ...formData,
    });
    try {
      const allData = await AsyncStorage.getItem(keyAsyncStoragePassManager);
      const currentData = allData ? JSON.parse(allData) : [];
      const spreadOldItems = [...currentData, newLoginData];
      await AsyncStorage.setItem(
        keyAsyncStoragePassManager,
        JSON.stringify(spreadOldItems)
      );
      reset();
      // navigation.navigate(EnumRegister.navigateToHome);
    } catch (error) {
      console.log(error);
      if (error) return Alert.alert(EnumRegister.errorMessage);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <Container>
        <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

        <Form>
          <Input
            title="Título"
            name="title"
            error={errors.title && errors.title.message}
            control={control}
            placeholder="Escreva o título aqui"
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            title="Email"
            name="email"
            error={errors.email && errors.email.message}
            control={control}
            placeholder="Escreva o Email aqui"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            title="Senha"
            name="password"
            error={errors.password && errors.password.message}
            control={control}
            secureTextEntry
            placeholder="Escreva a senha aqui"
          />

          <Button
            style={{
              marginTop: RFValue(26),
            }}
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
