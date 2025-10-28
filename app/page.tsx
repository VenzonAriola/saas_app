
import { Button } from '@/components/ui/button'
import React from 'react'
import CompanionCard from "@/components/CompanionCard";
import CTA from "@/components/CTA";
import CompanionList from "@/components/CompanionList";
import {recentSessions} from "@/constants";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const Page = async  () => {
    //fetching the all companions and sessions
    const companions = await getAllCompanions({limit: 3})
    const recentSessionsCompanions = await getRecentSessions(10)


  return (
    <main>
     
      <h1 className='text-2xl underline'>
        Popular Companions
      </h1>
      <section className='home-section'>
          {companions.map((companion) => (
              <CompanionCard
                    key={companion.id}
                  {...companion}
                  color={getSubjectColor(companion.subject)}
              />
          ))}


      </section>
      <section className='home-section'>
          <CompanionList
            title="Recently Completed Sessions"
            companions={recentSessionsCompanions}
            classNames="w-2/3 max-lg:w-full"
          />
          <CTA />
      </section>

    </main>
  )
}

export default Page