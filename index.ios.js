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
            <Text style={styles.appsays_text}>
              I hope you are having a great evening.
              Are evenings generally a good time to meditate?
            </Text>
          </View>
          <View style={styles.usersays}>
            <Text style={styles.usersays_text}>
              Yes
            </Text>
          </View>
          <View style={styles.appsays}>
            <Text style={styles.appsays_text}>
              Great! Before we begin,
              How connected did you feel to people around you today?
            </Text>
          </View>
        </View>
        <View style={styles.controls}>
          <SliderIOS style={styles.slider}
            minimumTrackTintColor={'white'}
            maximumTrackTintColor={'white'}
          />
          <View style={styles.spectrum}>
            <Text style={styles.spectrum_min}>Not Connected at all</Text>
            <Text style={styles.spectrum_max}>Very Connected</Text>
          </View>
          <TouchableOpacity>
            <View style={[styles.button, styles.submitButton]}>
              <Text style={styles.submitButtonText}>SUBMIT</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.button, styles.aloneButton]}>
              <Text style={styles.aloneButtonText}>I WAS ALONE TODAY</Text>
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
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'rgb(181,203,207)',
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
    width: 250,
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  usersays: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgb(86,130,142)',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  usersays_text: {
    color: 'rgb(203,226,230)',
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
    borderRadius: 9999,
  },
  submitButton: {
    backgroundColor: 'rgb(86,130,142)',
  },
  submitButtonText: {
    color: 'rgb(203,226,230)',
  },
  aloneButton: {
    borderColor: 'rgb(86,130,142)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  aloneButtonText: {
    color: 'white',
  },
  conversation: {
    margin: 20,
  },
  controls: {
    margin: 20,
  }
});

AppRegistry.registerComponent('HealthyMind', () => HealthyMind);
