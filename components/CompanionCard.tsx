'use client'

import Image from "next/image"
import Link from "next/link";
import {id} from "zod/locales";
import {toggleFavorite} from "@/lib/actions/favorites.actions";
import {useState, useTransition} from "react";


interface CompanionCardProps {
    id:string,
    name:string,
    topic: string,
    subject: string,
    duration: number,
    color: string,
    isBookmarked?: boolean,
}


const CompanionCard = ({id,name,topic,subject,duration,color, isBookmarked = false}:
CompanionCardProps) => {

    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const [isPending, startTransition] = useTransition();

    const handleBookmark = () =>{
        setBookmarked(!isBookmarked); //instant UI feedback
        startTransition(async () => {
            try {
                await toggleFavorite(id);
            } catch (err){
                console.log(err);
                setBookmarked(!isBookmarked);
            }
        })
    }

    return (
        <article className="companion-card" style={{backgroundColor:color}}>
            <div className="flex items-center justify-between">
                <div className="subject-badge">{subject}</div>
                    <input type="hidden" name="companionId" value={id}/>
                    <button onClick={handleBookmark} className="companion-bookmark" disabled={isPending} >
                        <Image
                            src={bookmarked? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
                            alt="bookmark"
                            width={12.5}
                            height={15}
                        />
                    </button>
            </div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm">{topic}</p>
            <div className="flex items-center gap-2">
            <Image src="/icons/clock.svg" alt="duration"
            width={14} height={14}/>
                <p className="text-sm font-semibold">{duration} mins duration </p>
            </div>
            <Link href={`/companion/${id}`} className="w-full" >
                <button className="btn-primary w-full justify-center">Launch Lesson</button>
            </Link>
        </article>
    )
}
export default CompanionCard
