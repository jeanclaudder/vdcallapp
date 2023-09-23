import { db } from "@/lib/db";

export const getOrCreateConversation =async(memberOneId:string,memberTowId:string)=>{
 let conversation =await findConversation(memberOneId,memberTowId) || await findConversation(memberOneId,memberTowId);
  if(!conversation){
    conversation = await createNewConversation(memberOneId,memberTowId);

  }
return conversation;
}
const findConversation =async (memberOneId:string,memberTowId:string)=>{
 try{
    return await db.conversation.findFirst({
        where:{
            AND:[
                {memberOneId:memberOneId},
                {memberTowId:memberTowId}

            ]
        },
        include:{
            memberOne:{
                include:{
                    profile:true,
                }
            },
            memberTow:{
                include:{
                    profile:true
                }
            }
        }
    });
}catch{
    return null;
}
}

const createNewConversation = async (memberOneId:string ,memberTowId:string) =>{
    try{
       return await db.conversation.create({
        data:{
            memberOneId,
            memberTowId,

        },
        include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTow:{
                include:{
                    profile:true
                }
            }
        }

       })



    }catch{
        return null
    }
}