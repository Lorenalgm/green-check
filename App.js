import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import logo from './assets/logo-green-check.png';
import iconeScanner from './assets/scanner.png';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={logo} />
      <View style={styles.conteudo}>
        <Image source={iconeScanner} />
        <View>
          <Text style={styles.titulo}>Comece scaneando</Text>
          <Text style={styles.descricao}>Aproxime seu celular do código de barras do produto</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.botaoLerCodigo}>
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