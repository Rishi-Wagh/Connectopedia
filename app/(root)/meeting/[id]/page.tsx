"use client"

import { useGetCallById } from '@/Hooks/useGetCallById';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import Loader from '@/components/loader';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({ params: {id} }: { params: {id: string} }) => {
 const { user , isLoaded } =useUser();
 const { call , isCallLoading } = useGetCallById(id);
 const[isSetupComplete , setIsSetupComplete] = useState(false);

 if(!isLoaded || isCallLoading) return <Loader />
  return (
     <main className='h-screen w-full'>
       <StreamCall call={call}>
          <StreamTheme>
             {!isSetupComplete ? (
              <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
             ) :(
              <MeetingRoom />
             ) }
          </StreamTheme>
       </StreamCall>
     </main>   
  )
}

export default Meeting