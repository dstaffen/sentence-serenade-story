
-- Add analytics and expiration fields to games table
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
ADD COLUMN IF NOT EXISTS theme_id uuid,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone;

-- Create themes table for optional starting prompts
CREATE TABLE IF NOT EXISTS public.themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  starting_prompts text[] NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert some default themes
INSERT INTO public.themes (name, description, starting_prompts) VALUES
('Adventure', 'Epic journeys and quests', ARRAY[
  'The old map led us to a door that shouldn''t exist...',
  'As the last light faded, we realized we weren''t alone in the forest...',
  'The compass spun wildly, pointing to something beyond magnetic north...'
]),
('Mystery', 'Puzzles and secrets to uncover', ARRAY[
  'The library book was returned 50 years late, but it looked brand new...',
  'Every mirror in the house showed a different reflection...',
  'The message was written in a code that didn''t exist until yesterday...'
]),
('Sci-Fi', 'Future worlds and technology', ARRAY[
  'The AI said three words that changed everything: "I remember you..."',
  'When we finally received the signal from space, we realized it was our own...',
  'The time machine worked perfectly, except for one small detail...'
]),
('Fantasy', 'Magic and mythical worlds', ARRAY[
  'The dragon apologized, which was more terrifying than its roar...',
  'Magic returned to the world at exactly 3:42 PM on a Tuesday...',
  'The spell worked, but not in the way anyone expected...'
]),
('Romance', 'Love stories and relationships', ARRAY[
  'The love letter was delivered to the wrong person, but at the right time...',
  'We met in a bookstore during a power outage...',
  'The dating app matched me with someone I''d never forget...'
]),
('Horror', 'Spine-chilling tales', ARRAY[
  'The children''s laughter echoed from the empty playground at midnight...',
  'The family photo showed one extra person every time we looked...',
  'The basement door we sealed last week was standing wide open...'
]);

-- Create analytics view for host dashboard
CREATE OR REPLACE VIEW public.host_analytics AS
SELECT 
  host_email,
  COUNT(*) as total_games,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_games,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_games,
  AVG(CASE 
    WHEN status = 'completed' AND completed_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (completed_at - created_at))/3600 
  END) as avg_completion_hours,
  MAX(created_at) as last_game_created
FROM public.games
GROUP BY host_email;

-- Enable RLS on themes table (public read access)
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read themes
CREATE POLICY "Anyone can view themes" 
  ON public.themes 
  FOR SELECT 
  USING (true);

-- Create function to auto-expire games
CREATE OR REPLACE FUNCTION auto_expire_games()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.games 
  SET status = 'expired'
  WHERE status = 'active' 
    AND expires_at < now();
END;
$$;

-- Create trigger to update completed_at when game status changes to completed
CREATE OR REPLACE FUNCTION update_completed_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_completed_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_at();
