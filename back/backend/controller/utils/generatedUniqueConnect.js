import {customAlphabet} from 'nanoid'

import User from '../../models/user.js'

const generateCode =customAlphabet('0123456789',6);


const generatedUniqueConnectCode= async ()=>{
    let Code , exists;

    do{
        Code = generateCode();
        exists = await User.exists({ConnectCode:Code});
    }while(exists)

        return Code;
}

export default generatedUniqueConnectCode;