'use client'

import Image from 'next/image'
import React  from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'


const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState
    <'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  
  const createMeeting =() =>{
    console.log('hello')
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
       handleClick={()=> setMeetingState('isJoiningMeeting')} />


       <MeetingModel 
          isOpen ={meetingState === 'isInstantMeeting'}
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