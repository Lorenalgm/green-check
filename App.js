import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import logo from './assets/logo-green-check.png';
import iconeScanner from './assets/scanner.png';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';

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
        style={[StyleSheet.absoluteFillObject]}
      />}

      {/* Carregando a leitura do código de barras */}
      {loading && 
      <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text>Carregando...</Text>
      </View>}

      {/* Produto foi lido e os detalhes exibidos  */}
      {produto && !loading && <View style={styles.containerCodigoLido}>
          <View style={styles.containerProduto} >
            <View>
              <Image style={styles.logoProduto} source={{ uri: produto.product.image_url }} />
              <Text style={styles.tituloProduto}>{produto.product?.product_name}</Text>
            </View>
            <View style={styles.grupoTopicoProduto}>
              <Text style={styles.textoTopicoProduto}>Impacto Ambiental</Text>
              <Text>Eco Score: Letra {produto.product.ecoscore_grade}</Text>
              <Text>Eco Score: Letra {produto.product.ecoscore_grade}</Text>
            </View>
            <View style={styles.grupoTopicoProduto}>
              <Text style={styles.textoTopicoProduto}>Valores nutricionais</Text>
              <Text>Score: {produto.nutriscore_data?.grade?produto.nutriscore_data.grade: 'Não definido'} </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.botao} onPress={() => setProduto(null)}>
            <Text style={styles.textoBotao}>Voltar</Text>
          </TouchableOpacity>
      </View>}

      {/* Tela inicial */}
      {!escaneado && !produto && <View style={styles.containerPaginaInicial}>
      <View style={styles.conteudo}>
        <Image source={iconeScanner} />
        <View>
          <Text style={styles.titulo}>Escaneie um produto</Text>
          <Text style={styles.descricao}>Aproxime seu celular do código de barras {"\n"} para obter informações sustentáveis</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.botao} onPress={() => setEscaneado(true)}>
        <Text style={styles.textoBotao}>Escanear produto</Text>
      </TouchableOpacity>
      </ View>}
    </View>
  );
}

// Estiliza nossa tela conforme o design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  containerPaginaInicial: {
    flex: 1,
    justifyContent: 'space-around',
  },
  conteudo: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 400,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center'
  },
  descricao:{
    textAlign: 'center'
  },  
  botao: {
    backgroundColor: '#83A901',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  textoBotao: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16
  },
  containerCodigoLido:{
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  containerProduto: {
    justifyContent: 'space-around', 
    height: '70%'
  },
  tituloProduto: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
  },
  logoProduto: {
    width: 200,
    height: 200,
  },
  grupoTopicoProduto: {
    flex: 1,
    gap: 10,
  },
  textoTopicoProduto: {
    fontWeight: 'bold',
    fontSize: 18
  }
});