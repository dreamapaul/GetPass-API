const mongoose=require('mongoose')

const billSchema=mongoose.Schema(
    {

        boarding_point:{
            type:String,
            required:[true,"Please enter a boarding point."]
        },
        destination_point:{
            type:String,
            required:[true,"Please enter a destination point."]
        },
        No_of_tickets:{
            type:String,
            required:[true,"Please enter the nmber of tickets."]
        },
        name:{
            type:String,
            required:[true,"Please enter the name."]
        },
        bus_no:{
            type:String,
            required:[true,"Please enter the bus number."]
        },
        bill_no:{
            type:String,
            required:[true,"Please enter the bill number."]
        },
        price:{
            type:String,
            required:[true,"Please enter the price."]
        },
    },
    {timestamps:true}
)

const Bill=mongoose.model('bill',billSchema); 

module.exports=Bill;