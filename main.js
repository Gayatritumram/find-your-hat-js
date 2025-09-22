const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.playerPosition = { x: 0, y: 0 };
    this.gameOver = false;
  }

  print() {
    console.log(this.field.map(row => row.join('')).join('\n'));
  }

  askDirection() {
    const direction = prompt('Which way? (up/down/left/right): ');
    switch (direction.toLowerCase()) {
      case 'up':
        this.playerPosition.y -= 1;
        break;
      case 'down':
        this.playerPosition.y += 1;
        break;
      case 'left':
        this.playerPosition.x -= 1;
        break;
      case 'right':
        this.playerPosition.x += 1;
        break;
      default:
        console.log('Invalid input. Try again.');
    }
  }

  isOutOfBounds() {
    const { x, y } = this.playerPosition;
    return y < 0 || y >= this.field.length || x < 0 || x >= this.field[0].length;
  }

  playGame() {
    while (!this.gameOver) {
      this.print();
      this.askDirection();

      if (this.isOutOfBounds()) {
        console.log('You stepped outside the field. Game over!');
        this.gameOver = true;
        return;
      }

      const tile = this.field[this.playerPosition.y][this.playerPosition.x];
      if (tile === hole) {
        console.log('You fell into a hole. Game over!');
        this.gameOver = true;
      } else if (tile === hat) {
        console.log('You found your hat! You win!');
        this.gameOver = true;
      } else {
        this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
      }
    }
  }

  static generateField(height, width, holePercentage) {
    const field = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const randomNum = Math.random();
        if (randomNum < holePercentage) {
          row.push(hole);
        } else {
          row.push(fieldCharacter);
        }
      }
      field.push(row);
    }

    // Place the hat randomly, not at (0, 0)
    let hatX, hatY;
    do {
      hatX = Math.floor(Math.random() * width);
      hatY = Math.floor(Math.random() * height);
    } while (hatX === 0 && hatY === 0);

    field[hatY][hatX] = hat;

    // Set starting position
    field[0][0] = pathCharacter;

    return field;
  }
}

// Create and play the game
const generatedField = Field.generateField(5, 5, 0.2); // 5x5 field, 20% holes
const myField = new Field(generatedField);
myField.playGame();