insert into announcements (id, title_en, title_mr, body_en, body_mr, severity, starts_at, ends_at, is_pinned, status)
values (
  'ann-anand-mela-stall',
  'Book your stall - Anand Mela',
  'आनंद मेळा - तुमचा स्टॉल बुक करा',
  'Saturday, 19 September, 6:00 PM onwards at E Building Driveway. Homemade food, handicraft and art, fashion and style, jewellery and gifts, games, and more are welcome. Resident stall: Rs. 500; outside vendor: Rs. 1,000; extra table: Rs. 200. One table and two chairs included. Setup starts at 5:00 PM. Payment remains offline. Contact Mousami at +91 82176 27165 by 14 September.',
  'शनिवार, १९ सप्टेंबर, संध्याकाळी ६ पासून E बिल्डिंग ड्राइव्हवे येथे आनंद मेळा. घरगुती खाद्यपदार्थ, हस्तकला, फॅशन, दागिने, भेटवस्तू, खेळ आणि इतर स्टॉलचे स्वागत आहे. रहिवासी स्टॉल: रु. ५००; बाहेरील विक्रेता: रु. १,०००; अतिरिक्त टेबल: रु. २००. एक टेबल आणि दोन खुर्च्या समाविष्ट. सेटअप संध्याकाळी ५ पासून. पेमेंट ऑफलाइन आहे. १४ सप्टेंबरपर्यंत मौसमी यांच्याशी +९१ ८२१७६ २७१६५ वर संपर्क साधा.',
  'information',
  '2026-09-01 08:00:00+05:30',
  '2026-09-19 18:00:00+05:30',
  true,
  'published'
)
on conflict (id) do update set
  title_en = excluded.title_en,
  title_mr = excluded.title_mr,
  body_en = excluded.body_en,
  body_mr = excluded.body_mr,
  severity = excluded.severity,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  is_pinned = excluded.is_pinned,
  status = excluded.status;
