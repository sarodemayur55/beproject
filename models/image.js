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
                type:String
            }
        }
      ]
});