
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Github, 
  Linkedin, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Zap, 
  TrendingUp, 
  Cpu, 
  ShieldAlert,
  Compass,
  Upload,
  User,
  GraduationCap,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { analyzeCareerPath, generateJuniorQuiz, evaluateJuniorQuiz } from './services/geminiService';
import { AnalysisResult, QuizQuestion, JuniorDiscoveryResult, SkillGap } from './types';
import { SkillRadar } from './components/SkillRadar';
import { RoadmapView } from './components/RoadmapView';

const MOTIVATIONAL_QUOTES = [
  "The best way to predict the future is to create it.",
  "Your dream doesn't have an expiration date. Take a deep breath and try again.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams."
];

const App: React.FC = () => {
  // Navigation & Identity States
  const [userName, setUserName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [age, setAge] = useState<string>('');
  const [isAgeSet, setIsAgeSet] = useState(false);
  const [isUnder18, setIsUnder18] = useState(false);

  // Adult Analysis States
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [expandedGap, setExpandedGap] = useState<number | null>(null);

  // Junior Quiz States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{question: string, answer: string}[]>([]);
  const [juniorResult, setJuniorResult] = useState<JuniorDiscoveryResult | null>(null);

  // Random quote per session
  const randomQuote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const handleNameSubmit = () => {
    if (userName.trim().length < 2) {
      setError("Please tell us your name.");
      return;
    }
    setError('');
    setIsNameSet(true);
  };

  const handleAgeSubmit = async () => {
    const numericAge = parseInt(age);
    if (isNaN(numericAge) || numericAge <= 0) {
      setError("Please enter a valid age.");
      return;
    }
    setError('');
    setIsAgeSet(true);
    if (numericAge < 18) {
      setIsUnder18(true);
      setIsLoading(true);
      try {
        const questions = await generateJuniorQuiz();
        setQuizQuestions(questions);
      } catch (err) {
        setError("Failed to initialize Explorer Mode.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuizAnswer = async (answer: string) => {
    const newAnswers = [...quizAnswers, { question: quizQuestions[currentQuizIndex].question, answer }];
    setQuizAnswers(newAnswers);
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setIsLoading(true);
      try {
        const evaluation = await evaluateJuniorQuiz(newAnswers);
        setJuniorResult(evaluation);
      } catch (err) {
        setError("Failed to evaluate your interests.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!targetRole) {
      setError('Please specify your target role.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const data = await analyzeCareerPath(linkedinUrl, githubUrl, resumeText, targetRole);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeText(`[Uploaded PDF: ${file.name}] Analysis will be based on text extraction.`);
    }
  };

  // --- RENDERING SUB-COMPONENTS ---

  const renderHeader = () => (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg tracking-tight">YOU DREAM, WE BUILD <span className="text-zinc-600 text-[10px] font-mono border border-zinc-800 px-1 rounded uppercase tracking-wider ml-2">Pilot V1</span></span>
        </div>
      </div>
    </nav>
  );

  const renderNameStep = () => (
    <div className="max-w-3xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* High-Impact Calligraphy Quote */}
      <div className="text-center space-y-8">
        <div className="highlight-quote p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <p className="font-calligraphy text-4xl md:text-6xl text-white glow-text leading-tight">
            "{randomQuote}"
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to your future.</h2>
          <p className="text-zinc-500">To begin your orchestration, what should we call you?</p>
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            autoFocus
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            onClick={handleNameSubmit}
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            GET STARTED <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAgeStep = () => (
    <div className="max-w-md mx-auto py-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="p-4 bg-zinc-900 w-fit mx-auto rounded-full border border-zinc-800">
          <User className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Nice to meet you, {userName}.</h2>
        <p className="text-zinc-500">How many years of life experience do you carry?</p>
      </div>
      <div className="space-y-4">
        <input 
          type="number" 
          autoFocus
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age" 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button 
          onClick={handleAgeSubmit}
          className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );

  const renderJuniorFlow = () => {
    if (isLoading && !juniorResult) return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-zinc-500 font-mono text-sm">INITIALIZING EXPLORER MODE...</p>
      </div>
    );

    if (juniorResult) return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
        <div className="text-center space-y-4">
          <GraduationCap className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-4xl font-bold">Your Future Landscape, {userName}</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">{juniorResult.advice}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {juniorResult.recommendedPaths.map((path, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-4 hover:border-zinc-500 transition-colors">
              <h3 className="font-bold text-xl text-blue-400">{path.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{path.description}</p>
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pre-requisite Skills</span>
                <div className="flex flex-wrap gap-2">
                  {path.preReqs.map((req, j) => (
                    <span key={j} className="text-[11px] bg-black border border-zinc-800 px-3 py-1 rounded-full text-zinc-300">{req}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => { setIsAgeSet(false); setJuniorResult(null); setAge(''); setIsNameSet(false); setUserName(''); }} 
          className="block mx-auto text-zinc-500 hover:text-white text-sm"
        >
          Start Over
        </button>
      </div>
    );

    const currentQ = quizQuestions[currentQuizIndex];
    if (!currentQ) return null;

    return (
      <div className="max-w-2xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            <span>Progress: {currentQuizIndex + 1} / {quizQuestions.length}</span>
            <span>Explorer Analytics Active</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700" 
              style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl font-bold leading-tight">{currentQ.question}</h2>
          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleQuizAnswer(opt)}
                className="w-full text-left p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-500 transition-all text-lg group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAdultFlow = () => (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-4">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          Agentic Orchestration for {userName}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
          Dream Big. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">We Architect.</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Specify your mission objective. Our career navigator will deconstruct the path and curate your trajectory.
        </p>
      </div>

      {/* Target Role */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">01 / Your Target Role</label>
        <div className="relative">
          <input 
            type="text" 
            autoFocus
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Lead Product Designer at Apple" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Briefcase className="w-6 h-6 text-zinc-700" />
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10"><Linkedin className="w-5 h-5 text-blue-500" /></div>
            <h3 className="font-bold text-sm uppercase tracking-wider">LinkedIn</h3>
          </div>
          <input 
            type="text" 
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="Profile Link" 
            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-zinc-800"><Github className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-sm uppercase tracking-wider">GitHub</h3>
          </div>
          <input 
            type="text" 
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="Username" 
            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10"><FileText className="w-5 h-5 text-emerald-500" /></div>
            <h3 className="font-bold text-sm uppercase tracking-wider">Resume</h3>
          </div>
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-10 border border-zinc-800 border-dashed rounded-lg cursor-pointer bg-black hover:bg-zinc-800 transition-colors">
              <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-2"><Upload className="w-3 h-3"/> PDF</span>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
            </label>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste text..." 
              className="w-full h-12 bg-black border border-zinc-800 rounded-lg p-2 text-[10px] focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-3"><ShieldAlert className="w-5 h-5" />{error}</div>}

      <button 
        onClick={handleStartAnalysis}
        disabled={isLoading}
        className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50"
      >
        {isLoading ? <><Loader2 className="w-6 h-6 animate-spin" /> ORCHESTRATING...</> : <><Zap className="w-5 h-5" /> BUILD MY ROADMAP</>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {renderHeader()}

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {!isNameSet ? (
          renderNameStep()
        ) : !isAgeSet ? (
          renderAgeStep()
        ) : isUnder18 ? (
          renderJuniorFlow()
        ) : !result ? (
          renderAdultFlow()
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Results Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-12">
              <div className="space-y-2">
                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">MISSION STATUS: ORCHESTRATED</span>
                <h2 className="text-4xl font-bold">{userName} — {targetRole}</h2>
                <p className="text-zinc-500 max-w-xl">{result.userProfile.experienceSummary}</p>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                New Analysis
              </button>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-10">
                {/* Skill List */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Extracted Profile</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.userProfile.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-black border border-zinc-800 rounded-full text-xs text-zinc-300">
                        {skill.name} <span className="text-zinc-600 text-[9px] ml-1">{skill.level}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Radar View */}
                <SkillRadar gaps={result.skillGaps} />

                {/* Interactive Skill Gaps */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Gap Intelligence (Click to expand)</h3>
                  <div className="space-y-3">
                    {result.skillGaps.map((gap, i) => (
                      <div 
                        key={i} 
                        className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all cursor-pointer ${expandedGap === i ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-800 hover:border-zinc-700'}`}
                        onClick={() => setExpandedGap(expandedGap === i ? null : i)}
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-black rounded border border-zinc-800">
                              <Info className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{gap.skill}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-500">{gap.currentLevel} → {gap.requiredLevel}</span>
                                <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: `${gap.importance * 10}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {expandedGap === i ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                        </div>
                        {expandedGap === i && (
                          <div className="p-4 pt-0 text-xs text-zinc-400 border-t border-zinc-800/50 bg-black/20 animate-in slide-in-from-top-1 duration-200">
                            <p className="leading-relaxed py-2">{gap.gapDescription}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold">30-Day Adaptive Trajectory</h3>
                 </div>
                 <RoadmapView roadmap={result.roadmap} />
              </div>
            </div>

            {/* Forecaster */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
               <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold flex items-center justify-center gap-3">
                    <Cpu className="w-8 h-8 text-indigo-500" />
                    2030 Career Oracle
                  </h3>
                  <p className="text-zinc-500 uppercase text-xs tracking-[0.2em]">Long-Term Evolutionary Mapping</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em]">Market Shift</h4>
                        <p className="text-zinc-300 leading-relaxed text-lg">{result.futureOutlook.roleEvolution}</p>
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em]">Automation Paradox</h4>
                        <p className="text-zinc-300 leading-relaxed">{result.futureOutlook.aiImpact}</p>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="bg-black border border-zinc-800 p-8 rounded-2xl">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Future Critical Skills</h4>
                        <div className="flex flex-wrap gap-3">
                           {result.futureOutlook.newSkillsEmerging.map((skill, idx) => (
                             <span key={idx} className="px-4 py-1.5 bg-indigo-500/5 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
                               {skill}
                             </span>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-between bg-zinc-800/20 p-8 rounded-2xl border border-zinc-800">
                        <div>
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Market Sentiment</h4>
                           <p className="text-xl font-bold text-white">{result.futureOutlook.demandTrend}</p>
                        </div>
                        <div className="text-right">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Salary Forecast</h4>
                           <p className="text-2xl font-bold text-emerald-400">{result.futureOutlook.salaryProjection}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <Compass className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tighter uppercase">You Dream, We Build</span>
          </div>
          <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">
            AI AGENTIC SYSTEM &bull; NO STATIC ADVICE &bull; 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
