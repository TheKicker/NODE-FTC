const fs = require('fs');
const pt = require('path');
var readline = require('readline');

//joining path of directory 
const downloads = require('path').join(require('os').homedir(), 'Downloads')

// Make an array of CSV files 
var fileExt = ".csv"
var csvFiles = []
// passing directoryPath and callback function
fs.readdir(downloads, function (err, files) {
    //handling error
    if (err) {
        return console.log('ERR: Unable to scan directory. --' + err);
    } 
    // listing all files using forEach
    files.forEach(file => {
        // check for file extension, if it's a valid CSV then continue
        if(pt.extname(file) == fileExt){
            // console.log(pt.basename(file), " is a file")
            csvFiles.push(pt.basename(file))
        } else {
            console.log(pt.basename(file), " is not a", fileExt)
        }
    });

    // Log the options
    console.log(csvFiles)

    if(csvFiles.length === 0){
        console.log("ERR: There are no CSV files found in", downloads)
    } else {
        // Ask the user to select the index of a file from your array
        var rl = readline.createInterface({ input: process.stdin, output: process.stdout});
        rl.question("Please select the index of your file: ", (f)=> {
            var choice = parseInt(f)
            console.log(choice)
            if( Number.isInteger(choice)){
                if( choice > csvFiles.length || choice < 0){
                    console.log("ERR: You entered a value outside of the index of files in the array. ")
                } else {
                    // Do stuff
                    console.log(csvFiles[choice], "was chosen.")
                }
            } else {
                console.log("ERR: You did not enter a valid number for the index!  ")
            }
            rl.close();
        });
    }
});