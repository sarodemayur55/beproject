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
            quality:{
                type: Number
            },
            time : { type : Date, default: Date.now }
        },
      ]
});