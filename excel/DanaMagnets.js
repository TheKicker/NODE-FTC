// In early Jan, the new marketing girl wanted a breakdown on magnet orders, how often people ordered just one, whether they were ordering with other products, etc for shipping

const fs = require('fs');
const pt = require('path');
var readline = require('readline');

//joining path of directory 
const downloads = require('path').join(require('os').homedir(), 'Downloads')

// Make an array of CSV files 
const csv = require('csv-parser');
var fileExt = ".csv"
var filesArray = []
var nullFiles = []
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
            nullFiles.push(pt.basename(file))
        }
    });

    // Log the options
    console.log(`FAILED ----------------`)
    console.log(`A total of ${nullFiles.length} were not ${fileExt}`)
    console.log(`PASSED ----------------`)
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

function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function uniqueValues(path){
    console.log(path)
    const results = []

    fs.createReadStream(path)
        .pipe(csv({}))
        .on('data', (data)=>{ results.push(data)})
        .on('end', ()=>{
            // Do stuff
            let orders = []  
            let magnets = 0
            let uniqueItems = 0
            let orderedMagnets = 0
            let orderedOther = 0
            let orderedPlus = []

            // loop row by row
            for(let i = 0; i < results.length; i++)
            {
                // get the name of the product
                let itemName = results[i].LineItemName

                // if the ordernumber is already in the orders array
                if(orders.includes(results[i].FFD))
                {
                    // check if the item on this row is a magnet
                    if(itemName.includes("Magnet"))
                    {
                        magnets++

                    } else {
                        uniqueItems++
                    }
                } else {
                    // add the new order number to the orders array
                    orders.push(results[i].FFD)
                    // count this order as either only magnets or a mix bag
                    if(uniqueItems != 0)
                    {
                        orderedOther++
                    } else {
                        orderedMagnets++
                    }
                    // push to our orders array to count how often people bought 1,2,3,4,5,6,etc. 
                    orderedPlus.push(magnets)
                    // reset our variables for the next order number
                    magnets = 0
                    uniqueItems = 0
                }
            }

            // var unique = orderedPlus.filter(onlyUnique);
            // console.log(unique)

            console.log("-----------------------------")
            console.log(`Orders: ${orders.length}`)
            console.log(`Magnets: ${orderedMagnets}`)
            console.log(`Mix bag: ${orderedOther}`)
            console.log("-----------------------------")
            console.log(`Ordered 1: ${getOccurrence(orderedPlus, 0)}`);
            console.log(`Ordered 2: ${getOccurrence(orderedPlus, 1)}`);
            console.log(`Ordered 3: ${getOccurrence(orderedPlus, 2)}`);
            console.log(`Ordered 4: ${getOccurrence(orderedPlus, 3)}`);
            console.log(`Ordered 5: ${getOccurrence(orderedPlus, 4)}`);
            console.log(`Ordered 6: ${getOccurrence(orderedPlus, 5)}`);
            console.log(`Ordered 7: ${getOccurrence(orderedPlus, 6)}`);
            console.log(`Ordered 8: ${getOccurrence(orderedPlus, 7)}`);
            console.log(`Ordered 9: ${getOccurrence(orderedPlus, 8)}`);
            console.log(`Ordered 10: ${getOccurrence(orderedPlus, 9)}`);
            console.log(`Ordered 11: ${getOccurrence(orderedPlus, 10)}`);
            console.log(`Ordered 12: ${getOccurrence(orderedPlus, 11)}`);
            console.log(`Ordered 13: ${getOccurrence(orderedPlus, 12)}`);
            console.log(`Ordered 14: ${getOccurrence(orderedPlus, 13)}`);
            console.log(`Ordered 15 or more: ${getOccurrence(orderedPlus, 14)}`);
        })
}