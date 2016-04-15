var convo = {};

convo.c1 = [
  'Hey there. Welcome to the healthy mind app.',
  'This app is arranged around a few main ideas.',
  '1. The mind can be changed',
  '2. Another idea',
  '3. A third idea!',
  'My job is to be your guide.',
  'I\'ll check in with you here and then and help you meet your goals.',
  ['c2'],
];

convo.c2 = [
  'Do you want to listen to the first lesson now, it\'s about 5 minutes?',
  [['Now', 'c3'], ['Remind me later']],
  'Sounds great. When should I remind you?',
  [['(pick date/time)']],
  'Fantastic. I\'ll remind you then.',
  '...',
  'Nice to see you back.',
  ['c2'],
];

convo.c3 = [
  '(Pretend media is playing here)',
  'Nice job listening to the first lesson. It\'s exciting to think about changing our own brain.',
  [['Sure is!']],
  'Like Cort said, it\'s about training our mind so we are at our best.',
  ['c4'],
];

convo.c4 = [
  'Are you ready to try your first practice?',
  'It\'s only a 5 minute exercise, but you will need to stay clear of distractions.',
  'Is now a good time or should I remind you for sometime later?',
  [['Now', 'c5'], ['Remind me']],
  'Gotcha. So when is a good time?',
  [['(pick date/time)']],
  'Perfect. I\'ll remind you then.',
  'Have a great day.',
  [['Will do.']],
];

convo.c5 = [
  '(practice media here)',
];

exports.convo = convo;
