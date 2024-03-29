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
  PushNotificationIOS,
} from 'react-native';

import {convo} from './conversation';
import Progress from './progress';
import update from 'react-addons-update';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Sound from 'react-native-sound';
import {StatusSpace} from './StatusSpace';

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

class SoundPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      ended: false,
      loaded: false,
      bounceValue: new Animated.Value(0),
    };
    this.hasEnded = false;
    this.hasLoaded = false;
  }

  componentDidMount() {
    this.sound = new Sound(this.props.sound, Sound.MAIN_BUNDLE, (error, props) => {
      if (error) throw error;
      this.setState({loaded: true});
      this.play();
    });

    this.state.bounceValue.setValue(0);
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: 1,
        friction: 10,
      }
    ).start();
  }

  componentWillUnmount() {
    this.sound.stop();
    this.sound.release();
  }

  play() {
    this.sound.play(() => {
      if (!this.state.ended) {
        this.setState({ended: true});
        this.props.onEnd();
      }
    });
    this.setState({playing: true});
  }

  pause() {
    this.sound.pause();
    this.setState({playing: false});
  }

  render() {
    var anim = {transform: [{scale: this.state.bounceValue}]};
    return <Animated.View style={anim}>
      {
        (() => {
          if (this.state.ended) {
            return <Image source={require('./img/check.png')} style={styles.playPause} />;
          } else if (!this.state.loaded) {
            return <Image source={require('./img/dots.png')} style={styles.playPause} />;
          } else if (this.state.playing) {
            return <TouchableOpacity onPress={() => this.pause()}>
              <Image source={require('./img/pause.png')} style={styles.playPause} />
            </TouchableOpacity>;
          } else {
            return <TouchableOpacity onPress={() => this.play()}>
              <Image source={require('./img/play.png')} style={styles.playPause} />
            </TouchableOpacity>;
          }
        })()
      }
    </Animated.View>;
  }
}

class MTTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
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
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      buttons: [],
      future: props.initLines,
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
        this._paused = true;
        setTimeout(() => {
          if (this._isMounted) {
            this.setState((prevState) => {
              return update(prevState, {
                buttons: {$set: prevState.future[0]},
                future: {$apply: (xs) => {return xs.slice(1);}},
              });
            });
          }
          this._paused = false;
        }, 1000);
      } else if (nextThing[0] === '__PROGRESS__') {
        // mark progress
        this.props.onComplete(nextThing[1]);
        this.setState((prevState) => {
          return update(prevState, {
            future: {$apply: (xs) => {return xs.slice(1);}},
          });
        });
      } else if (nextThing[0] === '__MEDIA__') {
        // play media
        this._paused = true;
        setTimeout(() => {
          if (this._isMounted) {
            this.setState((prevState) => {
              return update(prevState, {
                history: {$unshift: [['media', 'test.mp3']]},
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
    var firstHistory = this.state.history[0];
    if (firstHistory && firstHistory[0] === 'media') {
      // full-screen media player
      return <View style={{flex: 1, justifyContent: 'center'}}>
        <SoundPlayer sound={firstHistory[1]} onEnd={() => {
          this._paused = false;
          this.checkPop();
        }} />
      </View>;
    } else {
      return <View style={{flex: 1}}>
        <InvertibleScrollView inverted style={styles.conversation}>
          {
            this.state.history.map(([speaker, line], i) => {
              if (speaker === 'media') {
                return <Image source={require('./img/check.png')} style={styles.playPause} key={this.state.history.length - i} />;
              } else {
                return <DialogLine isUser={speaker === 'user'} text={line} key={this.state.history.length - i} />;
              }
            })
          }
        </InvertibleScrollView>
        <View style={styles.controls}>
          {
            this.state.pickdate ? (
              <MTTimePicker onPick={({hour, minute}) => {
                var now = new Date();
                var date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
                if (date < now) {
                  date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute);
                }
                if (React.Platform.OS === 'ios') {
                  PushNotificationIOS.scheduleLocalNotification({
                    fireDate: date.getTime(),
                    alertBody: 'Ready to change your mind?',
                  });
                }
                this.setState((prevState) => {
                  return update(prevState, {
                    buttons: {$set: []},
                    history: {$unshift: [['user', date.toLocaleString()]]},
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
}

class MainFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <StatusSpace />
        <View style={styles.topbar}>
          <View style={styles.topside} />
          <Image style={styles.appname_image} source={require('./img/healthymind.png')} />
          <TouchableOpacity>
            <Image style={styles.menu_button} source={require('./img/menu.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.maincontent}>
          {this.props.children}
        </View>
        <View style={styles.bottombar}>
          <TouchableOpacity onPress={this.props.onMountains}>
            <Image source={require('./img/mountains.png')} style={styles.bottombutton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onChat}>
            <Image source={require('./img/speech.png')} style={styles.bottombutton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onCort}>
            <Image source={require('./img/cort.png')} style={styles.bottomuserpic} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class PathPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <ScrollView>
      {
        (() => {
          const paths = Progress.availablePaths(this.props.numCompleted);
          if (paths.length === 0) {
            return <View style={styles.path}>
              <Text>
                You haven't unlocked any videos! Start chatting by hitting
                the speech icon below.
              </Text>
            </View>
          } else {
            return paths.map(({path, cont}, i) => {
              const loadPath = () => {
                this.props.onChoose(cont ? convo[path] : convo[path].slice(0, 1));
              };
              return (
                <TouchableOpacity onPress={loadPath} key={i}>
                  <View style={styles.path}>
                    <Text style={styles.pathTitle}>{ Progress.titles[path] }</Text>
                    <Text style={styles.pathDescription}>{ Progress.descriptions[path] }</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          }
        })()
      }
    </ScrollView>;
  }
}

const initialNotification = React.Platform.OS === 'ios' ? PushNotificationIOS.popInitialNotification() : null;

class Notifications extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (React.Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions();
      this.listener = () => {
        if (this.props.onNotification) this.props.onNotification();
      };
      PushNotificationIOS.addEventListener('localNotification', this.listener);
      if (initialNotification) {
        this.listener();
      }
    }
  }

  componentWillUnmount() {
    if (React.Platform.OS === 'ios') {
      PushNotificationIOS.removeEventListener('localNotification', this.listener);
    }
  }

  render() {
    return null;
  }
}

class HealthyMind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      lastTime: Date.now(),
    };
  }

  componentDidMount() {
    this.updateProgress();
  }

  updateProgress() {
    Progress.getProgress((num, time) => {
      this.setState({progress: num, lastTime: time});
    });
  }

  completeMedia(num) {
    Progress.completeMedia(num, () => {
      this.updateProgress();
    });
  }

  goToChat(navigator) {
    navigator.resetTo({
      page: 'chat',
      lines: convo[Progress.getDialog(this.state.progress, this.state.lastTime)],
    });
  }

  render() {
    return (
      <Navigator
        initialRoute={{page: 'path'}}
        renderScene={(route, navigator) => {
          switch (route.page) {
            case 'chat':
              return <MainFrame
                onMountains={() => navigator.resetTo({page: 'path'})}>
                <ConversationPage
                  initLines={route.lines}
                  onComplete={(n) => this.completeMedia(n)}
                />
                <Notifications onNotification={() => this.goToChat(navigator)} />
              </MainFrame>;
            case 'path':
              return <MainFrame
                onChat={() => this.goToChat(navigator)}
                onCort={() => Progress.clearProgress(() => this.updateProgress())}>
                <PathPage numCompleted={this.state.progress} onChoose={(lines) => {
                  navigator.resetTo({page: 'chat', lines: lines});
                }} />
                <Notifications onNotification={() => this.goToChat(navigator)} />
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
    paddingTop: 15,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    flex: 0,
  },
  maincontent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  conversation: {
    margin: 20,
    flex: 1,
  },
  controls: {
    margin: 20,
    flex: 0,
  },
  bottombar: {
    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    flex: 0,
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
    width: 18 * (256/28),
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

  path: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderTopWidth: 2,
  },
  pathTitle: {
    fontWeight: 'bold',
  },
  pathDescription: {
  },

  playPause: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
    alignSelf: 'center',
  }
});

exports.HealthyMind = HealthyMind;
