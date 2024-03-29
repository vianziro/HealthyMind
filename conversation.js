var convo = {};

convo.intro = [
  'Hey there. Welcome to the healthy mind app.',
  'This app is arranged around a few main ideas.',
  //'1. The mind can be changed',
  //'2. Another idea',
  //'3. A third idea!',
  'My job is to be your guide.',
  'I\'ll check in with you here and then and help you meet your goals.',
  ['lesson1intro'],
];

convo.lesson1intro = [
  ['__PROGRESS__', 1],
  'Do you want to listen to the first lesson now? It\'s about 5 minutes.',
  [['Now', 'lesson1'], ['Remind me later']],
  'Sounds great. When should I remind you?',
  '__PICKDATE__',
  'Fantastic. I\'ll remind you then.',
];

convo.lesson1 = [
  ['__MEDIA__', 1],
  ['__PROGRESS__', 2],
  'Nice job listening to the first lesson. It\'s exciting to think about changing our own brain.',
  [['Sure is!']],
  'Like Cort said, it\'s about training our mind so we are at our best.',
  ['practice1intro'],
];

convo.practice1intro = [
  ['__PROGRESS__', 3],
  'Are you ready to try your first practice?',
  'It\'s only a 5 minute exercise, but you will need to stay clear of distractions.',
  'Is now a good time or should I remind you for sometime later?',
  [['Now', 'practice1'], ['Remind me']],
  'Gotcha. So when is a good time?',
  '__PICKDATE__',
  'Perfect. I\'ll remind you then.',
  'Have a great day.',
  [['Will do.']],
];

convo.practice1 = [
  ['__MEDIA__', 2],
  ['__PROGRESS__', 4],
  'Great job on that practice.',
  "Tomorrow, we'll move on to the next lesson.",
  'See you then!',
  [['Bye!']],
];

convo.lesson2intro = [
  ['__PROGRESS__', 5],
  'Welcome back!',
  'Are you ready for the second lesson?',
  [['Yep', 'lesson2'], ['Remind me later']],
  'Ok. When should I remind you?',
  '__PICKDATE__',
  "Sounds great! I'll see you then.",
  [['OK!']],
];

convo.lesson2 = [
  ['__MEDIA__', 3],
  ['__PROGRESS__', 6],
]

convo.notready = [
  "Sorry; the next lesson isn't ready yet.",
  "Come back later!",
  "Or, you can replay lessons you've already completed from the Path tab.",
];

exports.convo = convo;
