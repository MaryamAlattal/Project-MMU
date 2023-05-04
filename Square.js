import React, {useState} from 'react';
import {View, Text,StyleSheet,SetClick, TextInput,Button} from 'react-native';

const Square= ({color='blue'}) =>{
  let [click,SetClick] = useState(false) 
  return( 
   <View onClick={()=>SetClick(true)}  style ={{...styles.Square,background:color, width:click?150:100, height:click? 150:100}}>

  </View>
  )
};
let styles = StyleSheet.create({
  Square:{
  
   }
});


export default Square;