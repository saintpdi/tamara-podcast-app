-- Insert sample profiles
INSERT INTO profiles (
  id,
  username,
  display_name,
  bio,
  avatar_url,
  is_verified
) VALUES 
(
  gen_random_uuid(),
  'sarah_dance',
  'Sarah Johnson',
  'Dance instructor & choreographer 💃 Teaching moves that make you feel amazing!',
  'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
  true
),
(
  gen_random_uuid(),
  'foodie_mike',
  'Mike Chen',
  'Home chef sharing delicious recipes 🍝 Making cooking accessible for everyone!',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  true
),
(
  gen_random_uuid(),
  'art_lover_emma',
  'Emma Wilson',
  'Digital artist & speed painter 🎨 Creating beauty in 60 seconds or less!',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  true
),
(
  gen_random_uuid(),
  'tech_guru_alex',
  'Alex Rodriguez',
  'Tech enthusiast sharing tips & tricks 📱 Making technology work for you!',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  true
),
(
  gen_random_uuid(),
  'fitness_jane',
  'Jane Smith',
  'Certified personal trainer 💪 Quick workouts for busy people!',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  true
) ON CONFLICT (username) DO NOTHING;