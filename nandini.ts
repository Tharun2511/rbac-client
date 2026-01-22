const text = `








Why are you missing Nandini so much when I am here?`;

let index = 0;

function printLetterByLetter() {
  if (index < text.length) {
    process.stdout.write(text[index]);
    index++;
    setTimeout(printLetterByLetter, 50); // 50ms delay between each character
  }
}

printLetterByLetter();
