/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  Animated,
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SliderIOS,
  TouchableOpacity
} from 'react-native';

class DialogLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.state.bounceValue.setValue(0);
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 1,
        friction: 10,
      }
    ).start();
  }

  render() {
    console.log(this);
    console.log(this.state);
    var anim = {transform: [{scale: this.state.bounceValue}]};
    return <Animated.View style={[(this.props.isUser ? styles.usersays : styles.appsays), anim]}>
      <Text style={this.props.isUser ? styles.usersays_text : styles.appsays_text}>
        {this.props.text}
      </Text>
    </Animated.View>;
  }
}

class HealthyMind extends Component {
  constructor() {
    super();
    this.state = {
      conversation: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
        ]
      });
    }, 1000);
    setTimeout(() => {
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
          ['user', 'Yes'],
        ]
      });
    }, 2000);
    setTimeout(() => {
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
          ['user', 'Yes'],
          ['hm', 'Great! Before we begin, How connected did you feel to people around you today?'],
        ]
      });
    }, 3000);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.topbar}>
          <Text style={styles.appname}>
            HEALTHY MIND
          </Text>
        </View>
        <ScrollView style={styles.conversation}>
          {
            this.state.conversation.map(([speaker, line], i) => {
              return <DialogLine isUser={speaker === 'user'} text={line} key={i} />;
            })
          }
        </ScrollView>
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
        <View style={styles.bottombar}>
          <Text style={styles.appname}>
            bottom controls here
          </Text>
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
    paddingTop: 40,
    backgroundColor: 'white',
    alignSelf: 'stretch',
  },
  conversation: {
    margin: 20,
  },
  controls: {
    margin: 20,
  },
  bottombar: {
    padding: 25,
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
    marginBottom: 10,
  },
  usersays: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgb(86,130,142)',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
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
});

AppRegistry.registerComponent('HealthyMind', () => HealthyMind);
