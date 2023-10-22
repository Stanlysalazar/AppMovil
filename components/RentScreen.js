import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { getDatabase, ref, get, set, push } from "firebase/database";

export default function RentScreen({ navigation }) {
  const [rentNumber, setRentNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [placa, setPlaca] = useState("");
  const [fecha, setFecha] = useState("");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const [carros, setCarros] = useState([]); // Estado para los carros disponibles
  const db = getDatabase(); // Inicialización de Firebase

  const handleRentCar = async () => {
    try {
      // Realiza las validaciones antes de rentar el carro
      const carrosRef = ref(db, "carros");
      // Obtén los datos de carros
      const carrosSnapshot = await get(carrosRef);
      const carrosData = carrosSnapshot.val();

      // Verifica que la placa exista y esté disponible
      if (!carrosData || !carrosData[placa] || carrosData[placa].estado !== "disponible") {
        setMessage("Carro no disponible para renta.");
        setMessageColor("red");
        return;
      }

      // Verifica que el usuario exista
      const usuariosRef = ref(db, "usuarios");
      const usuariosSnapshot = await get(usuariosRef);
      const usuariosData = usuariosSnapshot.val();

      if (!usuariosData || !usuariosData[userName]) {
        setMessage("Usuario no encontrado.");
        setMessageColor("red");
        return;
      }

      // Realiza la renta y guarda en Firebase
      const rentasRef = ref(db, "rentas");
      const nuevaRenta = {
        rentNumber,
        userName,
        placa,
        fecha,
      };

      // Utiliza 'push' para generar una clave única para cada renta
      const nuevaRentaRef = push(rentasRef);
      set(nuevaRentaRef, nuevaRenta);

      setMessage("Carro rentado con éxito.");
      setMessageColor("green");

      // Cambia el estado del carro a no disponible
      const carroRef = ref(db, `carros/${placa}`);
      set(carroRef, { ...carrosData[placa], estado: "no disponible" });
    } catch (error) {
      setMessage("Error al rentar el carro.");
      setMessageColor("red");
    }
  };

  const handleCarPress = (placa) => {
    setPlaca(placa);
  };

  // Función para cargar la lista de carros disponibles
  const cargarCarrosDisponibles = async () => {
    const carrosRef = ref(db, "carros");
    const carrosSnapshot = await get(carrosRef);
    const carrosData = carrosSnapshot.val();

    const carrosDisponibles = [];
    for (const placa in carrosData) {
      if (carrosData[placa].estado === "disponible") {
        carrosDisponibles.push({ placa, ...carrosData[placa] });
      }
    }

    setCarros(carrosDisponibles);
  };

  // Cargar la lista de carros disponibles cuando se carga la pantalla
  useEffect(() => {
    cargarCarrosDisponibles();
  }, []);

  return (
    <View>
      <Text>Alquiler de Carro</Text>
      <TextInput
        placeholder="Número de Renta"
        value={rentNumber}
        onChangeText={(text) => setRentNumber(text)}
      />
      <TextInput
        placeholder="Nombre de Usuario"
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />
      <TextInput
        placeholder="Placa del Carro"
        value={placa}
        onChangeText={(text) => setPlaca(text)}
      />
      <TextInput
        placeholder="Fecha"
        value={fecha}
        onChangeText={(text) => setFecha(text)}
      />
      <Button title="Rentar Carro" onPress={handleRentCar} />
      <Text style={{ marginTop: 5, color: messageColor }}>{message}</Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        Carros Disponibles:
      </Text>
      <FlatList
        data={carros}
        keyExtractor={(item) => item.placa}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCarPress(item.placa)}>
            <View>
              <Text>Placa: {item.placa}</Text>
              <Text>Marca: {item.marca}</Text>
              <Text>Estado: {item.estado}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
