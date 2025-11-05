'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// ADD FAVORITE
export const addFavorite = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = createSupabaseClient();

    // 🧠 Check first if this favorite already exists
    const { data: existing, error: checkError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("companion_id", companionId)
        .maybeSingle();

    if (checkError) {
        console.error("Check error:", checkError.message);
        return;
    }

    // ✅ Skip inserting if it already exists
    if (existing) {
        console.log("Favorite already exists, skipping insert.");
        return existing;
    }

    // 🔥 Otherwise insert
    const { data, error } = await supabase
        .from("favorites")
        .insert({
            companion_id: companionId,
            user_id: userId,
        })
        .select();

    if (error) {
        console.error("Insert error:", error.message);
        throw new Error(error.message);
    }

    revalidatePath(path);
    return data;
};

// REMOVE FAVORITE
export const removeFavorite = async (companionId: string, path: string) => {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("favorites")
        .delete()
        .eq("companion_id", companionId)
        .eq("user_id", userId);

    if (error) {
        console.error("Delete error:", error.message);
        throw new Error(error.message);
    }

    revalidatePath(path);
    return data;
};

// GET FAVORITE COMPANIONS
export const getFavoriteCompanion = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("favorites")
        .select(`companions:companion_id(*)`)
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return data.map(({ companions }) => companions);
};
