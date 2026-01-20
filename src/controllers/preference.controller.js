import { supabase } from "../config/supabase.js";

export const submitPreferences = async (req, res) => {
  const { preferences } = req.body;
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.authorization
  );

  await supabase
    .from("Preferences")
    .delete()
    .eq("staff_id", user.id);

  const insertData = preferences.map(p => ({
    staff_id: user.id,
    course_id: p.course_id,
    preference_rank: p.rank
  }));

  const { error } = await supabase
    .from("Preferences")
    .insert(insertData);

  if (error) return res.status(400).json({ error });

  res.json({ message: "Preferences saved" });
};
