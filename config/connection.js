var mongoose = require("mongoose")

//local config mongoose
mongoose.connect("mongodb://localhost/pcscraper", function(error)
{
    if(error)throw error;
    console.log("database connected");
});

//mlab datbase
//mongoose.connect(mongodb://)
// if(error)throw error;
// console.log("database connected");
// });