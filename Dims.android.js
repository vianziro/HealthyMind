import React, {Dimensions} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';

exports.barInAppHeight = 0;

exports.getWidth = () => Dimensions.get('window').width;

exports.getHeight = () => ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('STATUS_BAR_HEIGHT');
exports.getRealHeight = (orientation) => {
  if (orientation === 'LANDSCAPE') {
    return exports.getWidth() - ExtraDimensions.get('STATUS_BAR_HEIGHT');
  } else {
    return exports.getHeight();
  }
};
