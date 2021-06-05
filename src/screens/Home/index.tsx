import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { LoginDataItem } from "../../components/LoginDataItem";
import { SearchBar } from "../../components/SearchBar";
import {
  Container,
  EmptyListContainer,
  EmptyListMessage,
  LoginList,
} from "./styles";

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);
  const keyAsyncStoragePassManager = "@passmanager:logins";

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    try {
      const value = await AsyncStorage.getItem(keyAsyncStoragePassManager);
      if (value !== null) {
        const parsedValue = value ? JSON.parse(value) : [];
        setData(parsedValue);
        setSearchListData(parsedValue);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível pegar os valores.");
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  function handleFilterLoginData(search: string) {
    const filter = data.filter(({ title }) => title === search);
    setSearchListData(filter);
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        }
        renderItem={({ item: loginData }) => {
          return (
            <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          );
        }}
      />
    </Container>
  );
}
