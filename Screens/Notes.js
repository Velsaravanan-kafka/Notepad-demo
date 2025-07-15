
 import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler
} from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedNote, setSelectedNote] = useState(null);

  const API_URL = 'https://notepad-api-sl05.onrender.com/notes'; 

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const backAction = () => {
      // If we are on the detail screen, go back to list
      if (currentScreen === 'detail') {
        setSelectedNote(null); // Clear selected note
        setCurrentScreen('list'); // Go back to list screen
        return true; // Return true to indicate that we've handled the back press
      }
      // If we are already on the list screen, let the default back action happen
      // (which is usually to exit the app on Android).
      return false; // Return false to let the OS handle the back press
    };

    // Add the event listener when the component mounts
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Remove the event listener when the component unmounts or currentScreen changes
    // This is important to prevent memory leaks and ensure correct behavior.
    return () => backHandler.remove();
  }, [currentScreen]); // Re-run effect if currentScreen changes


  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log('API Response Data:', res.data); // Keep this to verify fetched notes have _id
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const handleSaveNote = useCallback(async (content) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      // DEBUG LOG FOR CLEARING CONTENT
      console.log('Attempting to delete note by clearing content.');
      console.log('selectedNote at this point:', selectedNote);
      console.log('selectedNote._id at this point:', selectedNote ? selectedNote._id : 'N/A');

      // The condition needs to be just selectedNote && selectedNote._id
      // because _id is an object, not an empty string.
      if (selectedNote && selectedNote._id) { // Changed condition back to just checking for existence
        console.log('Calling handleDeleteNote from handleSaveNote (empty content) for ID:', selectedNote._id); // New debug log
        handleDeleteNote(selectedNote._id);
      } else {
        console.log("Navigating back from empty note (no delete)"); // Changed log message for clarity
        setTimeout(() => {
          setSelectedNote(null);
          setCurrentScreen('list');
        }, 100);
      }
      return;
    }

    // ... (rest of your working update/create logic in handleSaveNote)
    try {
        if (selectedNote && selectedNote._id) {
            const res = await axios.put(`${API_URL}/${selectedNote._id}`, {
                content: trimmedContent,
            });
            setNotes(prev =>
                prev.map(note =>
                    note._id === selectedNote._id ? res.data : note
                )
            );
        } else {
            const res = await axios.post(API_URL, {
                content: trimmedContent,
            });
            setNotes(prev => [res.data, ...prev]);
        }
    } catch (err) {
        console.error('Error saving note:', err);
    }

    setSelectedNote(null);
    setCurrentScreen('list');
  }, [selectedNote]);

  const handleDeleteNote = useCallback((idToDelete) => {
    console.log('--> handleDeleteNote EXECUTED. ID to delete:', idToDelete); // <-- CRITICAL LOG
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          console.log('--> Alert confirmed. Proceeding with deletion for ID:', idToDelete); // <-- CRITICAL LOG
          try {
            await axios.delete(`${API_URL}/${idToDelete}`);
            setNotes(prev => prev.filter(note => note._id !== idToDelete));
            setSelectedNote(null);
            setCurrentScreen('list');
          } catch (err) {
            console.error('Error deleting note:', err);
          }
        },
      },
    ]);
  }, []);

  const NoteItem = ({ note }) => {
    const title = note.content.split('\n')[0] || 'New Note';
    const date = note.updatedAt
      ? new Date(note.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
      : 'No Date';

    return (
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => {
          console.log('NoteItem pressed. Setting selectedNote to:', note); // Verify what's set
          setSelectedNote(note);
          setCurrentScreen('detail');
        }}
      >
        <Text style={styles.noteItemTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.noteItemDate}>{date}</Text>
      </TouchableOpacity>
    );
  };

  const NoteListScreen = () => {
    const [searchText, setSearchText] = useState('');
    const filtered = notes.filter(note =>
      note.content.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.listContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedNote(null);
              setCurrentScreen('detail');
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          data={filtered.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))}
          keyExtractor={(item) => item._id || item.content}
          renderItem={({ item }) => <NoteItem note={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No notes yet. Tap '+' to add one!</Text>
          )}
        />
      </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  };

  const NoteDetailScreen = () => {
    const [noteContent, setNoteContent] = useState(selectedNote ? selectedNote.content : '');
    const textInputRef = useRef(null);
    useEffect(() => {
      textInputRef.current?.focus();
    }, [selectedNote]);

    console.log('NoteDetailScreen rendered. selectedNote:', selectedNote); // Verify selectedNote here
    console.log('NoteDetailScreen rendered. selectedNote._id:', selectedNote ? selectedNote._id : 'N/A');

    return (
      <SafeAreaView style={styles.detailContainer}>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        > */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => {
                console.log("handlesaved triggered"); // Keep your console.log here
                handleSaveNote(noteContent);
              }}
            >
              <Text style={styles.detailButtonText}>Done</Text>
            </TouchableOpacity>

            {selectedNote && selectedNote._id && ( // Condition for delete button visibility
              <TouchableOpacity
                style={[styles.detailButton, styles.deleteButton]}
                onPress={() => {
                  console.log('Calling handleDeleteNote from explicit button for ID:', selectedNote._id); // New debug log
                  handleDeleteNote(selectedNote._id);
                }}
              >
                <Text style={[styles.detailButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            ref={textInputRef}
            style={styles.noteInput}
            multiline
            placeholder="Start typing..."
            placeholderTextColor="#AAA"
            value={noteContent}
            onChangeText={setNoteContent}
            textAlignVertical="top"
            autoCorrect
            spellCheck
          />
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.appContainer}>
      {currentScreen === 'list' ? <NoteListScreen /> : <NoteDetailScreen />}
    </View>
  );
}



const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  searchBar: {
    height: 40,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    fontSize: 16,
    color: '#333',
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  noteItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  noteItemDate: {
    fontSize: 14,
    color: '#888',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 20,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  deleteButton: {
    marginLeft: 'auto',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  noteInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
});
