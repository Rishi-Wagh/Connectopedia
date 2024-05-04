'use client'

import React  from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker';

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
    
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-col-2 xl:grid-cols-4'>
       <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isInstantMeeting')}
        />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

{!callDetails ? (
          <MeetingModel 
          isOpen ={meetingState === 'isScheduleMeeting' }
          onClose={()=> setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
          >
            <div className="flex flex-col gap-2.5">
               <label className='text-base text-normal leading-[22px]'>Add a description</label>
               <Textarea className='bg-dark-3 focus-visible:ring-0 focus-visible-ring-offset-0' 
                onChange={(e) => {setValues({...values , description: e.target.value})}}/>
             </div>
             <div className="flex w-full flex-col gap-2.5">
             <label className='text-base text-normal leading-[22px] text-sky-2'>select date and time</label>
              <ReactDatePicker
                  selected={values.dateTime} 
                  onChange={(date) => setValues({
                    ...values,
                    dateTime: date! 
                  })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa" 
                  className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                  />

              
             </div>
          </MeetingModel>
      ) : (
         <MeetingModel 
          isOpen ={meetingState === 'isScheduleMeeting' }
          onClose={()=> setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy meeting link"
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link copied'})
          }}
          />
        )}

          <MeetingModel 
          isOpen ={meetingState === 'isInstantMeeting' }
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