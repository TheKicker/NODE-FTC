const fs = require('fs');
const pt = require('path');
const ht = require('https');
var readline = require('readline');

//joining path of directory 
const downloads = require('path').join(require('os').homedir(), 'Downloads')

// Make an array of CSV files 
const csv = require('csv-parser');
var fileExt = ".csv"
var filesArray = []
// passing directoryPath and callback function
fs.readdir(downloads, function (err, files) {
    //handling error
    if (err) {
        return console.log('ERR: Unable to scan directory --' + err);
    } 
    // listing all files using forEach
    files.forEach(file => {
        // check for file extension, if it's a valid CSV then continue
        if(pt.extname(file) == fileExt){
            // console.log(pt.basename(file), " is a file")
            filesArray.push(pt.basename(file))
        } else {
            console.log(pt.basename(file), " is not a", fileExt)
        }
    });

    // Log the options
    console.log(filesArray)

    if(filesArray.length === 0){
        console.log("ERR: There are no ", fileExt ," files found in", downloads)
    } else {
        // Ask the user to select the index of a file from your array
        var rl = readline.createInterface({ input: process.stdin, output: process.stdout});
        rl.question("Please select the index of your file: ", (f)=> {
            var choice = parseInt(f)
            if( Number.isInteger(choice)){
                if( choice > filesArray.length || choice < 0){
                    console.log("ERR: You entered a value outside of the index of files in the array. ")
                } else {
                    // Customize function below to do stuff
                    const filePath = require('path').join(require('os').homedir(), 'Downloads', filesArray[choice]) 
                    uniqueValues(filePath)
                }
            } else {
                console.log("ERR: You did not enter a valid number for the index!  ")
            }
            rl.close();
        });
    }
});



function uniqueValues(path){
    console.log(path)
    const results = []
    var error404 = 0
    var error200 = 0
    var errorUnk = 0

    fs.createReadStream(path)
        .pipe(csv({}))
        .on('data', (data)=>{ results.push(data)})
        .on('end', ()=>{  

            // for each item in the CSV
            results.forEach((item) => {
                // Make an HTTP request to the variant image tester
                var request = ht.get(item.IMG, function (response) {
                    // console.log(response.statusCode);
                    if (response.statusCode === 404){
                        error404++
                        console.log(`200: ${error200} / 404: ${error404} / UNK: ${errorUnk}`)
                    } else if (response.statusCode === 200){
                        error200++
                        console.log(`200: ${error200} / 404: ${error404} / UNK: ${errorUnk}`)
                    } else {
                        errorUnk++
                        console.log(`200: ${error200} / 404: ${error404} / UNK: ${errorUnk}`)
                    }
                });

                request.on("error", function (error) {
                    console.error(error.status);
                });
            });

        })


}