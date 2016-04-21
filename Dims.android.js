import React, {Dimensions} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';

exports.barInAppHeight = 0;

exports.getWidth = () => Dimensions.get('window').width;

exports.getHeight = () => ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('STATUS_BAR_HEIGHT');
