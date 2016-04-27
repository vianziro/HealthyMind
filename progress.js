function getDialog(completedNum, completedTime) {
  const timePassed = (Date.now() - completedTime) > 6 * 60 * 60 * 1000;
  switch (completedNum) {
    case 0: return 'intro';
    case 1: return 'practice1intro';
    case 2: return timePassed ? lesson2 : 'notready';
    default: return 'notready';
  }
}

function availablePaths(completedNum) {
  var paths = [];
  if (completedNum >= 1) paths.push('lesson1');
  if (completedNum >= 2) paths.push('practice1');
  if (completedNum >= 3) paths.push('lesson2');
  if (completedNum >= 4) paths.push('practice2');
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

function completeMedia(num, cb) {
  AsyncStorage.getItem('HMProgress', (err, result) => {
    if (parseInt(result) < num) {
      AsyncStorage.multiSet([['HMProgress', num], ['HMLastFinished', Date.now()]], cb)
    }
  });
}

exports.getDialog = getDialog;
exports.availablePaths = availablePaths;
exports.titles = titles;
exports.descriptions = descriptions;
