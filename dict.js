const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = ['cyan', 'yellow', 'magenta', 'green', 'blue']; // Colors for displaying definitions

function getWordDefinition(word) {
  const url = `https://api.datamuse.com/words?spwordmd=d`;
  axios.get(url)
    .then(response => {
      const definitions = response.data[0]?.defs;

      if (definitions && definitions.length > 0) {
        console.log(`\nDefinitions for "${word}":`);

        definitions.forEach((definition, index) => {
          const [wordType, definitionText] = definition.split('\t');
          const colorIndex = index % colors.length;
          const colorPrefix = colors[colorIndex];
          const prefixedWordType = `[${colorPrefix}${wordType.toUpperCase()}${colors[0]}]`;

          console.log(`${prefixedWordType} ${definitionText}`);
        });
      } else {
        console.log(`No definitions found for "${word}"`);
      }

      askForWords();
    })
    .catch(error => {
      console.log('An error occurred:', error.message);
      askForWords();
    });
}

function askForWords() {
  rl.question('Enter a word or a comma-separated list of words: ', answer => {
    const words = answer.split(',');

    words.forEach(word => {
      getWordDefinition(word.trim());
    });
  });
}

askForWords();
