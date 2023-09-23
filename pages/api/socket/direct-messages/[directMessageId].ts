import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerIo,
){
    if(req.method !== "DELETE" && req.method !=="PATCH" ){
        return res.status(405).json({error:"Method not allowed "});
    }
    try{
      
        const profile = await currentProfilePages(req);
        const {directMessageId , conversationId } =req.query;
        const {content} =req.body;
        if(!profile){
           
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!conversationId){
           
            return res.status(400).json({error:"Conversation ID missing"});
        }
    
         const conversation = await db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOne:{
                            profileId : profile.id,
                        },
                        
                    },
                    {
                        memberTow:{
                            profileId: profile.id,
                        }
                    }
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
                        profile:true,
                    }
                }
            }

         })
         if(!conversation){
            return res.status(404).json({error:"Conversation not found"})
          }
      const member =conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTow;
      if(!member){
        return res.status(404).json({error:"Member not found"})
      }
      let DirectMessage =await db.directMessage.findFirst({
        where:{
            id:directMessageId as string,
            conversationId:conversationId as string,

        },
        include:{
            member:{
                include:{
                    profile:true,
                }
            }
        }
      });
      if(!DirectMessage || DirectMessage.deleted){
        return res.status(404).json({error:"Message not found"})
      }
      const isMessageOwner = DirectMessage.memberId === member.id;
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator =member.role === MemberRole.MODDERATOR;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if(!canModify){
        return res.status(401).json({error:"Unauthorized"});
      }
      if(req.method === "DELETE"){
         DirectMessage = await db.directMessage.update({
            where:{
                id:directMessageId as string,

            },
            data:{
                fileUrl:null,
                content :"This message has been deleted.",
                deleted:true
            },
            include:{
                member:{
                    include:{
                        profile:true,
                    }
                }
            }
         })
      }
      if(req.method === "PATCH"){
        if(!isMessageOwner){
            return res.status(401).json({error:"Unauthorized"});
        }
        DirectMessage = await db.directMessage.update({
           where:{
               id: directMessageId as string,

           },
           data:{
              content,
           },
           include:{
               member:{
                   include:{
                       profile:true,
                   }
               }
           }
        })
     }
     const updateKey = `chat:${conversation.id}:messages:update`;
     res?.socket?.server?.io?.emit(updateKey ,DirectMessage);
     return res.status(200).json(DirectMessage);
     
    }catch(error){
        console.log("[MESSAGE_ID]",error);
        return res.status(405).json({error:"InternalError"});

    }
}