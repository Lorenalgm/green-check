import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import logo from './assets/logo-green-check.png';
import iconeScanner from './assets/scanner.png';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [escaneado, setEscaneado] = useState(false);
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Solicitando permissão de acesso à câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Acesso à câmera não permitido.</Text>;
  }

  const gerenciaCodigoBarrasLido = ({ data }) => {
    setLoading(true);
    localizaProduto(data);
  };

  const localizaProduto = async (barcode) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const dados = await response.json();
      setEscaneado(false);
      setProduto(dados);
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  if(produto || loading){
    return(
      <View style={styles.container}>
         {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.overlayText}>Carregando...</Text>
            </View>
          )}
          {produto && <><Text>Código de barras escaneado!</Text>
          <Text>Produto: {produto.product.brands}</Text>
          <Text>Produto: {produto.product.image_front_small_url}</Text>
          <Image style={{width: '100%', height: '50%'}} source={{ uri: produto.product.image_front_small_url }} />
          {/* <Text style={styles.overlayText}>Impacto ambiental: {productData.product.environment_impact_level}</Text> */}
          <TouchableOpacity onPress={() => setProduto(null)}>
            <Text>Voltar</Text>
          </TouchableOpacity></>}
      </View>
    )
  }

  if(escaneado){
    return(
      <BarCodeScanner
        onBarCodeScanned={gerenciaCodigoBarrasLido}
        style={StyleSheet.absoluteFillObject} />
    )
  }

  return (
    <View style={styles.container}>
      <Image source={logo} />
      <View style={styles.conteudo}>
        <Image source={iconeScanner} />
        <View>
          <Text style={styles.titulo}>Comece escaneando</Text>
          <Text style={styles.descricao}>Aproxime seu celular do código de barras do produto</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.botaoLerCodigo} onPress={() => setEscaneado(true)}>
        <Text style={styles.textoLerCodigo}>Ler código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  conteudo: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '50%',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center'
  },
  botaoLerCodigo: {
    backgroundColor: '#83A901',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 10
  },
  textoLerCodigo: {
    fontWeight: 'bold',
    color: 'white'
  }
});