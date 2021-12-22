// const mongoose=require("mongoose");


// const connectDB=async()=>{
// try{
//   const url= process.env.MONGODB_URL
//   const con=await mongoose.connect(url,{
//         useNewUrlParser: true, 
//         useUnifiedTopology: true,
//         useFindAndModify:false
//     })
// console.log(`MongoDb connected:${con.connection.host}`);
// }

// catch(error){
// console.log(error);
// }
// }

// module.exports=connectDB;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.set('debug', true);

const db = () => {
    const connect = async (done) => {
        let mongooseUrl = process.env.MONGODB_URL;
        console.log(mongooseUrl,'url')
        // var mongooseOptions = 'maxPoolSize=5&minPoolSize=5&socketTimeoutMS=2000&readPreference=nearest&readConcern=majority&maxStalenessSeconds=90';
        // REPLICA_SET ? mongooseUrl + '?replicaSet=' + REPLICA_SET + '&' + mongooseOptions : mongooseUrl + '?' + mongooseOptions;
        try {
            await mongoose.connect(mongooseUrl,{
                      useNewUrlParser: true, 
                      useUnifiedTopology: true,
                      useFindAndModify:false,
                      useCreateIndex: true
                  });
            mongoose.connection.on('error', function(err) {
                console.log(err);
            });
            mongoose.connection.on('disconnected', function () {  
                console.log('Mongoose default connection disconnected'); 
            });
            process.on('SIGINT', function() {
                mongoose.connection.close(function () {
                    console.log('Mongoose default connection disconnected through app termination'); 
                    process.exit(0); 
                }); 
            });
            done();
        } catch (ex) {
            done(ex);
        }
    };
    const getreadystate = async (done) => {
        done(mongoose.STATES[mongoose.connection.readyState]);
    }

    return {
        connect: connect,
        getreadystate: getreadystate
    }
};

module.exports = db();