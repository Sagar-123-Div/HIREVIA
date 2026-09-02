// Simple Navbar - role ke hisaab se links change hote hain
// Abhi AuthContext ready nahi hai, isliye dummy values use kar rahe hain
// (Harsh jab AuthContext bana dega, tab in dummy values ko context se replace karna hai)

export default function Navbar() {
  // Dummy state - baad mein useContext(AuthContext) se aayega
  const isLoggedIn = false;
  const role = null; // 'jobseeker' ya 'recruiter' hoga login ke baad

  return (
    <nav className="relative z-20 w-full shrink-0 flex items-center justify-between px-8 py-4 bg-slate-900 text-white">
      {/* Logo */}
      <a href="/" className="text-xl font-bold tracking-tight">
        Hirevia
      </a>

      {/* Links - condition ke hisaab se change honge */}
      <div className="flex items-center gap-6">
        {!isLoggedIn && (
          <>
            <a href="/login" className="hover:text-blue-400">Login </a>
          </>
        )}

        {isLoggedIn && role === 'jobseeker' && (
          <a href="/jobseeker/dashboard" className="hover:text-blue-400">
            My Applications
          </a>
        )}

        {isLoggedIn && role === 'recruiter' && (
          <>
            <a href="/recruiter/dashboard" className="hover:text-blue-400">
              Dashboard
            </a>
            <a
              href="/recruiter/post-job"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
            >
              Post a Job
            </a>
          </>
        )}

        {isLoggedIn && (
          <button className="hover:text-blue-400">Logout</button>
        )}
      </div>
    </nav>
  );
}