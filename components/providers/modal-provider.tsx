"use client"

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MemberModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeletServerModal } from "@/components/modals/delet-server-modal";
//import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
export const ModalProvider =()=>{
    const [isMounted,setIsMounted] =useState(false);
      useEffect(()=>{
        setIsMounted(true);

      },[]);
       if(!isMounted){
        return null;
       }

    return(
    <>
    <CreateServerModal/>
    <InviteModal/>
    <EditServerModal/>
    <MemberModal/>
    <CreateChannelModal/>
    <LeaveServerModal/>
    <DeletServerModal/>
    <DeleteChannelModal/>
    <EditChannelModal/>
    <MessageFileModal/>
    <DeleteMessageModal/>
    </>
    )
}