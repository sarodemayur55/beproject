var mongoose = require('mongoose');
module.exports = mongoose.model('Image',{
      userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      images:[
        {
            url:{
                type:String
            },
            result:{
                type: mongoose.Schema.Types.Mixed
            },
            time : { type : Date, default: Date.now }
        },
      ]
});