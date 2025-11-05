'use client'

import Image from "next/image"
import Link from "next/link";
import {removeFavorite} from "@/lib/actions/favorites.actions";
import {addFavorite} from "@/lib/actions/favorites.actions";
import {usePathname} from "next/navigation";
import {useState} from "react";


interface CompanionCardProps {
    id:string;
    name:string;
    topic: string;
    subject: string;
    duration: number;
    color: string;
    favorite: boolean;
}


const CompanionCard = ({id,name,topic,subject,duration,color, favorite}:
CompanionCardProps) => {

    const pathname =usePathname();
   const [isFavorite, setIsFavorite] = useState(favorite);


    const handleFavorite = async () =>{
    //     if (favorite) {
    //         await removeFavorite(id, pathname);
    //     } else {
    //         await addFavorite(id, pathname);
    //     }
    //};
            try {
            if (isFavorite) {
                await removeFavorite(id, pathname);
                setIsFavorite(false);
            } else {
                await addFavorite(id, pathname);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };


    return (
        <article className="companion-card" style={{backgroundColor:color}}>
            <div className="flex items-center justify-between">
                <div className="subject-badge">{subject}</div>
                    <button className="companion-bookmark" onClick={handleFavorite} >
                        <Image
                            src={ isFavorite ? "/icons/bookmark-filled.svg" : "icons/bookmark.svg" }
                            alt="favorite"
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
