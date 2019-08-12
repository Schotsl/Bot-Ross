const tf = require('@tensorflow/tfjs-node');

// const model = tf.sequential();
// model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [3]}));
// model.add(tf.layers.dense({units: 2, activation: 'softmax'}));
// model.compile({optimizer: 'sgd', loss: 'categoricalCrossentropy'});

const knownArray = ["the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "I", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part", "music", "jam"];

function turnStringIntoArray(dataString) {
  let wordArray = dataString.split(" ");
  let bitArray = new Array();

  //Fill array with zeros
  for (let i = 0; i < knownArray.length; i ++) bitArray.push(0);

  wordArray.forEach(function(singleWord) {
    let matchedIndex = knownArray.indexOf(singleWord.toLowerCase());
    if (matchedIndex >= 0) bitArray[matchedIndex] = 1;
  });

  return bitArray;
}

const training_data = tf.tensor2d([
  turnStringIntoArray("Please play some music"),
  turnStringIntoArray("Living our best life"),
  turnStringIntoArray("I'll join you later tonight"),
  turnStringIntoArray("Don't do this to yourself man"),
  turnStringIntoArray("Happens to the best of us")
]);

const target_data = tf.tensor2d([
  [1],
  [0],
  [0],
  [0],
  [0]
]);

const model = tf.sequential();

model.add(tf.layers.dense({
  units: 1000,
  activation: 'sigmoid',
  inputShape: [102]
}));

model.add(tf.layers.dense({
  units: 1,
  activation: 'sigmoid',
  inputShape: [10]
}));

model.compile({
  loss: 'meanSquaredError',
  optimizer: 'rmsprop'
});


var h = model.fit(training_data, target_data, {
  epochs: 30
}).then(function(data) {
  console.log("Loss after Epoch " + " : " + data.history.loss[0]);
  console.log(data);

});

// model.predict(training_data).print();
