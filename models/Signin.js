const mongoose=require('mongoose')

const productSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter a name."]
        },
        username:{
            type:String,
            required:[true,"Please enter a username."]
        },
        password:{
            type:String,
            required:[true,"Please enter a password."]
        }
    },
    {timestamps:true}
)

const Product=mongoose.model('Product',productSchema); 

module.exports=Product;