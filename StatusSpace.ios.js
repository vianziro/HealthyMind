import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation';

class StatusSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  componentDidMount() {
    Orientation.getSpecificOrientation((err, orient) => {
      this.setState({orientation: orient});
    });
    this.orientationListener = (orient) => {
      this.setState({orientation: orient});
    };
    Orientation.addSpecificOrientationListener(this.orientationListener);
  }

  componentWillUnmount() {
    Orientation.removeSpecificOrientationListener(this.orientationListener);
  }

  render() {
    if (this.state.orientation === 'PORTRAIT' || this.state.orientation === 'UNKNOWN') {
      return <View style={styles.blankspace} />;
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  blankspace: {
    flex: 0,
    height: 20,
    backgroundColor: 'white',
  },
});

exports.StatusSpace = StatusSpace;
