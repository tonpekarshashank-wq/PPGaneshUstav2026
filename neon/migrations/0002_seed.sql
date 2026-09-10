insert into announcements (id, title_en, title_mr, body_en, body_mr, severity, starts_at, ends_at, is_pinned, status)
values (
  'ann-welcome',
  'Ganeshotsav schedule is ready for committee review',
  'गणेशोत्सव वेळापत्रक समिती पुनरावलोकनासाठी तयार आहे',
  'Please confirm translations, venues, contacts, and participation rules before publishing to residents.',
  'रहिवाशांसाठी प्रकाशित करण्यापूर्वी भाषांतर, ठिकाणे, संपर्क आणि सहभाग नियम तपासा.',
  'important',
  '2026-09-01 08:00:00+05:30',
  '2026-09-25 23:00:00+05:30',
  true,
  'published'
) on conflict (id) do nothing;

insert into events (id, slug, name_en, name_mr, description_en, description_mr, starts_at, ends_at, venue_en, venue_mr, category, state, status, display_order, sample_content)
values
('event-1','2026-09-14-shri-ganesh-idol-installation-and-pran-pratishtha','Shri Ganesh Idol Installation and Pran Pratishtha','श्री गणेश मूर्ती स्थापना व प्राणप्रतिष्ठा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-14 11:00:00+05:30','2026-09-14 12:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Puja','scheduled','published',1,true),
('event-2','2026-09-15-haldi-kumkum-ceremony-and-21-recitations-of-ganapati-atharvashirsha','Haldi-Kumkum Ceremony and 21 Recitations of Ganapati Atharvashirsha','हळदी-कुंकू समारंभ आणि गणपती अथर्वशीर्ष २१ आवर्तन','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-15 19:00:00+05:30','2026-09-15 20:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Religious / Community','scheduled','published',2,true),
('event-3','2026-09-16-childrens-chess-and-carrom-competition','Children''s Chess and Carrom Competition','लहान मुलांची बुद्धिबळ व कॅरम स्पर्धा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-16 20:30:00+05:30','2026-09-16 21:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Kids / Competition','scheduled','published',3,true),
('event-4','2026-09-17-bhajan-by-sita-bhajani-mandal-palladium-plus','Bhajan by Sita Bhajani Mandal, Palladium Plus','भजन – सीता भजनी मंडळ, पॅलेडियम प्लस','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-17 18:00:00+05:30','2026-09-17 19:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Cultural / Devotional','scheduled','published',4,true),
('event-5','2026-09-18-childrens-fancy-dress-and-dance-competition','Children''s Fancy Dress and Dance Competition','लहान मुलांची फॅन्सी ड्रेस व नृत्य स्पर्धा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-18 20:30:00+05:30','2026-09-18 21:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Kids / Competition','scheduled','published',5,true),
('event-6','2026-09-18-movie-night-mahaprabhu-jagannath','Movie Night - Mahaprabhu Jagannath','मूव्ही नाईट – महाप्रभू जगन्नाथ','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-18 21:15:00+05:30','2026-09-18 22:15:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Entertainment','scheduled','published',6,true),
('event-7','2026-09-19-health-check-up-camp','Health Check-up Camp','आरोग्य तपासणी शिबिर','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-19 10:00:00+05:30','2026-09-19 11:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Health / Community','scheduled','published',7,true),
('event-8','2026-09-19-childrens-drawing-competition','Children''s Drawing Competition','लहान मुलांची चित्रकला स्पर्धा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-19 10:00:00+05:30','2026-09-19 11:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Kids / Competition','scheduled','published',8,true),
('event-9','2026-09-19-rangoli-competition','Rangoli Competition','रांगोळी स्पर्धा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-19 10:00:00+05:30','2026-09-19 11:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Competition','scheduled','published',9,true),
('event-10','2026-09-19-anand-mela','Anand Mela','आनंद मेळा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-19 18:00:00+05:30','2026-09-19 19:00:00+05:30','E Building Driveway','E बिल्डिंग ड्राइव्हवे','Community / Marketplace','scheduled','published',10,true),
('event-11','2026-09-20-shri-satyanarayan-maha-puja','Shri Satyanarayan Maha Puja','श्री सत्यनारायण महापूजा','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-20 10:00:00+05:30','2026-09-20 11:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Puja','scheduled','published',11,true),
('event-12','2026-09-20-bhajan-by-sant-dnyaneshwar-bhajani-mandal-pune','Bhajan by Sant Dnyaneshwar Bhajani Mandal, Pune','भजन – संत ज्ञानेश्वर भजनी मंडळ, पुणे','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-20 17:00:00+05:30','2026-09-20 18:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Cultural / Devotional','scheduled','published',12,true),
('event-13','2026-09-20-mahaprasad-bhandara','Mahaprasad (Bhandara)','महाप्रसाद (भंडारा)','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-20 21:00:00+05:30','2026-09-20 22:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Community','scheduled','published',13,true),
('event-14','2026-09-21-lemon-and-spoon-race-for-children-and-musical-chairs-for-women','Lemon-and-Spoon Race for Children and Musical Chairs for Women','लिंबू चमचा (लहान मुले) आणि संगीत खुर्ची (महिलांसाठी)','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-21 20:30:00+05:30','2026-09-21 21:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Games / Competition','scheduled','published',14,true),
('event-15','2026-09-22-karaoke-night-for-senior-citizens','Karaoke Night for Senior Citizens','कराओके नाईट – ज्येष्ठांसाठी','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-22 20:30:00+05:30','2026-09-22 21:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Cultural','scheduled','published',15,true),
('event-16','2026-09-23-special-presentation-by-shri-gurudev-tabla-academy-pune','Special Presentation by Shri Gurudev Tabla Academy, Pune','विशेष सादरीकरण – श्री गुरुदेव तबला अकादमी, पुणे','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-23 19:00:00+05:30','2026-09-23 20:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Cultural','scheduled','published',16,true),
('event-17','2026-09-24-tambola','Tambola','तंबोला','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-24 20:30:00+05:30','2026-09-24 21:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Games','scheduled','published',17,true),
('event-18','2026-09-25-lezim-and-flag-troupe-presentation','Lezim and Flag Troupe Presentation','लेझीम–ध्वज पथक सादरीकरण','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-25 16:00:00+05:30','2026-09-25 17:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Cultural / Procession','scheduled','published',18,true),
('event-19','2026-09-25-maha-aarti','Maha Aarti','महाआरती','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-25 16:30:00+05:30','2026-09-25 17:30:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Aarti','scheduled','published',19,true),
('event-20','2026-09-25-visarjan-procession','Visarjan Procession','विसर्जन मिरवणूक','Poster-transcribed event. English translation requires final committee proofread before go-live.','पोस्टरवरून घेतलेला कार्यक्रम. अंतिम प्रकाशनापूर्वी समितीने तपासणी करावी.','2026-09-25 17:00:00+05:30','2026-09-25 20:00:00+05:30','Palladium Plus Society','पॅलेडियम प्लस सोसायटी','Visarjan','scheduled','published',20,true)
on conflict (id) do nothing;

