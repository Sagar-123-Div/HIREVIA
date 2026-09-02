import Navbar from '../component/Navbar';
import Footer from '../component/footer';

const features = [
  {
    title: 'For Job Seekers',
    text: 'Browse thousands of verified openings and apply in a few clicks.',
  },
  {
    title: 'For Recruiters',
    text: 'Post jobs and manage applicants from one simple dashboard.',
  },
  {
    title: 'AI Matching',
    text: 'Our system suggests roles that actually fit your skills.',
  },
];

export default function Landing() {
  return (
    <div className="w-full bg-slate-950 text-white">
      <Navbar />

      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/95" />

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-6 text-cyan-300">
            Hirevia
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Hirevia connects job seekers with companies hiring right now —
            no clutter, no fake listings, just real opportunities.
          </p>

          <a
            href="/login"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-3 rounded-lg transition shadow-lg shadow-cyan-500/30"
          >
            Explore Jobs
          </a>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 transition"
            >
              <h3 className="text-xl font-bold mb-2 text-cyan-300">
                {item.title}
              </h3>
              <p className="text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}