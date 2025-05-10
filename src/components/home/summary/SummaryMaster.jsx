
import React from 'react'
import SummaryNav from './SummaryNav'
import SummaryCounts from './SummaryCounts'
import SummaryStatus from './SummaryStatus'
import SummaryTeams from './SummaryTeam'

const SummaryMaster = () => {
  return (
    <section className='flex flex-col gap-6 px-5 lg:px-10 xl:px-15'>
      <SummaryNav />
      <SummaryCounts/>
      <SummaryStatus/>
      <SummaryTeams />
    </section>
  )
}

export default SummaryMaster
