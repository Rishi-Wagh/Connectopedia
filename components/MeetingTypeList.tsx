'use client'

import React  from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState
    <'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values , setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails , setCallDetails] = useState<Call>();
    const { toast } = useToast();

    const createMeeting = async() =>{
    if(!user || !client) return;

    try {
      if(!values.dateTime) {
        toast({
          title: "Please select a date and time", })
          return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if(!call) throw new Error("Failed to create a call");

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })

      setCallDetails(call);

      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: "Meeting Created", })
        
    } catch (error) {
      toast({
        title: "Error",
        description: error,
      })
    }

  }
    
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-col-2 xl:grid-cols-4'>
      <HomeCard 
       img="/icons/add-meeting.svg"
       title='New meeting'
       description='Start an instant meeting'
       handleClick={()=> setMeetingState('isJoiningMeeting')}
       className="bg-orange-1"
        />

      <HomeCard 
       className ='bg-blue-1'
       img="/icons/schedule.svg"
       title='Schedule meeting'
       description='Plan your meeting'
       handleClick={()=> setMeetingState('isScheduleMeeting')} />

      <HomeCard 
       className='bg-purple-1'
       img="/icons/recordings.svg"
       title='View Recordings'
       description='Check your recordings'
       handleClick={()=> router.push('/recordings')} />

      <HomeCard 
       className='bg-yellow-1'
       img="/icons/join-meeting.svg"
       title='Join meeting'
       description='via invitation link'
       handleClick={()=> setMeetingState('isInstantMeeting')} />


       <MeetingModel 
          isOpen ={meetingState === 'isJoiningMeeting' }
          onClose={()=> setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
       />
    </section>
  )
}

export default MeetingTypeList