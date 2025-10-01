import mongoose from 'mongoose';


const userSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            trim :true,
            unique:true
        }
        ,
         phone:{
           type: String,
           required: true,
           match: [/^0[0-9]{9}$/, 'Le numéro doit commencer par 0 et contenir 10 chiffres.']
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
             match: [
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    'Please fill a valid email address'
  ]
        }
        ,
         password:{
            type:String,
            required:true,
            trim:true
        },
          createdAt: {
    type: Date,
    default: Date.now
  },role: {
    type: String,
    default: 'user'
  },
    amis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' ,default:[]}],
        
    }
)

const user=mongoose.model('User',userSchema);
export default user;