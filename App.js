import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { CLEAR, colors, ENTER } from './src/constants'
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;

export default function App() {

  

  const word = "hello";
  const letters = word.split('')

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill("")))
  const [curRow, setCurRow] = useState(0);
  const [curCol , setCurCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRow = copyArray(rows)
    if(key === CLEAR) {
      const prevCol= curCol - 1
      if(prevCol >= 0) {
        updatedRow[curRow][prevCol] = "";
        setRows(updatedRow)
        setCurCol(prevCol)
      }
      return;
    }
    if( key === ENTER) {
      if(curCol === rows[0].length) {
        setCurRow(curRow+1)
        setCurCol(0)
      }
      return;
    }
    if(curCol < rows[0].length) {
      updatedRow[curRow][curCol] = key
      setRows(updatedRow)
      setCurCol(curCol+1)
    }
  }

  const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])]
  }

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol
  }

  const getCellBGColor = (row, column) => {
    const letter = rows[curRow][curCol]
    if(row >= curRow) {
      return colors.black
    }
    if(letter === letters[column]) {
      return colors.primary
    } 
    if(letters.includes(letter)) {
      return colors.secondary
    }
    return colors.darkgrey
  }

  const greenCaps = rows.map((row, i) =>  row.map((cell, j) => getCellBGColor(i, j) ) )
 
  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, key) => (
          <View style={styles.row} key={key}>
          {row.map((letter, index) => (
            <View key={index} style={
              [
                styles.cells, 
                {borderColor: isCellActive(key, index) ? colors.lightgrey: colors.darkgrey},
                {backgroundColor: getCellBGColor(key, index)}
              ]
            }>
              <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
            </View>
          ))}
        </View>  
        ))}
      </ScrollView>
      <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={['c', 'd']}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.black
  },
  title:{
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7
  },
  map:{
    alignSelf: 'stretch',
    height: 100,
    marginTop: 20
    
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cells:{
    flex: 1,
    height: 30,
    borderWidth: 2,
    borderColor: colors.darkgrey,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellText:{
    color: colors.lightgrey,
    fontSize: 36,
    fontWeight: 'bold'
  }
});
