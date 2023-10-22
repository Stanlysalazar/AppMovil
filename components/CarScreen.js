import { View, Text, FlatList, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Card } from "react-native-paper";
import React, { useEffect, useState } from "react";

// Importa Firebase Database
import { getDatabase, ref, push, onValue } from "firebase/database";

// Importa Firebase si aún no lo has hecho
import { initializeApp } from "firebase/app";

// Importa la configuración de Firebase desde firebaseConfig.js
import { firebaseConfig } from "../firebaseConfig"; // Asegúrate de usar la ruta correcta

const app = initializeApp(firebaseConfig);

export default function CarScreen({ navigation, route }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      placa: "",
      marca: "",
      estado: "disponible",
    },
  });
  const [carros, setCarros] = useState([]);

  // Función para guardar un carro en Firebase
  const guardarCarro = (data) => {
    const db = getDatabase(app);
    const carrosRef = ref(db, "carros");

    push(carrosRef, data)
      .then(() => {
        // Limpia el formulario después de guardar
        reset();
      })
      .catch((error) => {
        console.error("Error al guardar el carro:", error);
      });
  };

  // Función para obtener la lista de carros desde Firebase
  const obtenerCarros = () => {
    const db = getDatabase(app);
    const carrosRef = ref(db, "carros");

    onValue(carrosRef, (snapshot) => {
      if (snapshot.exists()) {
        const carrosData = snapshot.val();
        const carrosArray = [];
        for (const key in carrosData) {
          if (carrosData.hasOwnProperty(key)) {
            const carro = carrosData[key];
            carrosArray.push({ id: key, ...carro });
          }
        }
        setCarros(carrosArray);
      } else {
        setCarros([]);
      }
    });
  };

  useEffect(() => {
    // Carga la lista de carros al cargar la pantalla
    obtenerCarros();
  }, []);

  const handleNavigateToRentCar = () => {
    navigation.navigate("RentScreen"); // Cambia "RentCar" por el nombre de tu pantalla de alquiler
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.formContainer}>
        <Text>Bienvenid@ {route.params.email}</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Placa"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="placa"
        />
        {errors.placa && (
          <Text style={{ color: "red" }}>La placa es requerida.</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Marca"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="marca"
        />
        {errors.marca && (
          <Text style={{ color: "red" }}>La marca es requerida.</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Estado (disponible o no disponible)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="estado"
        />
        {errors.estado && (
          <Text style={{ color: "red" }}>El estado es requerido.</Text>
        )}
        
      </View>
      <View style={styles.listaContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Lista de Carros
        </Text>
        <FlatList
          data={carros}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ margin: 10 }}>
              <Card.Title title={item.marca} subtitle={`Placa: ${item.placa}`} />
              <Card.Content>
                <Text>Estado: {item.estado}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
      <Button
          style={{ marginTop: 20, backgroundColor: "powderblue" }}
          icon="content-save"
          mode="outlined"
          onPress={handleSubmit(guardarCarro)}
        >
          Guardar Carro
        </Button>
      <Button
        style={{ marginTop: 20, backgroundColor: "orange" }}
        icon="car"
        mode="outlined"
        onPress={handleNavigateToRentCar}
      >
        Alquilar Carro
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
  },
  listaContainer: {
    flex: 2,
    padding: 20,
  },
});
