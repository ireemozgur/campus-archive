-- Kullanıcı profilleri (Auth tetikleyicisi ile otomatik oluşur)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  university TEXT,
  department TEXT,
  grade TEXT,
  avatar_url TEXT,
  is_mentor BOOLEAN DEFAULT false,
  mentor_bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes profil görebilir" ON profiles FOR SELECT USING (true);
CREATE POLICY "Kullanıcı kendi profilini düzenleyebilir" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Ders notları
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  page_count INT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  department TEXT,
  course_code TEXT,
  rating FLOAT DEFAULT 0,
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes notları görebilir" ON notes FOR SELECT USING (true);
CREATE POLICY "Kullanıcı kendi notlarını ekleyebilir" ON notes FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi notlarını düzenleyebilir" ON notes FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi notlarını silebilir" ON notes FOR DELETE USING (auth.uid() = author_id);

-- Çıkmış sınav soruları
CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  year TEXT NOT NULL,
  type TEXT NOT NULL, -- Vize, Final, Bütünleme
  file_url TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes sınavları görebilir" ON exams FOR SELECT USING (true);
CREATE POLICY "Kullanıcı kendi sınavlarını ekleyebilir" ON exams FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi sınavlarını düzenleyebilir" ON exams FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi sınavlarını silebilir" ON exams FOR DELETE USING (auth.uid() = author_id);

-- Ekip arkadaşı ilanları
CREATE TABLE teammate_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL, -- Web, Mobile, AI, Game, etc.
  skills_needed TEXT[],
  team_size INT,
  image_url TEXT,
  listing_type TEXT DEFAULT 'ekip', -- ekip or topluluk
  author_id UUID REFERENCES profiles(id) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicants INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE teammate_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes ilanları görebilir" ON teammate_listings FOR SELECT USING (true);
CREATE POLICY "Kullanıcı ilan ekleyebilir" ON teammate_listings FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi ilanlarını düzenleyebilir" ON teammate_listings FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Kullanıcı kendi ilanlarını silebilir" ON teammate_listings FOR DELETE USING (auth.uid() = author_id);

-- İlan başvuruları
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES teammate_listings(id) NOT NULL,
  applicant_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(listing_id, applicant_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "İlan sahibi başvuruları görebilir" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM teammate_listings WHERE id = listing_id AND author_id = auth.uid())
  OR applicant_id = auth.uid()
);
CREATE POLICY "Kullanıcı başvuru yapabilir" ON applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Profil oluşturma tetikleyicisi
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
