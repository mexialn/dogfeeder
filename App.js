import * as React from 'react';
import { View, Text, Button, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('./assets/images/paws.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Dog Feeder App</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Feed Now"
            onPress={() => navigation.navigate('Feed')}
            color="black"
          />
          <Button
            title="Set Feeding Times"
            onPress={() => navigation.navigate('Schedule')}
            color="black"
          />
          <Button
            title="Feeding History"
            onPress={() => navigation.navigate('History')}
            color="black"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const FeedScreen = () => {
  const [feedAmount, setFeedAmount] = React.useState(50);
  const [mode, setMode] = React.useState('Manual');

  const handleFeed = () => {
    Alert.alert('Feeding', `Dog has been fed ${feedAmount} grams of food!`);
  };

  const selectPortion = (amount) => {
    setFeedAmount(amount);
  };

  return (
    <ImageBackground source={require('./assets/images/paws.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.subheader}>Feed Now</Text>
        <View style={styles.modeButtonContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'Automatic' && styles.selectedModeButton]} 
            onPress={() => setMode('Automatic')}
          >
            <Text style={[styles.modeButtonText, mode === 'Automatic' && styles.selectedModeButtonText]}>Automatic</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, mode === 'Manual' && styles.selectedModeButton]} 
            onPress={() => setMode('Manual')}
          >
            <Text style={[styles.modeButtonText, mode === 'Manual' && styles.selectedModeButtonText]}>Manual</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sliderContainer}>
          {mode === 'Manual' && (
            <>
              <Text style={styles.subheader}>Adjust Feed Amount: {feedAmount} grams</Text>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#ff66b2"
                maximumTrackTintColor="#000000"
                thumbTintColor="#ff66b2"
                step={1}
                value={feedAmount}
                onValueChange={value => setFeedAmount(value)}
              />
            </>
          )}
          <View style={styles.portionButtonContainer}>
            <TouchableOpacity style={styles.circleButton} onPress={() => selectPortion(25)}>
              <Text style={styles.circleButtonText}>Small</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => selectPortion(50)}>
              <Text style={styles.circleButtonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => selectPortion(75)}>
              <Text style={styles.circleButtonText}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>
        {mode === 'Automatic' && (
          <Text style={styles.subheader}>Selected Feed Amount: {feedAmount} grams</Text>
        )}
        <Button title="Feed" onPress={handleFeed} color="black" />
      </View>
    </ImageBackground>
  );
};

const ScheduleScreen = () => {
  const [times, setTimes] = React.useState([
    { id: 'morning', label: 'Morning', time: new Date() },
    { id: 'noon', label: 'Noon', time: new Date() },
    { id: 'evening', label: 'Evening', time: new Date() },
  ]);
  const [showPicker, setShowPicker] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(null);

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      updateTimes(currentId, selectedTime);
    }
    setShowPicker(false);
  };

  const updateTimes = (id, newTime) => {
    const updatedTimes = times.map(time => time.id === id ? { ...time, time: newTime } : time);
    setTimes(updatedTimes);
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight case
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <ImageBackground source={require('./assets/images/paws.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.subheader}>Set Feeding Times</Text>
        <FlatList
          data={times}
          renderItem={({ item }) => (
            <View style={styles.timeBlock}>
              <Text style={styles.item}>{item.label}</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => {
                  setCurrentId(item.id);
                  setShowPicker(true);
                }}
              >
                <Text style={styles.timePickerText}>
                  {formatTime(item.time)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
        />
        {showPicker && (
          <DateTimePicker
            value={times.find(time => time.id === currentId).time}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </ImageBackground>
  );
};


const HistoryScreen = () => {
  const history = [
    { id: '1', time: '8:00 AM', date: '2024-06-25' },
    { id: '2', time: '12:00 PM', date: '2024-06-25' },
    { id: '3', time: '6:00 PM', date: '2024-06-25' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.time}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/images/paws.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.subheader}>Feeding History</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Time</Text>
        </View>
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    marginTop: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff66b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    },
    selectedModeButton: {
    backgroundColor: '#ff66b2',
    },
    modeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    },
    selectedModeButtonText: {
    color: 'white',
    },
    timeBlock: {
    marginBottom: 20,
    alignItems: 'center',
    },
    timePickerButton: {
    padding: 10,
    backgroundColor: '#ff66b2',
    borderRadius: 5,
    },
    timePickerText: {
    color: 'white',
    fontWeight: 'bold',
    },
    item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#ff66b2',
    },
    tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff66b2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    },
    tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    },
    tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    },
    tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    color: '#ff66b2',
    },
    });
    
    export default App;