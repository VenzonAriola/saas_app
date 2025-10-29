'use server'

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";

//server action to post companion to supabase
export const createCompanion = async (formData: CreateCompanion) => {
    //destructuring the user id and supabase database
    const {userId: author} = await auth();
    const supabase = createSupabaseClient();

    const {data, error} = await supabase
        .from('companions')
        .insert({...formData, author})
        .select()


    if (error || !data) throw new Error(error?.message || "Failed to create companion");

    return data[0];

}

//server action to fetch all companions created
//GetAllCompanions is from index.d.ts file
export const getAllCompanions = async ({limit=10, page=1, subject, topic}: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if(subject && topic ){
        query =query.ilike('subject', `%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject){
        query =query.ilike('subject', `%${subject}%`)
    }
    else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page-1)*limit, page * limit - 1)

    const {data: companions, error} = await query;

    if(error) throw new Error(error?.message);

    return companions;

}
//get companion server action
export const getCompanion = async(id: string)=>{
    const supabase =createSupabaseClient();


    const {data,error} = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if(error) return console.log(error)

    return data[0];
}

//post to session history supabase
export const addToSessionHistory = async (companionId : string) =>{
    const {userId} = await auth();
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.from('session_history')
        .insert({
            companion_id:companionId,
            user_id: userId,
    })

    if(error) throw new Error(error.message);

    return data;

}

//get recenSessions
export const getRecentSessions = async (limit=10) =>{
    const supabase = createSupabaseClient();
    const {data, error} = await supabase
        .from('session_history')
        .select(`companion:companion_id (*)`)
        .order('created_at', {ascending: false})
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({companion}) => companion);
}

//get user sessions
export const getUserSessions = async (userId:string, limit=10) =>{
    const supabase = createSupabaseClient();
    const {data, error} = await supabase
        .from('session_history') //refer to session_history in supabase
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', {ascending: false})
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({companions}) => companions);
}

export const getUserCompanions = async (userId:string) =>{
    const supabase = createSupabaseClient();
    const {data, error} = await supabase
        .from('companions') //refer to companions in supabase
        .select()
        .eq('author', userId)


    if(error) throw new Error(error.message);

    return data;
}

//server action to execute subscriptions
export const newCompanionPermissions = async () =>{
    const {userId, has} = await auth();
    const supabase = createSupabaseClient();

    let limit=0;

    if(has({plan:'pro'})){
        return true;
        //feature: should match the key in clerk billing for the plan under configure > subscription
    } else if(has({feature:'3_companion_limit'})){
        limit =3;
    } else if(has({feature:'10_companion_limit'})){
        limit =10;
    }

    const {data, error} = await supabase
        .from('companions')
        .select('id',{count: 'exact'})
        .eq('author',userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit){
        return false;
    }else {
        return true;
    }
}
