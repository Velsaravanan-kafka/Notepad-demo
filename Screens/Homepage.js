import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  // Removed unused imports: ScrollView, Image, Dimensions
  Platform, // Import Platform to handle potential web-specific header back button if needed
} from 'react-native';

function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Optional: Top Bar for Back Button if needed elsewhere */}
      {/* If you have a global navigation header that includes a back button,
          this View would typically be handled by your navigation library.
          For a standalone 'Home' screen, you might not have a back button.
          If you DO need a back button here, keep the original header structure.
          For now, I'm assuming the primary header is what you just showed me.
      */}
      <View style={styles.topBar}>
        {/* Example: A simple back button if this Home screen is part of a larger flow */}
        {/* You might conditionally render this based on canGoBack() from navigation */}
      </View>


      {/* Main Content Area: N Logo, Title, and Buttons */}
      <View style={styles.mainContent}>
        {/* N Logo - Centered and above the text */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>N</Text>
        </View>

        <Text style={styles.appTitle}>React Native Starter App</Text>

        <TouchableOpacity style={[styles.touch, { backgroundColor: 'blue' }]} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touch, { backgroundColor: 'brown' }]} onPress={() => navigation.navigate('Notes')}>
          <Text style={styles.buttonText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.touch, { backgroundColor: 'white' }]} onPress={() => alert('Under construction')}>
          <Text style={[styles.buttonText, { color: 'black' }]}>Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ivory',
    flex: 1,
    // No specific justify/align here, let children manage their own space
  },
  // --- Optional: Top Bar for a standalone back button ---
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align back button to the start
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor:'red'
    // backgroundColor: 'white', // Uncomment if you want a distinct background
    // If you don't need a back button on this Home screen, you can remove this topBar View entirely
  },
  backButton: {
    paddingVertical: 5,
    paddingRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
  },
  // --- End Optional Top Bar ---

  mainContent: {
    flex: 1, // Takes up remaining vertical space
    justifyContent: 'center', // **Vertically centers its content**
    alignItems: 'center', // **Horizontally centers its content**
    paddingTop: 0, // Reset any previous padding top if you had it
    paddingBottom: 50, // Add padding at the bottom if needed to keep content from very bottom
  },
  iconContainer: {
    width: 80, // Slightly larger for prominence
    height: 80,
    borderRadius: 40, // Half of width/height for perfect circle
    backgroundColor: 'darkblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // **Adjust this to control space between N and title**
    shadowOpacity: 0.75,
    shadowRadius: 3.5,
    shadowColor: 'silver',
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  iconText: {
    color: 'white',
    fontSize: 40, // Larger 'N'
    fontWeight: 'bold',
    lineHeight: 80, // Match container height for vertical centering
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '900', // Use '900' for extra bold
    marginBottom: 20, // Space below title, before buttons
    textAlign: 'center', // Ensure title is centered if it wraps
    paddingHorizontal: 10, // Prevent title from hugging screen edges
  },
  touch: {
    padding: 15, // Slightly more padding for touch area
    marginVertical: 8, // Reduce vertical margin slightly for tighter grouping
    borderRadius: 40,
    width: '80%', // Use percentage for responsiveness
    maxWidth: 350, // Optional: maximum width for very wide screens
    alignItems: 'center',
    shadowOpacity: 0.7, // Slightly less aggressive shadow for buttons
    shadowRadius: 3,
    shadowColor: 'magenta',
    shadowOffset: {
      width: 0,
      height: 3, // Slight vertical shadow
    },
    elevation: 3, // Android shadow
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'normal', // Standard fontWeight
  },
});

export default Home;