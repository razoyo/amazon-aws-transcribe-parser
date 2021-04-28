const fs = require('fs');

const fileStream = fs.createReadStream(process.argv[2]);
const outputStream = fs.createWriteStream(process.argv[2] + "_out.txt");

var fullDoc = "";
var newline = true;

function punctuation(item) {
  let punctuation = item.alternatives[0].content;
  if (punctuation === "." || punctuation === "?") {
    newline = true;
    return (punctuation + "\n");
  } else {
    return punctuation;
  }
}

fileStream.on('data', (chunk) => {
  fullDoc += chunk.toString();
});

fileStream.on('end', () => {
  
  const items = JSON.parse(fullDoc).results.items;
  const speakers = JSON.parse(fullDoc).results.speaker_labels.segments;

  let prior_speaker = "";
  let speaker = "";

  items.forEach( item => {

    let output = "";
    let qualifier = "";
    let endline = "";
    let time_stamp = "";

    if (item.type === "punctuation") {
      output = punctuation(item);

    } else {
      if (parseFloat(item.alternatives[0].confidence) < 0.90) { qualifier = "*" }

      if ( newline ) { 
        let time_minutes = Math.floor(item.start_time / 60); 
        let time_seconds = Math.floor(item.start_time % 60); 
        time_stamp = time_minutes + ":" + time_seconds + " | ";

        if (!speakers.filter( speaker => speaker.start_time === item.start_time )[0]) {
          speaker = "unk";
        } else {
          speaker = speakers.filter( speaker => speaker.start_time === item.start_time )[0].speaker_label;
        }

      newline = false;

      }

      if (prior_speaker === speaker) {
        output = item.alternatives[0].content + qualifier + " "; 
      } else {
        output = "\n" + speaker + " : "  + time_stamp + "\n" + item.alternatives[0].content + qualifier + " "; 
      }

      prior_speaker = speaker; 

    }
    outputStream.write(output);
  });
console.log('complete');
});
