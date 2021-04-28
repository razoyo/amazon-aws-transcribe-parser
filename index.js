const fs = require('fs');

const fileStream = fs.createReadStream(process.argv[2]);
const outputStream = fs.createWriteStream(process.argv[2] + "_out.txt");

// FUNCTION DEFINITIONS
function punctuation(item) {
  let punctuation = item.alternatives[0].content;
  if (punctuation === "." || punctuation === "?") {
    newline = true;
    return (punctuation + "\n");
  } else {
    return punctuation;
  }
}

function getStamp(item) {
  let time_minutes = Math.floor(item.start_time / 60); 
  let time_seconds = Math.floor(item.start_time % 60); 
  return ( time_minutes + ":" + time_seconds + " | " );
}

function getSpeaker(speakers, item) {
  if (!speakers.filter( speaker => speaker.start_time === item.start_time )[0]) {
    return "unk";
  } else {
    return speakers.filter( speaker => speaker.start_time === item.start_time )[0].speaker_label;
  }
}

function getOutput(item, time_stamp, prior_speaker, speaker) {
  let out = ""
  let content = item.alternatives[0].content
  
  if (prior_speaker != speaker) { out += "\n" + speaker + " : "  + time_stamp + "\n" }

  if (item.alternatives.length > 1) {
    const suss_alternatives = function (acc, curr) { return (acc + ", " + curr)}; 

    alternative_matches = item.alternatives.slice(1).reduce(suss_alternatives);
    
    content = item.alternatives[0].content + "(" + alternative_matches + ")"; 
  }   

  out += content + qualifier + " ";

  return out
}


// FLOW CONTROL
var fullDoc = "";
var newline = true;

fileStream.on('data', (chunk) => {
  fullDoc += chunk.toString();
});


fileStream.on('end', () => {
  
  const items = JSON.parse(fullDoc).results.items;
  const speakers = JSON.parse(fullDoc).results.speaker_labels.segments;

  let prior_speaker = "";
  let speaker = "";

  items.forEach( item => {

    let output = qualifier = endline = time_stamp = "";

    if (item.type === "punctuation") {
      output = punctuation(item);

    } else {
      if (parseFloat(item.alternatives[0].confidence) < 0.90) { qualifier = "*" }

      if ( newline ) { 
        time_stamp = getStamp(item);
        speaker = getSpeaker(speakers, item);

        newline = false;
      }

      output = getOutput(item, time_stamp, prior_speaker, speaker);

      prior_speaker = speaker; 

    }
    console.log(output);
    outputStream.write(output);
  });
console.log('complete');
});
