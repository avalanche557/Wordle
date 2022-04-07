import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import { CLEAR, colors, colorsToEmoji, ENTER } from './src/constants'
import Keyboard from './src/components/Keyboard';
import * as Clipboard  from 'expo-clipboard'
import { wordList } from './constant';

const NUMBER_OF_TRIES = 6;

const getDayOfTheYear = () => {
   const now = new Date();
   const start = new Date(now.getFullYear(), 0, 0);
   const diff = now - start;
   const oneDay = 1000*60*60*24
   const day = Math.floor(diff /oneDay);
   return day
}


const dayOfTheYear = getDayOfTheYear()
const words = wordList;


export default function App() {

  

  const word = words[dayOfTheYear];
  const letters = word.split('')

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill("")))
  const [curRow, setCurRow] = useState(0);
  const [curCol , setCurCol] = useState(0);
  const [gameState ,setGameState] = useState('playing') // won, lost, playing
  useEffect(() => {
    if(curRow > 0) {
      checkGameState()
    }
  }, [curRow])

  const checkGameState = () => {
    if(checkIfWon() && gameState !== 'won') {
      Alert.alert("Hurray", "You won", [{'text': 'Share', onPress: shareScore}]);
      setGameState('won')
    } else if(checkIfLost() && gameState !== 'lost') {
      Alert.alert("Mah!", "Try again tomorrow")
      setGameState('lost')
    }
  }

  const shareScore = () => {
    const textShare = rows.map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")).filter(row => row).join('\n')
    console.log(textShare)
    Clipboard.setString(textShare)
    Alert.alert("Score copied succesfully")
  }

  const checkIfWon = () => {
    const row = rows[curRow -1];
    return row.every((letter, i) =>  letter === letters[i])
  }
  const checkIfLost = () => {
    return  !checkIfWon() && curRow === rows.length
  }
  const onKeyPressed = (key) => {
    if(gameState === 'playing') {
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
    
  }

  const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])]
  }

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol
  }

  const getCellBGColor = (row, column) => {
    const letter = rows[row][column]
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

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color
    ))
  }

  const greenCaps = getAllLettersWithColor(colors.primary)

  const yelloCaps = getAllLettersWithColor(colors.secondary)
  const greyCaps = getAllLettersWithColor(colors.darkgrey)

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
      <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yelloCaps} greyCaps={greyCaps}/>
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
    marginTop: 20,
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
