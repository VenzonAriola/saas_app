
import { Button } from '@/components/ui/button'
import React from 'react'
import CompanionCard from "@/components/CompanionCard";
import CTA from "@/components/CTA";
import CompanionList from "@/components/CompanionList";
import {recentSessions} from "@/constants";

const Page = () => {
  return (
    <main>
     
      <h1 className='text-2xl underline'>
        Popular Companions
      </h1>
      <section className='home-section'>
          <CompanionCard
            id="123"
            name="Neura the Brainy Explored"
            topic="Neural Network of the Brain"
            subject="Science"
            duration={45}
            color="#feda6e"
          />
          <CompanionCard
              id="456"
              name="Countsy the Number Wizard"
              topic="Derivatives & Integrals"
              subject="Math"
              duration={30}
              color="#affa9e"
          />
          <CompanionCard
              id="789"
              name="Verba the Vocabulary Builder"
              topic="English Literature "
              subject="Language"
              duration={30}
              color="#bada6e"
          />
      </section>
      <section className='home-section'>
          <CompanionList
            title="Recently Completed Sessions"
            companions={recentSessions}
            classNames="w-2/3 max-lg:w-full"
          />
          <CTA />
      </section>

    </main>
  )
}

export default Page