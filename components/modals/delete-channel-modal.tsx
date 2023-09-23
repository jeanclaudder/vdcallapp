"use client";
import {Dialog, DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import qs from "query-string";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export const DeleteChannelModal =()=>{
     const {isOpen ,onClose,type,data} = useModal();
     const router =useRouter();
     const isModalOpen =isOpen && type === "deleteChannel";
     const {server ,channel} = data;
     const [isloading,setIsloding] =useState(false);
      const params =useParams();
     const onClick =async()=>{
        try{
        setIsloding(true);
        const url = qs.stringifyUrl({
            url:`/api/channels/${channel?.id}`,
            query:{
                serverId: params?.serverId
            }
        })

       await axios.delete(url);
       onClose();
       router.refresh();
       router.push(`/servers/${params?.serverId}`);
       

       
        }catch(error){
            console.log(error);
        }finally{
            setIsloding(false)
        }

     }
   
     
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
         <DialogContent className="bg-white text-black p-0 overflow-hidden ">
            <DialogHeader className="pt-8 px-6 ">
               <DialogTitle className="text-2xl text-center font-bold">
                Delet Channel
               </DialogTitle>
               <DialogDescription className="text-center text-zinc-500 ">
                 Are you sure you want to do this <br/> <span className="text-indigo-500 font-semibold">#{channel?.name}</span> will be permanently Deleted
               </DialogDescription>
            </DialogHeader>
             <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <div className="flex items-center justify-between w-full">
                <Button 
                    disabled={isloading}
                    onClick={()=>{}}
                    variant="ghost"
                    >
                    Cancel
                </Button>
                <Button 
                    disabled={isloading}
                    onClick= {onClick}
                    variant="primary">
                    Confirm
                </Button>
              </div>
             </DialogFooter>
         </DialogContent>
        </Dialog>
    )
}