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
  TouchableOpacity,
  Image,
  Navigator,
  Dimensions,
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
    var anim = {transform: [{scale: this.state.bounceValue}]};
    return <Animated.View style={[(this.props.isUser ? styles.usersays : styles.appsays), anim]}>
      <Text style={this.props.isUser ? styles.usersays_text : styles.appsays_text}>
        {this.props.text}
      </Text>
    </Animated.View>;
  }
}

class ConversationPage extends Component {
  constructor() {
    super();
    this.state = {
      conversation: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
     if (!this._isMounted) return;
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
        ]
      });
    }, 1000);
    setTimeout(() => {
     if (!this._isMounted) return;
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
          ['user', 'Yes'],
        ]
      });
    }, 2000);
    setTimeout(() => {
     if (!this._isMounted) return;
      this.setState({
        conversation: [
          ['hm', 'I hope you are having a great evening. Are evenings generally a good time to meditate?'],
          ['user', 'Yes'],
          ['hm', 'Great! Before we begin, How connected did you feel to people around you today?'],
        ]
      });
    }, 3000);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return <View>
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
    </View>;
  }
}

class MainFrame extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.topbar}>
          <View style={styles.topside} />
          <Image style={styles.appname_image} source={require('./img/healthymind.png')} />
          <TouchableOpacity>
            <Image style={styles.menu_button} source={require('./img/menu.png')} />
          </TouchableOpacity>
        </View>
        {this.props.content}
        <View style={styles.bottombar}>
          <TouchableOpacity onPress={this.props.onMountains}>
            <Image source={require('./img/mountains.png')} style={styles.bottombutton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onChat}>
            <Image source={require('./img/speech.png')} style={styles.bottombutton} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('./img/cort.png')} style={styles.bottomuserpic} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class HealthyMind extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Navigator
        initialRoute={{page: 'chat'}}
        renderScene={(route, navigator) => {
          switch (route.page) {
            case 'chat':
              return <MainFrame content={
                <ConversationPage />
              } onMountains={() => {
                navigator.push({page: 'path'});
              }} />;
            case 'path':
              return <MainFrame content={
                <ScrollView>
                  <Image source={require('./img/path.png')} style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').width * 1080 / 748,
                    resizeMode: 'contain',
                  }} />
                </ScrollView>
              } onChat={() => {
                navigator.push({page: 'chat'});
              }} />;
          }
        }}
      />
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
    padding: 15,
    paddingTop: 35,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  conversation: {
    margin: 20,
  },
  controls: {
    margin: 20,
  },
  bottombar: {
    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topside: {
    width: 30,
  },
  menu_button: {
    width: 30,
    resizeMode: 'contain',
  },
  bottombutton: {
    resizeMode: 'contain',
    height: 32,
  },
  bottomuserpic: {
    resizeMode: 'contain',
    height: 40,
  },
  appname: {
  },
  appname_image: {
    height: 18,
    resizeMode: 'contain',
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
