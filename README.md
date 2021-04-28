# Parser for Amazon AWS Transcribe Files
This script is designed to be minimalistic. You will run it on the command line.

The output should look something like this:

`spk_1 : 0:03 |
Something* speaker 1 said.

spk_0 : 0:10 |
Speaker 0 said something

spk_X : 0:15 |
^       ^
|       | the time the speaker started
|
| The speaker\_label in AWS's raw output file
`
Words followed by an asterisk had a confidence level of less than 0.9.

## Requirements
* Nodejs vs 12+
* Node access on the command line
* Terminal program

This version does not check for the type of file that you output. It assumes you ran the Transcribe program with the settings to identify the speaker on.

## How to run
Run this by passing the path to the program as follows. Assuming you are in the directory of index.js:
`index.js "/path/to/aws.json"`

When it runs successfully, you will get a 'completed' remark in the command line.

The file will output to the same path and have a filename of `aws.json_out.txt`
