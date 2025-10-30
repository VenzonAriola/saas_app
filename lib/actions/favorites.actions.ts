"use server"

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

// ✅ Toggle favorite
export const toggleFavorite = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) throw new Error("Not authenticated");

    // Check if already favorited
    const { data: existing, error: fetchError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("companion_id", companionId)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows found
        throw new Error(fetchError.message);
    }

    if (existing) {
        // Remove from favorites
        const { error: deleteError } = await supabase
            .from("favorites")
            .delete()
            .eq("id", existing.id);

        if (deleteError) throw new Error(deleteError.message);

        return { favorited: false };
    } else {
        // Add to favorites
        const { error: insertError } = await supabase.from("favorites").insert([
            { user_id: userId, companion_id: companionId },
        ]);

        if (insertError) throw new Error(insertError.message);

        return { favorited: true };
    }
};

// ✅ Get user's favorites
export const getUserFavorites = async () => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) return [];

    const { data, error } = await supabase
        .from("favorites")
        .select("companion_id")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }

    return data.map((item) => item.companion_id);
};
