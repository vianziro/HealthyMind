import {AsyncStorage} from 'react-native';

function getDialog(completedNum, completedTime) {
  const timePassed = (Date.now() - completedTime) > 6 * 60 * 60 * 1000;
  switch (completedNum) {
    case 0: return 'intro';
    case 1: return 'lesson1intro';
    case 2: return 'practice1intro';
    case 3: return 'practice1intro';
    case 4: return timePassed ? 'lesson2intro' : 'notready';
    case 5: return 'lesson2intro';
    default: return 'notready';
  }
}

function availablePaths(completedNum) {
  var paths = [];
  if (completedNum >= 1) paths.push('lesson1');
  if (completedNum >= 3) paths.push('practice1');
  if (completedNum >= 5) paths.push('lesson2');
  return paths;
}

const titles = {
  lesson1: 'Lesson 1',
  practice1: 'Practice 1',
  lesson2: 'Lesson 2',
  practice2: 'Practice 2',
}

const descriptions = {
  lesson1: 'The first lesson.',
  practice1: 'The first practice.',
  lesson2: 'The second lesson.',
  practice2: 'The second practice.',
}

function getProgress(cb) {
  AsyncStorage.getItem('HMProgress', (err1, result1) => {
    AsyncStorage.getItem('HMLastFinished', (err2, result2) => {
      cb(parseInt(result1) || 0, parseInt(result2) || Date.now());
    });
  });
}

function completeMedia(num, cb) {
  getProgress((result) => {
    if (result < num) {
      AsyncStorage.multiSet([['HMProgress', '' + num], ['HMLastFinished', '' + Date.now()]], cb)
    }
  });
}

function clearProgress(cb) {
  AsyncStorage.multiRemove(['HMProgress', 'HMLastFinished'], cb)
}

exports.getDialog = getDialog;
exports.availablePaths = availablePaths;
exports.titles = titles;
exports.descriptions = descriptions;
exports.getProgress = getProgress;
exports.completeMedia = completeMedia;
exports.clearProgress = clearProgress;