insert into aarti_slots (id, event_date, period, label_en, label_mr, starts_at, reporting_at, capacity, booking_opens_at, booking_closes_at, waitlist_enabled, status)
select
  'aarti-' || to_char(d::date, 'YYYY-MM-DD') || '-' || p.period,
  d::date,
  p.period,
  case when p.period = 'morning' then 'Morning Aarti' else 'Evening Aarti' end,
  case when p.period = 'morning' then 'सकाळची आरती' else 'संध्याकाळची आरती' end,
  (d::date + case when p.period = 'morning' then time '08:00' else time '20:00' end) at time zone 'Asia/Kolkata',
  (d::date + case when p.period = 'morning' then time '07:45' else time '19:45' end) at time zone 'Asia/Kolkata',
  1,
  timestamp with time zone '2026-09-01 08:00:00+05:30',
  (d::date + case when p.period = 'morning' then time '02:00' else time '14:00' end) at time zone 'Asia/Kolkata',
  false,
  'open'
from generate_series(date '2026-09-15', date '2026-09-25', interval '1 day') d
cross join (values ('morning'), ('evening')) as p(period)
where not (d::date = date '2026-09-25' and p.period = 'evening')
on conflict (id) do nothing;

insert into activities (id, event_id, name_en, name_mr, results_status)
select 'activity-' || id, id, name_en, name_mr, 'draft'
from events
where category like '%Competition%' or category in ('Games', 'Community / Marketplace')
on conflict (id) do nothing;
