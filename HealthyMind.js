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
  TouchableOpacity,
  Image,
  Navigator,
  DatePickerIOS,
  TimePickerAndroid,
} from 'react-native';

import {convo} from './conversation';
import update from 'react-addons-update';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Dims from './Dims';

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

class MTTimePicker extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
    }
  }

  render() {
    if (React.Platform.OS === 'ios') {
      // iOS date picker
      return <View>
        <DatePickerIOS
          date={this.state.date}
          mode="time"
          onDateChange={(date) => { this.setState({date}); }}
        />
        <TouchableOpacity onPress={() => {
          this.props.onPick({hour: this.state.date.getHours(), minute: this.state.date.getMinutes()});
        }}>
          <View style={[styles.button, styles.submitButton]}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>;
    } else {
      // android date picker
      return <TouchableOpacity key={0} onPress={() => {
        TimePickerAndroid.open({
          // empty
        }).then(({action, hour, minute}) => {
          if (action === TimePickerAndroid.dismissedAction) return;
          this.props.onPick({hour, minute});
        });
      }}>
        <View style={[styles.button, styles.submitButton]}>
          <Text style={styles.submitButtonText}>Pick a time</Text>
        </View>
      </TouchableOpacity>;
    }
  }
}

class ConversationPage extends Component {
  constructor() {
    super();
    this.state = {
      history: [],
      buttons: [],
      future: convo.c1,
      pickdate: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this._paused = false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  checkPop() {
    if (this._paused) return;
    if (this.state.buttons.length != 0) return;
    if (this.state.pickdate) return;

    var nextThing = this.state.future[0];
    if (nextThing === undefined) return;

    if (typeof nextThing === 'string') {
      this._paused = true;
      setTimeout(() => {
        if (this._isMounted) {
          if (nextThing === '__PICKDATE__') {
            this.setState((prevState) => {
              return update(prevState, {
                pickdate: {$set: true},
                future: {$apply: (xs) => {return xs.slice(1);}},
              });
            });
          } else {
            this.setState((prevState) => {
              return update(prevState, {
                history: {$unshift: [['app', prevState.future[0]]]},
                future: {$apply: (xs) => {return xs.slice(1);}},
              });
            });
          }
        }
        this._paused = false;
      }, 1000);
    } else if (Array.isArray(nextThing)) {
      if (Array.isArray(nextThing[0])) {
        // buttons
        setTimeout(() => {
          if (this._isMounted) {
            this.setState((prevState) => {
              return update(prevState, {
                buttons: {$set: prevState.future[0]},
                future: {$apply: (xs) => {return xs.slice(1);}},
              });
            });
          }
        }, 1000);
      } else {
        // jump
        this.setState({
          future: convo[nextThing[0]],
        });
      }
    }
  }

  render() {
    setTimeout(() => {this.checkPop()}, 0);
    return <View style={{height: Dims.getHeight() - Dims.barInAppHeight - 60 - 50}}>
      <InvertibleScrollView inverted style={styles.conversation}>
        {
          this.state.history.map(([speaker, line], i) => {
            return <DialogLine isUser={speaker === 'user'} text={line} key={this.state.history.length - i} />;
          })
        }
      </InvertibleScrollView>
      <View style={styles.controls}>
        {
          this.state.pickdate ? (
            <MTTimePicker onPick={({hour, minute}) => {
              var minute_ = minute < 10 ? '0' + minute : '' + minute;
              this.setState((prevState) => {
                return update(prevState, {
                  buttons: {$set: []},
                  history: {$unshift: [['user', `${hour}:${minute_}`]]},
                  pickdate: {$set: false},
                });
              });
            }} />
          ) : (
            this.state.buttons.map(([text, jump], i) => {
              return <TouchableOpacity key={i} onPress={() => {
                if (jump === undefined) {
                  this.setState((prevState) => {
                    return update(prevState, {
                      buttons: {$set: []},
                      history: {$unshift: [['user', text]]},
                    });
                  })
                } else {
                  this.setState((prevState) => {
                    return update(prevState, {
                      buttons: {$set: []},
                      history: {$unshift: [['user', text]]},
                      future: {$set: convo[jump]},
                    });
                  })
                }
              }}>
                <View style={[styles.button, styles.submitButton]}>
                  <Text style={styles.submitButtonText}>{text}</Text>
                </View>
              </TouchableOpacity>;
            })
          )
        }
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
        {this.props.children}
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
        initialRoute={{page: 'path'}}
        renderScene={(route, navigator) => {
          switch (route.page) {
            case 'chat':
              return <MainFrame onMountains={() => {
                navigator.resetTo({page: 'path'});
              }}>
                <ConversationPage />
              </MainFrame>;
            case 'path':
              return <MainFrame onChat={() => {
                navigator.resetTo({page: 'chat'});
              }}>
                <ScrollView>
                  <Image source={require('./img/path.png')} style={{
                    width: Dims.getWidth(),
                    height: Dims.getWidth() * 1080 / 748,
                    resizeMode: 'contain',
                  }} />
                </ScrollView>
              </MainFrame>;
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
    paddingTop: 15 + Dims.barInAppHeight,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60 + Dims.barInAppHeight,
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
    height: 50,
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

exports.HealthyMind = HealthyMind;