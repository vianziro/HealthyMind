/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  StatusBar,
  SliderIOS,
  TouchableOpacity
} from 'react-native';

class HealthyMind extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.topbar}>
          <Text style={styles.appname}>
            HEALTHY MIND
          </Text>
        </View>
        <View style={styles.conversation}>
          <View style={styles.appsays}>
            <Text>
              I hope you are having a great evening.
              Are evenings generally a good time to meditate?
            </Text>
          </View>
          <View style={styles.usersays}>
            <Text>
              Yes
            </Text>
          </View>
          <View style={styles.appsays}>
            <Text>
              Great! Before we begin,
              how connected did you feel to people around you today?
            </Text>
          </View>
        </View>
        <View style={styles.controls}>
          <SliderIOS style={styles.slider} />
          <View style={styles.spectrum}>
            <Text style={styles.spectrum_min}>Not Connected at all</Text>
            <Text style={styles.spectrum_max}>Very Connected</Text>
          </View>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text>SUBMIT</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text>I WAS ALONE TODAY</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#ccc',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  topbar: {
    padding: 20,
    backgroundColor: 'white',
    alignSelf: 'stretch',
  },
  appname: {
    textAlign: 'center',
  },
  appsays: {
    margin: 10,
    width: 250,
    alignSelf: 'flex-start',
  },
  usersays: {
    margin: 10,
    alignSelf: 'flex-end',
  },
  slider: {
    alignSelf: 'stretch',
  },
  spectrum: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  button: {
    alignSelf: 'flex-end',
    padding: 10,
    margin: 5,
    backgroundColor: 'gray',
    borderRadius: 9999,
  },
  conversation: {
    margin: 20,
  },
  controls: {
    margin: 20,
  }
});

AppRegistry.registerComponent('HealthyMind', () => HealthyMind);
