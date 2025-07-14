import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

function Normal() {
  const navigation = useNavigation();
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header - pinned to top */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🔝 Header (Positioned)</Text>
      </View>

      {/* Body Scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Relative badge inside icon */}
        <View style={styles.iconWrapper}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/1177/1177568.png',
            }}
            style={styles.iconImage}
          />
          <Text style={styles.badge}>3</Text>
        </View>

        {/* Filler content to scroll */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Text key={i} style={styles.item}>
            Item {i + 1}
          </Text>
        ))}
      </ScrollView>

      {/* Floating Button - bottom right */}
      <TouchableOpacity style={styles.fab} onPress={() => {
        //setShowOverlay(true);
        navigation.navigate('Home');
        }}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Overlay - full screen */}
      {showOverlay && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Overlay Modal</Text>
          <TouchableOpacity
            onPress={() => setShowOverlay(false)}
            style={styles.closeBtn}
          >
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer - pinned to bottom */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📍 Footer (Fixed)</Text>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'dodgerblue',
    padding: 12,
    zIndex: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

  scrollContent: {
    paddingTop: 60, // to avoid being hidden under header
    paddingBottom: 80, // to avoid being hidden under footer
    alignItems: 'center',
  },

  item: {
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '90%',
    marginVertical: 6,
    borderRadius: 6,
    elevation: 2,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: 'tomato',
    padding: 20,
    borderRadius: 30,
    zIndex: 15,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
    backgroundColor: 'purple',
    zIndex: 10,
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 22,
    marginBottom: 20,
  },
  closeBtn: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },

  iconWrapper: {
    position: 'relative',
    marginVertical: 20,
  },
  iconImage: {
    width: 60,
    height: 60,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
export default Normal;