import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SubjectFilter from "@/components/SubjectFilter";
import SearchInput from "@/components/SearchInput";
import {getUserFavorites} from "@/lib/actions/favorites.actions";


const CompanionsLibrary = async ({searchParams}: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject: '';
    const topic = filters.topic ? filters.topic: '';

 const companions = await getAllCompanions({subject, topic});
 const favoriteIds = await getUserFavorites();

 console.log(companions);

    return (
   <main>
       <section className="flex justify-between gap-4 max-sm:flex-col">
           <h1>Companion Library</h1>
           <div className="flex gap-4">
               <SearchInput />
               <SubjectFilter />
           </div>
       </section>
       {favoriteIds.length > 0 && (
           <section>
               <h2 className="text-xl font-semibold mb-3">Favorites</h2>
               <div className="companions-grid">
                   {companions
                       .filter((c)=> favoriteIds.includes(c))
                       .map((fav)=>(
                           <CompanionCard
                           key={fav.id}
                           {...fav}
                           color={getSubjectColor(fav.subject)}
                           isBookmarked={true}
                           />
                       ))}
               </div>
           </section>
       )}

       <section className="companions-grid">
           {companions.map((companion) => (

               <CompanionCard key={companion.id}
                              {...companion}
                                color={getSubjectColor(companion.subject)}
               />
           ))}
       </section>
   </main>
  )
}

export default CompanionsLibrary