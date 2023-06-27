import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import logo from './assets/logo-green-check.png';
import iconeScanner from './assets/scanner.png';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [possuiPermissao, setPossuiPermissao] = useState(null);
  const [escaneado, setEscaneado] = useState(false);
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Envia para o usuário permitir o acesso à câmera
  useEffect(() => {
    const solicitaPermissaoParaEscanear = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPossuiPermissao(status === 'granted');
    };

    solicitaPermissaoParaEscanear();
  }, []);

  const localizaProduto = async ({ data }) => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
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

  // Alertas para o usuário sobre a permissão da câmera
  if (possuiPermissao === null) {
    return <Text>Solicitando permissão de acesso à câmera...</Text>;
  }
  if (possuiPermissao === false) {
    return <Text>Acesso à câmera não permitido.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={logo} />

      {/* Abre a câmera para escanear */}
      {escaneado && <BarCodeScanner
        onBarCodeScanned={localizaProduto}
        style={StyleSheet.absoluteFillObject} />}

      {/* Carregando a leitura do código de barras */}
      {loading && 
      <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.overlayText}>Carregando...</Text>
      </View>}

      {/* Produto foi lido e os detalhes exibidos  */}
      {produto && <><Text>Código de barras escaneado!</Text>
          <Text>Produto: {produto.product.brands}</Text>
          <Image style={{width: '100%', height: '50%'}} source={{ uri: produto.product.image_front_small_url }} />
          {/* <Text style={styles.overlayText}>Impacto ambiental: {productData.product.environment_impact_level}</Text> */}
          <TouchableOpacity onPress={() => setProduto(null)}>
            <Text>Voltar</Text>
          </TouchableOpacity>
      </>}

      {/* Tela inicial */}
      {!escaneado && !produto && <><View style={styles.conteudo}>
        <Image source={iconeScanner} />
        <View>
          <Text style={styles.titulo}>Comece escaneando</Text>
          <Text style={styles.descricao}>Aproxime seu celular do código de barras do produto</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.botaoLerCodigo} onPress={() => setEscaneado(true)}>
        <Text style={styles.textoLerCodigo}>Ler código</Text>
      </TouchableOpacity>
      </>}
    </View>
  );
}

// Estiliza nossa tela conforme o design
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