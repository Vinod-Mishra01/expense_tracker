// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({

// name:  {
// type: String,
// required :true

// },

// email : {

//     type : String,
//     required: true,
//     unique : true
// },
// password:{
//     type: String,
//     required: true
// }
// },
// {
//     timestamps:true

// })

// module.exports = mongoose.model('User', userSchema)



const mongoose = require('mongoose')

const userSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
                unique: true,
            },

            password: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                default: '',
            },

            avatar: {
                type: String,
                default: '',
            },

            country: {
                type: String,
                default: '',
            },

            address: {
                type: String,
                default: '',
            },

            city: {
                type: String,
                default: '',
            },

            postcode: {
                type: String,
                default: '',
            },
        },
        {
            timestamps: true,
        },
    )

module.exports =
    mongoose.model(
        'User',
        userSchema,
    )