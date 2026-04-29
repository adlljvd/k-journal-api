import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as argon2 from 'argon2';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Predefined genres from SPEC
const genres = [
  { name: 'Romance', slug: 'romance' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Action', slug: 'action' },
  { name: 'Historical', slug: 'historical' },
  { name: 'Medical', slug: 'medical' },
  { name: 'Legal', slug: 'legal' },
  { name: 'School', slug: 'school' },
  { name: 'Slice of Life', slug: 'slice-of-life' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Supernatural', slug: 'supernatural' },
  { name: 'Noir', slug: 'noir' },
  { name: 'Music', slug: 'music' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Political', slug: 'political' },
];

// K-drama and K-movie content data
const contentData = [
  // POPULAR DRAMAS
  {
    title: 'Crash Landing on You',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A South Korean heiress accidentally paraglides into North Korea and falls in love with an army officer who helps hide her.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/8Y4NVN9tzOxCwl0Ij1YxgEfAryP.jpg',
    genres: ['Romance', 'Drama', 'Comedy'],
    cast: 'Hyun Bin, Son Ye-jin, Seo Ji-hye, Kim Jung-hyun',
    episodes: 16,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Goblin',
    type: 'DRAMA' as const,
    year: 2016,
    synopsis:
      'A 939-year-old goblin seeks to end his immortal life by finding a human bride who can remove the sword stuck in his chest.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/b2FSzoSO2yYB9gZH5v80slz5kh.jpg',
    genres: ['Romance', 'Fantasy', 'Drama'],
    cast: 'Gong Yoo, Kim Go-eun, Lee Dong-wook, Yoo In-na',
    episodes: 16,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Itaewon Class',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      "An ex-convict opens a bar in Itaewon and seeks revenge on the man responsible for his father's death.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/2VMFiOt6qhkPgYbQM1HKD2Zdhr.jpg',
    genres: ['Drama', 'Romance', 'Action'],
    cast: 'Park Seo-joon, Kim Da-mi, Yoo Jae-myung, Kwon Nara',
    episodes: 16,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Vincenzo',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'A Korean-Italian mafia lawyer returns to Korea and uses unconventional methods to take down a corrupt conglomerate.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/t79C6J6U5t5HPzqdBgWmpPiSlC.jpg',
    genres: ['Comedy', 'Drama', 'Action'],
    cast: 'Song Joong-ki, Jeon Yeo-been, Ok Taec-yeon, Kim Yeo-jin',
    episodes: 20,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Squid Game',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    genres: ['Thriller', 'Drama', 'Action'],
    cast: 'Lee Jung-jae, Park Hae-soo, Wi Ha-jun, HoYeon Jung',
    episodes: 9,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Descendants of the Sun',
    type: 'DRAMA' as const,
    year: 2016,
    synopsis:
      'A special forces captain and a surgeon fall in love while on a peacekeeping mission in a fictional war-torn country.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/3qkND5QHp0eOCY4yG2dZE6XnSjl.jpg',
    genres: ['Romance', 'Drama', 'Action'],
    cast: 'Song Joong-ki, Song Hye-kyo, Jin Goo, Kim Ji-won',
    episodes: 16,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Reply 1988',
    type: 'DRAMA' as const,
    year: 2015,
    synopsis:
      'Five families live on the same street in a Seoul neighborhood, dealing with life together through the late 1980s.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/d4HKGc0dEhCYAaK0j9PhvJgJ9R7.jpg',
    genres: ['Comedy', 'Drama', 'Slice of Life'],
    cast: 'Lee Hye-ri, Park Bo-gum, Ryu Jun-yeol, Go Kyung-pyo',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'My Love from the Star',
    type: 'DRAMA' as const,
    year: 2013,
    synopsis:
      'An alien who landed on Earth 400 years ago is about to return home when he falls in love with a famous actress.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/5TKN7rrYcyUVW2JyLIezHqPBB1.jpg',
    genres: ['Romance', 'Comedy', 'Fantasy'],
    cast: 'Kim Soo-hyun, Jun Ji-hyun, Park Hae-jin, Yoo In-na',
    episodes: 21,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hospital Playlist',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'Five doctors who have been friends since medical school work at the same hospital and play in a band together.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/5L0ylfFKGmhMzmJwKxMXVTbhLr.jpg',
    genres: ['Medical', 'Drama', 'Comedy'],
    cast: 'Jo Jung-suk, Yoo Yeon-seok, Jung Kyung-ho, Kim Dae-myung',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Healer',
    type: 'DRAMA' as const,
    year: 2014,
    synopsis:
      'A mysterious night courier with combat skills gets involved with a reporter and discovers dark secrets from the past.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/sD3d4Bf1GqMSlXXkGvEjI9Z3gqK.jpg',
    genres: ['Action', 'Romance', 'Thriller'],
    cast: 'Ji Chang-wook, Park Min-young, Yoo Ji-tae, Kim Mi-kyung',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Signal',
    type: 'DRAMA' as const,
    year: 2016,
    synopsis:
      'A detective from the present communicates with a detective from the past through a mysterious walkie-talkie to solve cold cases.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/wBK4v3jcnDzNxzRq6n1Wx7RYJnG.jpg',
    genres: ['Thriller', 'Mystery', 'Drama'],
    cast: 'Lee Je-hoon, Kim Hye-soo, Cho Jin-woong',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Stranger',
    type: 'DRAMA' as const,
    year: 2017,
    synopsis:
      "A prosecutor lacking emotions and a passionate detective team up to uncover corruption in the prosecutor's office.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/pQe3uK1z5U6p0ZlNjZzRkNsNcb.jpg',
    genres: ['Thriller', 'Mystery', 'Legal'],
    cast: 'Cho Seung-woo, Bae Doona, Lee Joon-hyuk',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Sky Castle',
    type: 'DRAMA' as const,
    year: 2018,
    synopsis:
      'Wealthy families living in an exclusive residential area go to extreme lengths to get their children into top universities.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/cVfKhA2DpBqxexrxYr4vLXpZzzp.jpg',
    genres: ['Drama', 'Comedy', 'Slice of Life'],
    cast: 'Yum Jung-ah, Lee Tae-ran, Yoon Se-ah, Oh Na-ra',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Mr. Sunshine',
    type: 'DRAMA' as const,
    year: 2018,
    synopsis:
      'A Korean boy born into slavery escapes to America and returns as a U.S. Marine Corps officer during the early 1900s.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/1kUvZnB2eJfDuFNdnkYwQWbNdoS.jpg',
    genres: ['Historical', 'Drama', 'Romance'],
    cast: 'Lee Byung-hun, Kim Tae-ri, Yoo Yeon-seok, Byun Yo-han',
    episodes: 24,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Kingdom',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A crown prince investigates a mysterious plague that turns people into zombies while fighting political enemies.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/wNFbcH5K3LW8vqIYvPHn5IdRDj5.jpg',
    genres: ['Action', 'Horror', 'Historical'],
    cast: 'Ju Ji-hoon, Ryu Seung-ryong, Bae Doona, Kim Sang-ho',
    episodes: 6,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Crash Course in Romance',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A former national handball player runs a side dish shop and crosses paths with a popular math instructor.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/aLgd5tXhUfYjXj5CLnVc9wF7ZkG.jpg',
    genres: ['Romance', 'Comedy', 'Drama'],
    cast: 'Jeon Do-yeon, Jung Kyung-ho, Oh Eui-sik, Roh Yoon-seo',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Extraordinary Attorney Woo',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A brilliant attorney on the autism spectrum navigates her first job at a major law firm with unique perspectives.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/yq6zYKV31xntU4QX4Tfj5XZ3lTM.jpg',
    genres: ['Legal', 'Drama', 'Comedy'],
    cast: 'Park Eun-bin, Kang Tae-oh, Kang Ki-young, Joo Jong-hyuk',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hometown Cha-Cha-Cha',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'A dentist from Seoul moves to a seaside village and meets a mysterious jack-of-all-trades who helps everyone.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7GXqLzNcY3D5TLpCgn0Cq7vN7P.jpg',
    genres: ['Romance', 'Comedy', 'Slice of Life'],
    cast: 'Shin Min-a, Kim Seon-ho, Lee Sang-yi, Gong Min-jung',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'True Beauty',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A high school student masters the art of makeup to hide her bare face and becomes a social media sensation.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/mQWR6onP7ab7aKoFniN0EA4jMb0.jpg',
    genres: ['Romance', 'Comedy', 'School'],
    cast: 'Moon Ga-young, Cha Eun-woo, Hwang In-youp, Park Yoo-na',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Taxi Driver',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'A special taxi service offers revenge on behalf of victims who did not receive proper justice from the law.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/4m5mnTbvdZ5hDlz3PPAf5eS4RjJ.jpg',
    genres: ['Action', 'Drama', 'Thriller'],
    cast: 'Lee Je-hoon, Kim Eui-sung, Pyo Ye-jin, Jang Hyuk-jin',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  // MORE DRAMAS
  {
    title: 'Pinocchio',
    type: 'DRAMA' as const,
    year: 2014,
    synopsis:
      'A young man with a traumatic past becomes a reporter and teams up with a woman who hiccupps when she lies.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/ydc0pYKlWfPdEnKhGfkSgXrjNkd.jpg',
    genres: ['Romance', 'Drama', 'Comedy'],
    cast: 'Lee Jong-suk, Park Shin-hye, Kim Young-kwang, Lee Yu-bi',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'While You Were Sleeping',
    type: 'DRAMA' as const,
    year: 2017,
    synopsis:
      'A woman who can see future events in her dreams meets a prosecutor and a police officer with similar abilities.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/rsw6JxKxUvFzYzXwo7czT2GrRwO.jpg',
    genres: ['Romance', 'Fantasy', 'Thriller'],
    cast: 'Lee Jong-suk, Bae Suzy, Lee Sang-yeob, Jung Hae-in',
    episodes: 32,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Weightlifting Fairy Kim Bok-joo',
    type: 'DRAMA' as const,
    year: 2016,
    synopsis:
      'A talented weightlifter navigates college life, friendship, and her first love while pursuing her athletic dreams.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/9h3H4uZ3xlNxZ0sTgfAuZxKaHNv.jpg',
    genres: ['Romance', 'Comedy', 'School'],
    cast: 'Lee Sung-kyung, Nam Joo-hyuk, Lee Jae-yoon, Kyung Soo-jin',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: "What's Wrong with Secretary Kim",
    type: 'DRAMA' as const,
    year: 2018,
    synopsis:
      'A narcissistic vice chairman realizes he cannot live without his capable secretary when she decides to resign.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/5vHJGFsjcrLKEwoTGk4s5S5mAXW.jpg',
    genres: ['Romance', 'Comedy', 'Drama'],
    cast: 'Park Seo-joon, Park Min-young, Lee Tae-hwan, Kim Byeong-ok',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Start-Up',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A young woman dreams of becoming an entrepreneur like Steve Jobs and enters the world of startup companies.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Pjj5Z5j6zGPWq5Yeyx5b4eFcD.jpg',
    genres: ['Romance', 'Drama', 'Comedy'],
    cast: 'Bae Suzy, Nam Joo-hyuk, Kim Seon-ho, Kang Han-na',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Strong Woman Do Bong-soon',
    type: 'DRAMA' as const,
    year: 2017,
    synopsis:
      'A woman born with superhuman strength becomes the bodyguard of a wealthy CEO and fights crime.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/wxP2xmMNvLiVeMy7x6p3aFuP8PQ.jpg',
    genres: ['Romance', 'Comedy', 'Fantasy'],
    cast: 'Park Bo-young, Park Hyung-sik, Ji Soo, Ahn Jae-hong',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Chief Kim',
    type: 'DRAMA' as const,
    year: 2017,
    synopsis:
      'A skilled accountant embezzles company money but unexpectedly becomes a hero for the employees he exploited.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/yBbQM1oJ8Bgqs8rE9dvnQIi2ptV.jpg',
    genres: ['Comedy', 'Drama', 'Action'],
    cast: 'Namkoong Min, Nam Sang-mi, Lee Jun-ho, Jung Hye-sung',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Voice',
    type: 'DRAMA' as const,
    year: 2017,
    synopsis:
      'A former detective and a 911 call center employee work together to solve crimes using voice recordings.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/fBBgnPhfLrPAMfTuYwbKqXntNof.jpg',
    genres: ['Thriller', 'Mystery', 'Action'],
    cast: 'Jang Hyuk, Lee Ha-na, Baek Sung-hyun, Yesung',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Her Private Life',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A museum curator keeps her fangirl life a secret until her new boss discovers her double life.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/ct6T9uqXErFFmUHxJcGz2mG3mgH.jpg',
    genres: ['Romance', 'Comedy', 'Drama'],
    cast: 'Park Min-young, Kim Jae-wook, Ahn Bo-hyun, Park Jin-joo',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Ghosts',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A horror webtoon writer moves into a haunted building and encounters various ghosts with unfinished business.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/pa6Pjrs7nQv3wFp4nNz2v0JhgbH.jpg',
    genres: ['Horror', 'Comedy', 'Fantasy'],
    cast: 'Park Bo-young, Seo In-guk, Oh Jung-se, Kang Mi-na',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  // MOVIES
  {
    title: 'Parasite',
    type: 'MOVIE' as const,
    year: 2019,
    synopsis:
      'A poor family schemes to become employed by a wealthy household and infiltrate their lives.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    genres: ['Thriller', 'Drama', 'Comedy'],
    cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik',
    durationMinutes: 132,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Train to Busan',
    type: 'MOVIE' as const,
    year: 2016,
    synopsis:
      'Passengers on a train struggle to survive a zombie outbreak that spreads across South Korea.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/yFmXSPKjTEeSTGaVNAQYnz6xsLs.jpg',
    genres: ['Horror', 'Thriller', 'Action'],
    cast: 'Gong Yoo, Jung Yu-mi, Ma Dong-seok, Kim Su-an',
    durationMinutes: 118,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Oldboy',
    type: 'MOVIE' as const,
    year: 2003,
    synopsis:
      'A man is imprisoned for 15 years without explanation, then released and given five days to find his captor.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/k3bdxaw9Xbzjq57pE0PmVKdQJPk.jpg',
    genres: ['Thriller', 'Drama', 'Action'],
    cast: 'Choi Min-sik, Yoo Ji-tae, Kang Hye-jung',
    durationMinutes: 120,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'The Handmaiden',
    type: 'MOVIE' as const,
    year: 2016,
    synopsis:
      'A handmaiden is hired to serve a Japanese heiress, but she is secretly involved in a plot to defraud her.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/nB6RNHTz7D1kv0GiRhxeWIesR0d.jpg',
    genres: ['Drama', 'Thriller', 'Romance'],
    cast: 'Kim Min-hee, Kim Tae-ri, Ha Jung-woo, Cho Jin-woong',
    durationMinutes: 145,
    country: 'South Korea',
    isFeatured: true,
  },
  {
    title: 'Memories of Murder',
    type: 'MOVIE' as const,
    year: 2003,
    synopsis:
      "Detectives struggle to catch Korea's first serial killer in a rural province in the 1980s.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/5oTxpypPk7suwHmFJzsFGi6yKjk.jpg',
    genres: ['Thriller', 'Mystery', 'Drama'],
    cast: 'Song Kang-ho, Kim Sang-kyung, Kim Roi-ha, Park Hae-il',
    durationMinutes: 131,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Wailing',
    type: 'MOVIE' as const,
    year: 2016,
    synopsis:
      'A police officer investigates a series of mysterious deaths in a small village and suspects a Japanese stranger.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/4p7HHkPqItAzUvvr7Y2rMFNccYR.jpg',
    genres: ['Horror', 'Mystery', 'Thriller'],
    cast: 'Hwang Jung-min, Chun Woo-hee, Kwak Do-won, Jun Kunimura',
    durationMinutes: 156,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'A Taxi Driver',
    type: 'MOVIE' as const,
    year: 2017,
    synopsis:
      'A taxi driver from Seoul unknowingly drives a German reporter to the Gwangju Uprising in 1980.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/qI3K9VJj6AyVqNXZPIlCLbP9Mq1.jpg',
    genres: ['Drama', 'Action', 'Historical'],
    cast: 'Song Kang-ho, Thomas Kretschmann, Yoo Hae-jin, Ryu Jun-yeol',
    durationMinutes: 137,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Okja',
    type: 'MOVIE' as const,
    year: 2017,
    synopsis:
      'A young girl risks everything to save her best friend, a genetically modified super pig, from a multinational corporation.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/90pMXMwQmCcku9JAB6pPzGnmO9s.jpg',
    genres: ['Drama', 'Action', 'Sci-Fi'],
    cast: 'Ahn Seo-hyun, Tilda Swinton, Paul Dano, Byun Hee-bong',
    durationMinutes: 121,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Snowpiercer',
    type: 'MOVIE' as const,
    year: 2013,
    synopsis:
      'In a frozen future, survivors on a train revolt against the class system that divides them.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/uxzgWXlcY2m9AlBv5sPxl9MqHvx.jpg',
    genres: ['Sci-Fi', 'Action', 'Drama'],
    cast: 'Chris Evans, Song Kang-ho, Tilda Swinton, Jamie Bell',
    durationMinutes: 126,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Burning',
    type: 'MOVIE' as const,
    year: 2018,
    synopsis:
      'A young man reconnects with a childhood friend and becomes suspicious of her new mysterious boyfriend.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/w7fF0zqk8cWx5aL1ZtX9w9tWd8f.jpg',
    genres: ['Drama', 'Mystery', 'Thriller'],
    cast: 'Yoo Ah-in, Steven Yeun, Jeon Jong-seo',
    durationMinutes: 148,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Decision to Leave',
    type: 'MOVIE' as const,
    year: 2022,
    synopsis:
      'A detective falls for a widow who becomes a suspect in the death of her husband in the mountains.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/dK4fTxfYnCGxlxATUfPMU4fTLd4.jpg',
    genres: ['Romance', 'Mystery', 'Drama'],
    cast: 'Park Hae-il, Tang Wei, Lee Jung-hyun, Go Kyung-pyo',
    durationMinutes: 138,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Along with the Gods: The Two Worlds',
    type: 'MOVIE' as const,
    year: 2017,
    synopsis:
      'A firefighter is guided through seven trials in the afterlife by three guardians to determine his reincarnation.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/c1B5xbSQ3YIqOOCd5vtYfKVvRQl.jpg',
    genres: ['Fantasy', 'Drama', 'Action'],
    cast: 'Ha Jung-woo, Cha Tae-hyun, Ju Ji-hoon, Kim Hyang-gi',
    durationMinutes: 139,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Host',
    type: 'MOVIE' as const,
    year: 2006,
    synopsis:
      'A monster emerges from the Han River and kidnaps a young girl, prompting her family to rescue her.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/1rO4xoCoOyp9cZfVu7Ki98vYvTs.jpg',
    genres: ['Horror', 'Sci-Fi', 'Drama'],
    cast: 'Song Kang-ho, Byun Hee-bong, Park Hae-il, Bae Doona',
    durationMinutes: 119,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'I Saw the Devil',
    type: 'MOVIE' as const,
    year: 2010,
    synopsis:
      'A secret agent seeks revenge on the serial killer who murdered his pregnant fiancee.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/n7bOS8jMUypvn9lZSxS3uvJ1r5F.jpg',
    genres: ['Thriller', 'Horror', 'Action'],
    cast: 'Lee Byung-hun, Choi Min-sik, Jeon Gook-hwan, Chun Ho-jin',
    durationMinutes: 141,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'New World',
    type: 'MOVIE' as const,
    year: 2013,
    synopsis:
      "An undercover cop infiltrates Korea's biggest crime syndicate and faces conflicting loyalties.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/uC2D3FOJff4RspVmlDAXZXyQ8XG.jpg',
    genres: ['Action', 'Thriller', 'Drama'],
    cast: 'Lee Jung-jae, Choi Min-sik, Hwang Jung-min, Park Sung-woong',
    durationMinutes: 134,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Man from Nowhere',
    type: 'MOVIE' as const,
    year: 2010,
    synopsis:
      'A quiet pawnshop owner with a mysterious past goes on a rampage when his only friend is kidnapped.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/etLfVHBZRKlNlAOTmpXSF9x3oBk.jpg',
    genres: ['Action', 'Thriller', 'Drama'],
    cast: 'Won Bin, Kim Sae-ron, Kim Tae-hoon, Kim Hee-won',
    durationMinutes: 119,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Silenced',
    type: 'MOVIE' as const,
    year: 2011,
    synopsis:
      'A teacher at a school for the deaf uncovers abuse and fights for justice for the victims.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/lpPJji7cvfsCLzFvRdLqyIfKMVI.jpg',
    genres: ['Drama', 'Thriller'],
    cast: 'Gong Yoo, Jung Yu-mi, Kim Hyun-soo, Jung In-seo',
    durationMinutes: 125,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Ode to My Father',
    type: 'MOVIE' as const,
    year: 2014,
    synopsis:
      'A man makes sacrifices throughout his life to support his family after being separated during the Korean War.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/5rgoH5TqhfYZrVpHeW1jGvZtmSj.jpg',
    genres: ['Drama', 'Historical'],
    cast: 'Hwang Jung-min, Kim Yunjin, Oh Dal-su, Jung Jin-young',
    durationMinutes: 126,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Miracle in Cell No. 7',
    type: 'MOVIE' as const,
    year: 2013,
    synopsis:
      'A mentally disabled man is wrongfully imprisoned for murder and his fellow inmates help him see his daughter.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/xJpWqbVPHwTDCWHeRiwQzAjU4Tk.jpg',
    genres: ['Drama', 'Comedy'],
    cast: 'Ryu Seung-ryong, Park Shin-hye, Kal So-won, Jung Jin-young',
    durationMinutes: 127,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Tunnel',
    type: 'MOVIE' as const,
    year: 2016,
    synopsis:
      'A man is trapped inside a collapsed tunnel and must survive while rescue efforts face numerous obstacles.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/4tT1bJYHxLgI5FzHW6dBQr5yWVf.jpg',
    genres: ['Drama', 'Thriller'],
    cast: 'Ha Jung-woo, Oh Dal-su, Bae Doona, Nam Ji-hyun',
    durationMinutes: 126,
    country: 'South Korea',
    isFeatured: false,
  },
  // ADDITIONAL MOVIES
  {
    title: 'Veteran',
    type: 'MOVIE' as const,
    year: 2015,
    synopsis:
      'A veteran detective tries to catch a young, arrogant chaebol heir who thinks he is above the law.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/mtg5TsulQLDH6hTIZt8l4LHGLR.jpg',
    genres: ['Action', 'Comedy', 'Thriller'],
    cast: 'Hwang Jung-min, Yoo Ah-in, Yoo Hae-jin, Oh Dal-su',
    durationMinutes: 123,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Attorney',
    type: 'MOVIE' as const,
    year: 2013,
    synopsis:
      "A money-minded tax lawyer takes on a human rights case during South Korea's military dictatorship.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/7g9J2vlV9w1g2kFKvYsHjN1vP6f.jpg',
    genres: ['Drama', 'Legal'],
    cast: 'Song Kang-ho, Kim Young-ae, Oh Dal-su, Kwak Do-won',
    durationMinutes: 129,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Extreme Job',
    type: 'MOVIE' as const,
    year: 2019,
    synopsis:
      'A narcotics team opens a fried chicken restaurant as a front for their surveillance operation, becoming unexpectedly successful.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/r8alXGEC3E2fdYdJaBE6pCp3yYW.jpg',
    genres: ['Comedy', 'Action'],
    cast: 'Ryu Seung-ryong, Lee Hanee, Jin Seon-kyu, Lee Dong-hwi',
    durationMinutes: 111,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Thieves',
    type: 'MOVIE' as const,
    year: 2012,
    synopsis:
      'A team of Korean and Chinese thieves team up to steal a $20 million diamond from a casino in Macau.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/wjI4fOUIOa2GI7B1xAXz0cZuqS.jpg',
    genres: ['Action', 'Thriller', 'Drama'],
    cast: 'Kim Yun-seok, Lee Jung-jae, Kim Hye-soo, Jun Ji-hyun',
    durationMinutes: 135,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Exit',
    type: 'MOVIE' as const,
    year: 2019,
    synopsis:
      'A young man who has been searching for employment for years must use his rock climbing skills to save his family from a mysterious gas.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/bQk4s7v7V3oYOXfKjLzqOhzNwbn.jpg',
    genres: ['Comedy', 'Action', 'Thriller'],
    cast: 'Jo Jung-suk, Lim Yoon-a, Go Du-shim, Park In-hwan',
    durationMinutes: 103,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Terror Live',
    type: 'MOVIE' as const,
    year: 2013,
    synopsis:
      'A news anchor receives a call from a terrorist threatening to blow up a bridge and turns it into an exclusive broadcast.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/pW2d0CLp7dDQkX5JkK5n8x7DdQd.jpg',
    genres: ['Thriller', 'Drama', 'Action'],
    cast: 'Ha Jung-woo, Lee Kyung-young, Jeon Hye-jin, Lee Chae-eun',
    durationMinutes: 97,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Along with the Gods: The Last 49 Days',
    type: 'MOVIE' as const,
    year: 2018,
    synopsis:
      'The guardians face their own trials while guiding a new soul through the afterlife.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/3VRzdzxzQdI0OZJqj0wVr3sSkFm.jpg',
    genres: ['Fantasy', 'Drama', 'Action'],
    cast: 'Ha Jung-woo, Ju Ji-hoon, Kim Hyang-gi, Ma Dong-seok',
    durationMinutes: 141,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Midnight Runners',
    type: 'MOVIE' as const,
    year: 2017,
    synopsis:
      'Two police academy students witness a kidnapping and take matters into their own hands.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vVp4vX5Hr2jHhKpD3M7tF2W3oL.jpg',
    genres: ['Action', 'Comedy'],
    cast: 'Park Seo-joon, Kang Ha-neul, Sung Dong-il, Park Ha-sun',
    durationMinutes: 108,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Peninsula',
    type: 'MOVIE' as const,
    year: 2020,
    synopsis:
      'A soldier returns to the zombie-infested Korean peninsula on a mission to retrieve a truck full of money.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/9BQdPMprYAJqGkYYljGtMDQgJ7m.jpg',
    genres: ['Horror', 'Action', 'Thriller'],
    cast: 'Gang Dong-won, Lee Jung-hyun, Lee Re, Kwon Hae-hyo',
    durationMinutes: 114,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Space Sweepers',
    type: 'MOVIE' as const,
    year: 2021,
    synopsis:
      'Space junk collectors find a humanoid robot and must decide whether to sell it or protect it.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/pPC4t0ALpHOOupD8QRJ3QbvG1V4.jpg',
    genres: ['Sci-Fi', 'Action', 'Drama'],
    cast: 'Song Joong-ki, Kim Tae-ri, Jin Seon-kyu, Yoo Hae-jin',
    durationMinutes: 136,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Witch: Part 1 - The Subversion',
    type: 'MOVIE' as const,
    year: 2018,
    synopsis:
      'A high school student discovers she has mysterious powers and uncovers a dark secret about her past.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/qWgc9bnWWjLEJ7yYqjVfCPz5Q0a.jpg',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    cast: 'Kim Da-mi, Jo Min-su, Choi Woo-shik, Park Hee-soon',
    durationMinutes: 125,
    country: 'South Korea',
    isFeatured: false,
  },
  // MORE DRAMAS
  {
    title: 'Business Proposal',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      "An employee goes on a blind date disguised as her friend and discovers her date is her company's CEO.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/kRE7DPKjJ8qBh0E7MXJQj1qV2Mg.jpg',
    genres: ['Romance', 'Comedy'],
    cast: 'Ahn Hyo-seop, Kim Se-jeong, Kim Min-kyu, Seol In-ah',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Move to Heaven',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      "A young man with Asperger's syndrome runs a trauma cleaning business with his estranged uncle.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/3YkWvvqPgCR6ie3NQ6Fw2XtbYhq.jpg',
    genres: ['Drama', 'Slice of Life'],
    cast: 'Lee Je-hoon, Tang Joon-sang, Hong Seung-hee, Ji Jin-hee',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'My Name',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      "A woman joins a crime syndicate and becomes a mole in the police force to find her father's killer.",
    posterUrl:
      'https://image.tmdb.org/t/p/w500/cAr81RRG8r6xszsHnAXTPhWrkCP.jpg',
    genres: ['Action', 'Thriller', 'Drama'],
    cast: 'Han So-hee, Park Hee-soon, Ahn Bo-hyun, Kim Sang-ho',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'All of Us Are Dead',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'Students trapped in their high school during a zombie outbreak fight to survive.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/8LVu2EVxOg0wB7ETrGqDykU2Vqy.jpg',
    genres: ['Horror', 'Thriller', 'Action'],
    cast: 'Park Ji-hu, Yoon Chan-young, Cho Yi-hyun, Lomon',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Sweet Home',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'Residents of a deteriorating apartment building fight for survival against monsters.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/sU8pRMpqIEfGxGq0d7Zhpvx8AzF.jpg',
    genres: ['Horror', 'Fantasy', 'Thriller'],
    cast: 'Song Kang, Lee Jin-wook, Lee Si-young, Lee Do-hyun',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Heirs',
    type: 'DRAMA' as const,
    year: 2013,
    synopsis:
      'Heirs of wealthy families navigate love and friendships at an elite high school.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/nLrLVYhKyBj1VjLYYqIwA0QmHlv.jpg',
    genres: ['Romance', 'Drama', 'School'],
    cast: 'Lee Min-ho, Park Shin-hye, Kim Woo-bin, Kim Ji-won',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Boys Over Flowers',
    type: 'DRAMA' as const,
    year: 2009,
    synopsis:
      'A poor girl attends an elite school and clashes with a group of wealthy boys known as F4.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/4c4g3hN5dHlQkrnJC9e8NqPdY7m.jpg',
    genres: ['Romance', 'Drama', 'School'],
    cast: 'Ku Hye-sun, Lee Min-ho, Kim Hyun-joong, Kim Bum',
    episodes: 25,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Kill It',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A veterinarian who is secretly a legendary assassin crosses paths with a detective hunting him.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/rILbNLBQK2kLbL2Y6xRc4HPTDjS.jpg',
    genres: ['Action', 'Thriller', 'Romance'],
    cast: 'Jang Ki-yong, Nana, Roh Jeong-eui, Lee Jae-won',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Flower of Evil',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A detective discovers her husband is hiding a dark past and may be connected to a series of murders.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/h3lENoEjJaYcVe1wPDbVUVH3RYY.jpg',
    genres: ['Thriller', 'Mystery', 'Drama'],
    cast: 'Lee Joon-gi, Moon Chae-won, Jang Hee-jin, Seo Hyun-woo',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Money Heist: Korea - Joint Economic Area',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A genius strategist gathers thieves to pull off an impossible heist in the Korean peninsula.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/7gfnv5wFkJVFB9nXgfJhVyvLx3r.jpg',
    genres: ['Thriller', 'Action', 'Drama'],
    cast: 'Yoo Ji-tae, Kim Yunjin, Park Hae-soo, Jeon Jong-seo',
    episodes: 6,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Navillera',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      "A 70-year-old man with Alzheimer's fulfills his lifelong dream of learning ballet with a young ballerino.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/8YWrCVjQXqG0HkVr4X0pOi3L2S.jpg',
    genres: ['Drama', 'Slice of Life'],
    cast: 'Park In-hwan, Song Kang, Na Moon-hee, Hong Seung-hee',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Penthouse',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'Wealthy families in a luxury penthouse will do anything to ensure their children succeed.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/eV3GfWZqHZkp5k3GJ1Qf8MAZOJM.jpg',
    genres: ['Drama', 'Mystery', 'Thriller'],
    cast: 'Lee Ji-ah, Kim So-yeon, Eugene, Um Ki-joon',
    episodes: 21,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Glory',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A woman who was bullied in high school plots revenge against her tormentors years later.',
    posterUrl:
      'https://image.tmdb.org/t/p/w500/lIhrilleKVGlLnjt8xm0P0BdFbJ.jpg',
    genres: ['Drama', 'Thriller'],
    cast: 'Song Hye-kyo, Lee Do-hyun, Lim Ji-yeon, Yeom Hye-ran',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Trauma Code: Heroes on Call',
    type: 'DRAMA' as const,
    year: 2025,
    synopsis:
      'A genius trauma surgeon with an unorthodox style joins a university hospital and revolutionizes the emergency department with his unconventional methods.',
    posterUrl: null,
    genres: ['Medical', 'Drama'],
    cast: 'Ju Ji-hoon, Choo Young-woo, Yoon Kyun-sang',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Love Your Enemy',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      "Childhood enemies reunite as adults when their families' rivalries resurface, but sparks fly in unexpected ways.",
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Ju Ji-hoon, Jung Yu-mi',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Light Shop',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A mysterious light shop serves as a bridge between the living and the dead, where lost souls seek answers.',
    posterUrl: null,
    genres: ['Horror', 'Mystery', 'Fantasy'],
    cast: 'Ju Ji-hoon, Park Bo-young, Bae Sung-woo',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Tempest',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A diplomatic thriller following a former ambassador caught in a web of international conspiracy and political intrigue.',
    posterUrl: null,
    genres: ['Thriller', 'Drama'],
    cast: 'Kang Dong-won, Kim Ok-bin',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Bloodhounds',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'Two young boxers team up with a benevolent moneylender to take down a ruthless loan shark preying on the desperate.',
    posterUrl: null,
    genres: ['Action', 'Thriller'],
    cast: 'Woo Do-hwan, Lee Sang-yi, Park Sung-woong',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Mercy for None',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      "A former gangster seeks revenge after his brother's death, confronting his violent past.",
    posterUrl: null,
    genres: ['Action', 'Noir', 'Thriller'],
    cast: 'So Ji-sub, Hwang Jung-min',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Bon Appetit',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A young woman discovers her passion for cooking while working at a traditional Korean restaurant, navigating love and dreams.',
    posterUrl: null,
    genres: ['Romance', 'Slice of Life'],
    cast: 'Jung Chae-yeon, Lee Sang-yeob',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Jirisan',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      "Park rangers investigate mysterious accidents and crimes in Mount Jiri while battling nature's challenges.",
    posterUrl: null,
    genres: ['Mystery', 'Thriller', 'Drama'],
    cast: 'Jun Ji-hyun, Ju Ji-hoon, Sung Dong-il, Oh Jung-se',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Phantom Lawyer',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A lawyer with supernatural abilities takes on cases involving spirits and the supernatural.',
    posterUrl: null,
    genres: ['Legal', 'Fantasy', 'Mystery'],
    cast: 'Yoo Seung-ho, Lee Se-young',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Uncanny Counter',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'Disabled noodle shop workers by day, demon hunters by night—they protect the living from evil spirits.',
    posterUrl: null,
    genres: ['Action', 'Fantasy', 'Supernatural'],
    cast: 'Jo Byeong-gyu, Yoo Jun-sang, Kim Se-jeong, Yeom Hye-ran',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Alchemy of Souls',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      "A powerful sorceress trapped in a blind woman's body encounters a nobleman from a prestigious family, leading to a tale of magic and fate.",
    posterUrl: null,
    genres: ['Fantasy', 'Romance', 'Action'],
    cast: 'Lee Jae-wook, Jung So-min, Go Yoon-jung, Hwang Min-hyun',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Cafe Minamdang',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A former criminal profiler turned fake shaman runs a café while solving crimes with his quirky team.',
    posterUrl: null,
    genres: ['Mystery', 'Comedy', 'Romance'],
    cast: 'Seo In-guk, Oh Yeon-seo, Kwak Si-yang',
    episodes: 18,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Partner Justice / Lawless Lawyer',
    type: 'DRAMA' as const,
    year: 2018,
    synopsis:
      'A former gangster turned lawyer uses his fists and legal knowledge to fight corruption.',
    posterUrl: null,
    genres: ['Legal', 'Action', 'Drama'],
    cast: 'Lee Joon-gi, Seo Ye-ji, Lee Hye-young',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Beyond the Bar',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A passionate public defender navigates the challenges of the justice system while fighting for the underprivileged.',
    posterUrl: null,
    genres: ['Legal', 'Drama'],
    cast: 'Lee Sang-yeob, Jeon So-min',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Dr. Romantic',
    type: 'DRAMA' as const,
    year: 2016,
    synopsis:
      'A triple-board certified surgeon leaves a top hospital to work at a small clinic, mentoring young doctors.',
    posterUrl: null,
    genres: ['Medical', 'Drama'],
    cast: 'Han Suk-kyu, Yoo Yeon-seok, Seo Hyun-jin',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Queen of Tears',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A department store heiress and her lawyer husband navigate marital struggles while facing a family crisis.',
    posterUrl: null,
    genres: ['Romance', 'Drama'],
    cast: 'Kim Soo-hyun, Kim Ji-won',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'When Life Gives You Tangerines',
    type: 'DRAMA' as const,
    year: 2025,
    synopsis:
      "A heartwarming story of love and life set against the backdrop of Jeju Island's tangerine farms.",
    posterUrl: null,
    genres: ['Romance', 'Slice of Life'],
    cast: 'IU, Park Bo-gum',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Weak Hero',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A model student uses his intelligence and psychology to fight against school violence.',
    posterUrl: null,
    genres: ['Action', 'Drama', 'School'],
    cast: 'Park Ji-hoon, Choi Hyun-wook, Hong Kyung',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Art of Sarah',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'An aspiring artist discovers her true identity while pursuing her dreams in the competitive art world.',
    posterUrl: null,
    genres: ['Drama', 'Romance'],
    cast: 'Park Bo-young, Kim Young-kwang',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Boyfriend on Demand',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A woman subscribes to a service that provides fake boyfriends, leading to unexpected romance.',
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Kim So-yeon, Lee Sang-woo',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Snowdrop',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'In 1987 Seoul, a university student hides a wounded spy in her dorm, unaware of his dangerous identity.',
    posterUrl: null,
    genres: ['Romance', 'Drama', 'Thriller'],
    cast: 'Jung Hae-in, Jisoo, Yoo In-na',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Juvenile Justice',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'A judge known for despising young offenders takes on juvenile cases and learns the complexities behind their crimes.',
    posterUrl: null,
    genres: ['Legal', 'Drama'],
    cast: 'Kim Hye-soo, Kim Mu-yeol, Lee Sung-min',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Sell Your Haunted House',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'An exorcist runs a real estate agency specializing in cleaning up haunted properties for sale.',
    posterUrl: null,
    genres: ['Horror', 'Mystery', 'Fantasy'],
    cast: 'Jang Na-ra, Jung Yong-hwa',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Love Next Door',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'Childhood neighbors reunite as adults and navigate love, friendship, and career challenges.',
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Jung Hae-in, Jung So-min',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Genie Make a Wish',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A genie trapped in a lamp grants wishes while searching for freedom and true love.',
    posterUrl: null,
    genres: ['Fantasy', 'Romance', 'Comedy'],
    cast: 'Shin Min-a, Lee Yi-kyung',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Strong Girl Namsoon',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A woman with superhuman strength reunites with her twin sister and mother while fighting crime.',
    posterUrl: null,
    genres: ['Action', 'Comedy', 'Drama'],
    cast: 'Lee Yoo-mi, Kim Jung-eun, Kim Hae-sook, Ong Seong-wu',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Good Detective',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'Veteran detectives fight against corruption and injustice within the police force.',
    posterUrl: null,
    genres: ['Thriller', 'Drama', 'Mystery'],
    cast: 'Son Hyun-joo, Jang Seung-jo',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Mystic Pop Up Bar',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      "A mysterious woman runs a street food bar where she enters customers' dreams to solve their problems.",
    posterUrl: null,
    genres: ['Fantasy', 'Comedy', 'Drama'],
    cast: 'Hwang Jung-eum, Im Si-wan, Choi Won-young',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Good Bad Mother',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      "A cold prosecutor becomes childlike after an accident, returning to his mother's farm to heal.",
    posterUrl: null,
    genres: ['Drama', 'Slice of Life'],
    cast: 'Lee Do-hyun, Ra Mi-ran, Ahn Eun-jin',
    episodes: 14,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hotel del Luna',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A cursed woman runs a hotel for ghosts and hires a human manager, unraveling mysteries of her past.',
    posterUrl: null,
    genres: ['Fantasy', 'Romance', 'Horror'],
    cast: 'IU, Yeo Jin-goo, Jung Chae-yeon',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Miss Day and Night',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A woman magically switches between her 20s and 50s, learning life lessons through both perspectives.',
    posterUrl: null,
    genres: ['Fantasy', 'Romance', 'Comedy'],
    cast: 'Jung Eun-ji, Lee Jung-eun, Choi Jin-hyuk',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Gyeongsong Creature',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'In 1945 Gyeongseong, a businessman and a detective uncover dark secrets in a hospital creating monsters.',
    posterUrl: null,
    genres: ['Horror', 'Thriller', 'Historical'],
    cast: 'Park Seo-joon, Han So-hee',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: '18 Again',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A divorced man magically becomes 18 again and gets a second chance at life and family.',
    posterUrl: null,
    genres: ['Comedy', 'Drama', 'Fantasy'],
    cast: 'Yoon Sang-hyun, Do Kyung-soo, Lee Do-hyun',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Busted!',
    type: 'DRAMA' as const,
    year: 2018,
    synopsis:
      'A variety show with celebrities solving murder mysteries while uncovering a larger conspiracy.',
    posterUrl: null,
    genres: ['Mystery', 'Comedy'],
    cast: 'Yoo Jae-suk, Lee Kwang-soo, Kim Jong-min',
    episodes: 10,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The King: Eternal Monarch',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A Korean emperor discovers a portal to a parallel world and meets a detective who helps him save both realms.',
    posterUrl: null,
    genres: ['Fantasy', 'Romance', 'Action'],
    cast: 'Lee Min-ho, Kim Go-eun, Woo Do-hwan',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'When the Phone Rings',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A psychological thriller where mysterious phone calls connect strangers to life-changing events.',
    posterUrl: null,
    genres: ['Thriller', 'Mystery'],
    cast: 'Park Bo-gum, Kim Tae-ri',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'DP (Deserter Pursuit)',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'A military unit tasked with catching deserters uncovers the dark reality of bullying in the army.',
    posterUrl: null,
    genres: ['Action', 'Drama', 'Thriller'],
    cast: 'Jung Hae-in, Koo Kyo-hwan, Kim Sung-kyun',
    episodes: 6,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hi Bye, Mama!',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      'A ghost mother gets 49 days to return to her family before moving on to the afterlife.',
    posterUrl: null,
    genres: ['Drama', 'Fantasy'],
    cast: 'Kim Tae-hee, Lee Kyu-hyung, Go Bo-gyeol',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Who Are You: School 2015',
    type: 'DRAMA' as const,
    year: 2015,
    synopsis:
      'A bullied girl disappears and her twin sister takes her place, uncovering secrets and finding love.',
    posterUrl: null,
    genres: ['School', 'Drama', 'Mystery'],
    cast: 'Kim So-hyun, Nam Joo-hyuk, Yook Sung-jae',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Kingdom: Ashin of the North',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'A prequel revealing the origins of the zombie plague and the mysterious woman Ashin.',
    posterUrl: null,
    genres: ['Horror', 'Historical', 'Action'],
    cast: 'Jun Ji-hyun, Park Byung-eun',
    episodes: 1,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Happiness',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'Residents of a quarantined apartment building fight for survival during a mysterious virus outbreak.',
    posterUrl: null,
    genres: ['Thriller', 'Horror', 'Drama'],
    cast: 'Han Hyo-joo, Park Hyung-sik',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Mr. Queen',
    type: 'DRAMA' as const,
    year: 2020,
    synopsis:
      "A modern chef's soul travels back in time into the body of a Joseon queen.",
    posterUrl: null,
    genres: ['Historical', 'Comedy', 'Romance'],
    cast: 'Shin Hye-sun, Kim Jung-hyun',
    episodes: 20,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Parasyte: The Grey',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'Parasitic aliens take over human bodies, but one woman coexists with her parasite and fights back.',
    posterUrl: null,
    genres: ['Sci-Fi', 'Horror', 'Action'],
    cast: 'Jeon So-nee, Koo Kyo-hwan, Lee Jung-hyun',
    episodes: 6,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hellbound',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'Supernatural beings condemn people to hell, sparking religious chaos and social upheaval.',
    posterUrl: null,
    genres: ['Horror', 'Thriller', 'Fantasy'],
    cast: 'Yoo Ah-in, Kim Hyun-joo, Park Jeong-min',
    episodes: 6,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'King the Land',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A hotel heir clashes with a cheerful employee, leading to unexpected romance.',
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Lee Jun-ho, Im Yoon-ah',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Oh My Ghost Clients',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A lawyer who can see ghosts takes on cases from the spirit world.',
    posterUrl: null,
    genres: ['Fantasy', 'Legal', 'Comedy'],
    cast: 'Yoon Shi-yoon, Park Solomon',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Pro Bono',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A passionate lawyer takes on free cases to help the underprivileged fight injustice.',
    posterUrl: null,
    genres: ['Legal', 'Drama'],
    cast: 'Jo Seung-woo, Bae Doona',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'The Fiery Priest',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A hot-tempered priest with a dark past teams up with a detective to solve a murder case.',
    posterUrl: null,
    genres: ['Comedy', 'Action', 'Mystery'],
    cast: 'Kim Nam-gil, Kim Sung-kyun, Lee Hanee',
    episodes: 40,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Shooting Stars',
    type: 'DRAMA' as const,
    year: 2022,
    synopsis:
      'Behind-the-scenes of the entertainment industry, a PR manager and a top star navigate love and fame.',
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Lee Sung-kyung, Kim Young-dae',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'When the Stars Gossip',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A space-themed romance between an astronaut and a scientist working at a space station.',
    posterUrl: null,
    genres: ['Romance', 'Sci-Fi'],
    cast: 'Lee Min-ho, Gong Hyo-jin',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Hierarchy',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      "A scholarship student infiltrates an elite school to uncover the truth behind a friend's death.",
    posterUrl: null,
    genres: ['Drama', 'Mystery', 'Thriller'],
    cast: 'Roh Jeong-eui, Lee Chae-min',
    episodes: 7,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'No Tail to Tell',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A fantasy mystery involving mythical creatures hiding in the human world.',
    posterUrl: null,
    genres: ['Fantasy', 'Mystery'],
    cast: 'Jung So-min, Choi Woo-shik',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Can This Love Be Translated?',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'A translator and a foreign businessman navigate language barriers and love.',
    posterUrl: null,
    genres: ['Romance', 'Comedy'],
    cast: 'Kim Seon-ho, Go Yoon-jung',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Idol: The Coup',
    type: 'DRAMA' as const,
    year: 2021,
    synopsis:
      'Former idols attempt one last comeback while facing the harsh reality of the K-pop industry.',
    posterUrl: null,
    genres: ['Drama', 'Music'],
    cast: 'Ahn Hee-yeon, Kwak Si-yang',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Vagabond',
    type: 'DRAMA' as const,
    year: 2019,
    synopsis:
      'A stuntman investigates a plane crash that killed his nephew, uncovering a massive conspiracy.',
    posterUrl: null,
    genres: ['Action', 'Thriller'],
    cast: 'Lee Seung-gi, Bae Suzy, Shin Sung-rok',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Welcome to Samdal-ri',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A top photographer returns to her hometown after a scandal and reconnects with her first love.',
    posterUrl: null,
    genres: ['Romance', 'Slice of Life'],
    cast: 'Shin Hye-sun, Ji Chang-wook',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Resident Playbook',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'Medical residents navigate the challenges of hospital life, love, and career dreams.',
    posterUrl: null,
    genres: ['Medical', 'Drama', 'Romance'],
    cast: 'Go Yoon-jung, Jung Joon-won',
    episodes: 12,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Doctor Cha',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A housewife returns to medical residency after 20 years, juggling family and career.',
    posterUrl: null,
    genres: ['Medical', 'Comedy', 'Drama'],
    cast: 'Uhm Jung-hwa, Kim Byung-chul',
    episodes: 16,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'A Killer Paradox',
    type: 'DRAMA' as const,
    year: 2024,
    synopsis:
      'An ordinary man accidentally kills a serial killer and discovers he can sense evil people.',
    posterUrl: null,
    genres: ['Thriller', 'Mystery', 'Crime'],
    cast: 'Choi Woo-shik, Son Suk-ku',
    episodes: 8,
    country: 'South Korea',
    isFeatured: false,
  },
  {
    title: 'Queenmaker',
    type: 'DRAMA' as const,
    year: 2023,
    synopsis:
      'A fixer from a conglomerate helps a human rights lawyer become mayor of Seoul.',
    posterUrl: null,
    genres: ['Drama', 'Political'],
    cast: 'Kim Hee-ae, Moon So-ri',
    episodes: 11,
    country: 'South Korea',
    isFeatured: false,
  },
];

// Slugify function
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  console.log('Starting seed...');

  // Seed genres
  console.log('Seeding genres...');
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
  }
  console.log('Genres seeded successfully');

  // Seed content
  console.log('Seeding content...');
  for (const content of contentData) {
    const slug = slugify(content.title);

    await prisma.content.upsert({
      where: { slug },
      update: {},
      create: {
        title: content.title,
        slug,
        type: content.type,
        year: content.year,
        synopsis: content.synopsis,
        posterUrl: content.posterUrl,
        genres: content.genres,
        cast: content.cast,
        episodes: content.episodes ?? null,
        durationMinutes: content.durationMinutes ?? null,
        country: content.country,
        isFeatured: content.isFeatured,
      },
    });
  }
  console.log(`Content seeded successfully (${contentData.length} items)`);

  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminUsername && adminPassword) {
    console.log('Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail.toLowerCase() },
    });

    if (!existingAdmin) {
      // Hash password with argon2id
      const passwordHash = await argon2.hash(adminPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      // Create admin user and profile
      await prisma.$transaction(async (tx) => {
        const admin = await tx.user.create({
          data: {
            email: adminEmail.toLowerCase(),
            username: adminUsername,
            passwordHash,
            role: 'ADMIN',
          },
        });

        await tx.userProfile.create({
          data: {
            userId: admin.id,
            avatarUrl: null,
            bio: 'System Administrator',
            profileFavorites: [],
          },
        });
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping creation');
    }
  } else {
    console.log(
      'Admin credentials not provided in environment variables, skipping admin creation',
    );
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
