import { Header } from "@react-navigation/elements";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,


} from 'react-native';

export default App = () =>{
      
    const[notes, setNotes] = useState([
        {id: 1, content: 'First code'},
        {id: 2, content: 'Second code'},
    ]);
    const[selectedNote, setSelected] = useState(null)
    const[currentScreen, setCurrent] = useState('list')

    const handlesave = (content) =>{
        const trimmedContent = content.trim();

        if(!trimmedContent){
            if(selectedNote && selectedNote.content !== ''){
                handleDelete(selectedNote.id);
            }
            else{
                setSelected(null)
                setCurrent('list')
            }
            return;
        }
        if(selectedNote && selectedNote.id){
            setNotes(prevNotes => 
                prevNotes.map(note => 
                    note.id === selectedNote.id ? {...note, content: trimmedContent}: note
                )
            )
        }
        else{
           const newNote  = {
                 id : Date.now().toString(),
                 content: trimmedContent,
            };
            setNotes(prevNotes => [newNote, ...prevNotes])
        }
            setSelected(null)
            setCurrent('list')

    }

    const handleDelete = (id) =>{
        Alert.alert(
            'Delete',
            'Are you sure',
            [
                {
                    style: 'cancel',
                    text: 'cancel'
                },
                {
                    style:'destructive',
                    text: 'delete',
                    onPress: ()=>{
                        setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
                        setSelected(null)
                        setCurrent('list')
                    }
                }
            ],

        )
    }

    const NoteItem = ({note}) =>{
        const title = note.content.split('/n')[0] || 'Newnote';

        return(
            <TouchableOpacity
            style = {korea.noteitem}
            onPress={()=> {
                setSelected(note)
                setCurrent('detail')
            }
            }>
            <Text style = {{ fontSize: 20}}>{title}</Text>
            </TouchableOpacity>
        )
    }

    const Notelist = () =>{
        const[searchText, setSearch] = useState('')
        const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(searchText.toLowerCase()))

        return(
           <SafeAreaView style = {korea.listcontainer}>
            <View style = {korea.Header}>
               <Text>Notes</Text>
               <TouchableOpacity
               onPress={()=>{
                setSelected(null)
                setCurrent('detail')
               }}>
                <Text style = {korea.circle}>+</Text>
               </TouchableOpacity>
               </View>
               <TextInput
               value={searchText}
               onChangeText={setSearch}
               />
               <FlatList
               data={filteredNotes}
               keyExtractor={item => item.id}
               renderItem={({item})=> <NoteItem note = {item}/>}
               />
           </SafeAreaView>
        )
    }

    const DetailScreen = () =>{
        const[content, setContent] = useState(selectedNote ? selectedNote.content: '')

        return(
            <SafeAreaView>
                <View style = {korea.Detailheader}>
                    <TouchableOpacity
                    onPress={()=> handlesave(content)}>
                        <Text style = {korea.Detailtext}>Done</Text>
                    </TouchableOpacity>
                    {selectedNote&& <TouchableOpacity
                    onPress={()=> handleDelete(selectedNote.id)}>
                        <Text style = {korea.Detailtext}>Delete</Text>
                    </TouchableOpacity>
                   }
                </View>
                <View style = {{margin: 20, backgroundColor:'aliceblue'}}>
                    <TextInput
                    multiline
                    style = {korea.Detailinput}
                    value = {content}
                    onChangeText={setContent}/>
                </View>
            </SafeAreaView>
        )
    }


    return(
         <View style = {{flex:1}}>
            {currentScreen == 'list'? <Notelist/> : <DetailScreen/>}
         </View>
    );
}

const korea = StyleSheet.create({
          listcontainer:{

            flex: 1,
            backgroundColor:'beige',
          },
          Header:{
             backgroundColor:'white', 
             justifyContent:'space-between',
             paddingVertical: 15,
             paddingHorizontal:20,
             //paddingLeft:10,
             flexDirection:'row',
             marginVertical: 20,
             marginHorizontal:20,
             alignItems:'center',
             borderBottomWidth:2
          },
          circle:{
             backgroundColor:'lightblue',
             paddingVertical: 10,
             paddingHorizontal:15,
            //  width: 40,
            //  height:40,
             justifyContent:'center',
             alignItems:'center',
             borderRadius: 20,

          },
          noteitem:{
              paddingvertical: 20,
              paddingHorizontal:20,
              backgroundColor:'ivory',
            //   marginVertical: 5,
            //  marginHorizontal:5,
            borderBottomWidth:1,
            borderBottomColor:'black'   

          },
          Detailheader:{
            backgroundColor:'grey',
            flexDirection:'row',
            justifyContent:'space-between',
            paddingVertical:15,
            paddingHorizontal:20,

          },
          Detailtext:{
              fontSize:20,
              color:'white',
          },
          Detailinput:{
             color:'grey',
             fontSize:20,
             fontWeight:'600'
          }



        
})