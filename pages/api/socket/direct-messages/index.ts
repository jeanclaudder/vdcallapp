import {  currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest} from "next";
import { db } from "@/lib/db";
import { channel } from "diagnostics_channel";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerIo,

){
    if(req.method !== "POST"){
        return res.status(405).json({error :"Method not allowed"});
    }

    try{
        const profile =await currentProfilePages(req);
        const {content ,fileUrl} =req.body;
        const {conversationId} = req.query;

        if(!profile){
            return res.status(401).json({error:"Unauthorized"})
        }
        if(!conversationId){
            return res.status(400).json({error:"conversation ID missing"})
        }
        
        if(!content){
            return res.status(400).json({error:"Content missing"})
        }

      const conversation =await db.conversation.findFirst({
        where:{
            id:conversationId as string,
            OR:[
                {
                    memberOne:{
                        profileId:profile.id,

                    }
                },
                {
                    memberTow:{
                        profileId:profile.id,
                    }
                }

            ]
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

      if(!conversation){
        return res.status(404).json({message:"Conversation not found"});
      }
       
        const member =conversation.memberOne.profileId === profile.id ? conversation.memberOne
        :conversation.memberTow;
        if(!member){
            return res.status(404).json({message:"Member not found"});
        }

        const  message =await db.directMessage.create({
            data:{
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId:member.id
            },
            include:{
                member:{
                    include:{
                        profile:true,
                    }
                }
            }
        });

        const channelKey =`chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.status(200).json(message);


    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]",error);
        return res.status(500).json({message:"Internal Error"})
    }
}