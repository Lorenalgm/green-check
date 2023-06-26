import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    fetchProductData(data);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão de acesso à câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Acesso à câmera não permitido.</Text>;
  }

  const fetchProductData = async (barcode) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      console.log(barcode)
      setProductData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestartScan = () => {
    setScanned(false);
    setProductData(null);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {productData && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Código de barras escaneado!</Text>
          <Text style={styles.overlayText}>Produto: {productData.product.brands}</Text>
          <Button title="Voltar" onPress={handleRestartScan} />

          {/* <Text style={styles.overlayText}>Impacto ambiental: {productData.product.environment_impact_level}</Text> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});