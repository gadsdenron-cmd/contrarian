import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Lightbulb, 
  TrendingUp, 
  Wrench, 
  ClipboardList, 
  Zap, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  Menu, 
  BookOpen,
  Sparkles,
  Brain,
  Rocket,
  Palette,
  Loader2,
  AlertCircle,
  HelpCircle,
  Play,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';

const apiKey = ""; // Environment provides this at runtime

// Exponential Backoff Fetch
const fetchWithRetry = async (url, options, maxRetries = 5) => {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    delay *= 2;
  }
};

const playbookData = [
  // PART 1: Modern & Digital (20)
  {
    id: 1,
    title: "Sleep Consulting",
    category: "Modern & Digital",
    why: "A lucrative career with incredible flexibility. Solve the universal pain point of exhaustion for new parents from home.",
    how: ["Get an online certification in sleep consulting.", "Build an initial portfolio using testimonials from friends and family.", "Establish a virtual practice to minimize overhead."],
    tags: ["Service", "Remote", "Health"]
  },
  {
    id: 2,
    title: "Local Newsletter",
    category: "Modern & Digital",
    why: "Viable in any city with 50,000+ people. Taps into local community interest and is monetized through targeted local sponsorships.",
    how: ["Use Facebook and Instagram ads for quick subscriber acquisition.", "Find local business sponsors directly from your subscriber list."],
    tags: ["Media", "Marketing", "Local"]
  },
  {
    id: 3,
    title: "Book Pallet Flipping",
    category: "Modern & Digital",
    why: "Classic arbitrage with low entry barriers. Turn undervalued assets (government/institutional disposal) into high-margin sales.",
    how: ["Source pallets from sites like GovDeals.", "Resell on eBay (rural/national) or Facebook Marketplace (metropolitan/bundles)."],
    tags: ["Arbitrage", "E-commerce", "Low Cost"]
  },
  {
    id: 4,
    title: "Pop-up Headshot Booth",
    category: "Modern & Digital",
    why: "High-quality headshots are non-negotiable for professionals. Being mobile lets you go exactly where the clients are.",
    how: ["Invest in professional camera and lighting equipment.", "Partner with business events and corporate offices.", "Offer pre-scheduled 10-15 minute slots for high-volume workflow."],
    tags: ["Service", "Creative", "Mobile"]
  },
  {
    id: 5,
    title: "Pumpkin Delivery & Porch Staging",
    category: "Modern & Digital",
    why: "High-profit seasonal business selling aesthetic decor to affluent homeowners. Can reach massive scale quickly.",
    how: ["Gather inspiration from high-end displays for a premium look.", "Offer pre-set packages rather than full custom orders.", "Market directly to homeowners looking for convenience."],
    tags: ["Seasonal", "Home Service", "Premium"]
  },
  {
    id: 6,
    title: "AI Prompt Selling",
    category: "Modern & Digital",
    why: "AI tools are common but effective prompting is a rare skill. Professionals will pay for ready-to-use results.",
    how: ["Choose a specific niche like luxury real estate or skincare.", "Bundle 10+ prompts with example outputs for proof of value.", "Sell on Gumroad or Etsy."],
    tags: ["Digital Product", "AI", "Niche"]
  },
  {
    id: 7,
    title: "Online Directory / Niche Job Board",
    category: "Modern & Digital",
    why: "Rank quickly on Google with low content creation. Generates passive income through ads and sponsored listings.",
    how: ["Identify an underserved niche (e.g., jobs for introverts).", "Use APIs to pre-populate listings for day-one activity.", "Find users on Reddit or niche community forums."],
    tags: ["Platform", "Passive", "SEO"]
  },
  {
    id: 8,
    title: "Appliance Rental (Washers & Dryers)",
    category: "Modern & Digital",
    why: "Serves people who cannot afford to buy new or transport used appliances. High utility and recurring revenue.",
    how: ["Source inventory from Facebook Marketplace or wholesale suppliers.", "Scale by reinvesting initial profits into more units."],
    tags: ["Rental", "Recurring", "Logistics"]
  },
  {
    id: 9,
    title: "Swim School",
    category: "Modern & Digital",
    why: "Consistent demand for better instructor ratios. Leverage underutilized existing pools to keep costs low.",
    how: ["Lease lanes from gyms, clubs, or senior living during off-peak hours.", "Leverage personal social networks to land the first 20 clients."],
    tags: ["Service", "Education", "Low Overhead"]
  },
  {
    id: 10,
    title: "Pet Supplements E-commerce",
    category: "Modern & Digital",
    why: "Massive market growth ($150B in 2023). Supplements are a multi-billion dollar segment projected to double.",
    how: ["Adopt a capital-light model by partnering with existing Shopify stores.", "Let established stores sell your product to their existing base."],
    tags: ["E-commerce", "Pets", "Health"]
  },
  {
    id: 11,
    title: "Perfume Vending Machines",
    category: "Modern & Digital",
    why: "High-margin vending. One bottle (300 sprays) at $1/spray generates massive ROI plus ad revenue and QR sales.",
    how: ["Acquire machine from a manufacturer.", "Place in high-traffic malls, airports, or nightlife venues."],
    tags: ["Vending", "Passive", "Retail"]
  },
  {
    id: 12,
    title: "Event Venue",
    category: "Modern & Digital",
    why: "Incredible demand for weddings/events. Prime locations book years in advance with high revenue per event.",
    how: ["Ensure space has bridal/groom suites and distinct ceremony/reception areas.", "Treat it as an operating business, not just real estate."],
    tags: ["Real Estate", "Events", "High Ticket"]
  },
  {
    id: 13,
    title: "No-Code App Agency",
    category: "Modern & Digital",
    why: "Businesses need 'stupid simple' apps for specific problems but don't want complex, expensive SaaS.",
    how: ["Find initial clients on Upwork for specific problem-solving.", "Resell templated versions of the solution to others in the same niche."],
    tags: ["Service", "Software", "Scalable"]
  },
  {
    id: 14,
    title: "Cold Email Agency",
    category: "Modern & Digital",
    why: "Extremely low barrier to entry. Potential to land the first customer in a single day with no capital.",
    how: ["Build a highly targeted prospect list of 100-200 people.", "Create a compelling follow-up sequence (where the money is).."],
    tags: ["B2B", "Service", "Remote"]
  },
  {
    id: 15,
    title: "Laundromat",
    category: "Modern & Digital",
    why: "High revenue potential (up to $785k/yr). Attracts wide demographics with both self-service and premium options.",
    how: ["Offer attended drop-off laundry to attract busy upper-middle-class families.", "Differentiate with value-add services."],
    tags: ["Physical", "Service", "High Revenue"]
  },
  {
    id: 16,
    title: "AI Automation Agency",
    category: "Modern & Digital",
    why: "Businesses lack time/knowledge to implement AI. Recurring retainer model ($500/mo+) for managing 'AI employees'.",
    how: ["Focus on an industry you already know.", "Use tools like Lindy to build agents for scheduling and CRM management."],
    tags: ["Service", "AI", "B2B"]
  },
  {
    id: 17,
    title: "Reselling General Merchandise",
    category: "Modern & Digital",
    why: "Exceptional ROI. Finding undervalued items and adding 'sweat equity' (cleaning/repairing) for profit.",
    how: ["Scan Facebook Marketplace for free or discounted items.", "Perform minor repairs. Borrow a truck/trailer to keep initial costs at zero."],
    tags: ["Arbitrage", "Physical", "Side Hustle"]
  },
  {
    id: 18,
    title: "Freelancing",
    category: "Modern & Digital",
    why: "The ideal 'bridge' to entrepreneurship. Buy out your time from a day job by leveraging an existing skill.",
    how: ["Identify a marketable skill (writing, design, bookkeeping).", "Work nights and weekends to replace your full-time salary gradually."],
    tags: ["Service", "Remote", "Career"]
  },
  {
    id: 19,
    title: "Niche Food Product",
    category: "Modern & Digital",
    why: "Identifying a gap in the food market (e.g., high-quality Texas BBQ jerky) for a passionate audience.",
    how: ["Start with a product you understand deeply.", "Define unique, non-negotiable quality standards.", "Check local cottage food laws."],
    tags: ["Product", "Food", "Passion"]
  },
  {
    id: 20,
    title: "Roller Skate Rentals",
    category: "Modern & Digital",
    why: "Capitalizes on social media trends and outdoor rental gaps. High appeal for experiential activities.",
    how: ["Launch as a pop-up in popular outdoor environments.", "Use a mobile van for private events and festivals."],
    tags: ["Rental", "Experiential", "Trends"]
  },
  // PART 2: Tangible & "Sweaty" (20)
  {
    id: 21,
    title: "Stump Grinding",
    category: "Tangible & Sweaty",
    why: "Exceptional ROI ($200 minimum for 5 mins work). Equipment holds value well and doesn't depreciate quickly.",
    how: ["Approach local tree companies to be their go-to subcontractor.", "Focus on a B2B acquisition strategy."],
    tags: ["Home Service", "B2B", "Equipment"]
  },
  {
    id: 22,
    title: "Pressure Washing",
    category: "Tangible & Sweaty",
    why: "Huge leap from residential ($300) to commercial ($20,000 parking garages). Predictable demand.",
    how: ["Start with residential to build cash flow.", "Use rock flyers and yard signs—the best marketing for this service."],
    tags: ["Service", "Commercial", "Local"]
  },
  {
    id: 23,
    title: "Junk Removal",
    category: "Tangible & Sweaty",
    why: "Scalable service with almost zero startup cost if you start by reselling valuable items found at the dump.",
    how: ["Source resellable electronics from dumps to fund your first truck.", "Scale into a formal removal service once you have capital."],
    tags: ["Service", "Logistics", "Low Cost"]
  },
  {
    id: 24,
    title: "Parking Lot Striping",
    category: "Tangible & Sweaty",
    why: "High-demand B2B service. Rapid growth potential (examples show $18k/month by month two).",
    how: ["Finance equipment (truck, trailer, striper) to avoid high upfront cash.", "Focus on property managers and commercial lots."],
    tags: ["B2B", "Service", "Maintenance"]
  },
  {
    id: 25,
    title: "Mailbox Repair",
    category: "Tangible & Sweaty",
    why: "Low competition and more demand than supply. 'No one is talking about this,' making it a massive service gap.",
    how: ["Low startup cost ($100-$500 for tools).", "Knock on doors in neighborhoods with visible damage; use local FB groups."],
    tags: ["Home Service", "Niche", "Low Cost"]
  },
  {
    id: 26,
    title: "Christmas Light Installation",
    category: "Tangible & Sweaty",
    why: "High margins and exceptional loyalty (85% retention). Average jobs are $1,500-$2,000.",
    how: ["Book the calendar in the off-season.", "Offer to install lights left behind by previous owners for new move-ins."],
    tags: ["Seasonal", "High Ticket", "Recurring"]
  },
  {
    id: 27,
    title: "Phone Repair",
    category: "Tangible & Sweaty",
    why: "Extremely high markup on parts/labor. Use a $15 screen for a $60+ repair job. Low entry cost.",
    how: ["Source screens from eBay.", "Learn technical skills for free on YouTube tutorials."],
    tags: ["Service", "Technical", "Low Cost"]
  },
  {
    id: 28,
    title: "Hot Tub Inspection",
    category: "Tangible & Sweaty",
    why: "Niche service with multiple revenue channels ($200 standalone or $40-$75 as an add-on for home inspectors).",
    how: ["Piggyback by partnering with local home inspectors.", "Position as the specialized expert they subcontract to."],
    tags: ["Home Service", "Real Estate", "Niche"]
  },
  {
    id: 29,
    title: "Trash Bin Cleaning",
    category: "Tangible & Sweaty",
    why: "Profitability comes from 'route density.' Tight service areas allow for more bins per hour.",
    how: ["Use route-planning software (e.g., My Service Area).", "Focus on dominating a small area before expanding."],
    tags: ["Service", "Recurring", "Efficiency"]
  },
  {
    id: 30,
    title: "Lawn Leveling",
    category: "Tangible & Sweaty",
    why: "Specialized service where expertise allows for premium pricing. Education acts as a differentiator.",
    how: ["Educate customers on 'scalping' the yard before leveling.", "Use Nextdoor polls to gauge neighbor pricing interest."],
    tags: ["Home Service", "Premium", "Niche"]
  },
  {
    id: 31,
    title: "Seaweed & Pond Weed Removal",
    category: "Tangible & Sweaty",
    why: "Growing market for chemical-free removal. High value for lakefront properties and golf courses.",
    how: ["Start with hourly rates ($20/hr) to build experience.", "Transition to project-based fees as you hire a crew."],
    tags: ["Service", "Environmental", "Niche"]
  },
  {
    id: 32,
    title: "Attic Insulation & Air Sealing",
    category: "Tangible & Sweaty",
    why: "High-ticket service ($10k average). Can be run as a sales/marketing business without owning tools.",
    how: ["Operate on a subcontracting model (you sell, they install).", "Use free inspections as your primary lead magnet."],
    tags: ["Home Service", "High Ticket", "Sales"]
  },
  {
    id: 33,
    title: "Car Broker / Negotiator",
    category: "Tangible & Sweaty",
    why: "People hate high-pressure dealerships. You act as the expert agent saving them time and money.",
    how: ["Hire a VA to call dealerships and negotiate price based on a script.", "Clients just show up to sign predetermined paperwork."],
    tags: ["Service", "B2C", "Remote"]
  },
  {
    id: 34,
    title: "Bounce House & Party Rentals",
    category: "Tangible & Sweaty",
    why: "Powerful unit economics. A $1,600 bounce house can generate its cost in profit every month.",
    how: ["Start with one and expand into tables/tents to reduce seasonality.", "Put a huge house with a banner in your yard for 24/7 marketing."],
    tags: ["Rental", "Events", "Unit Economics"]
  },
  {
    id: 35,
    title: "HVAC Coil Cleaning",
    category: "Tangible & Sweaty",
    why: "Strong commercial demand ($1,800 per stop average). Peak season is March through July.",
    how: ["Use the 'sell it before you have it' strategy to land a contract first.", "Use contract revenue to purchase the hot water pressure washer."],
    tags: ["B2B", "Maintenance", "Seasonal"]
  },
  {
    id: 36,
    title: "Forestry Mulching",
    category: "Tangible & Sweaty",
    why: "Niche industry with a massive supply-demand imbalance. Commands $2,000/day per machine.",
    how: ["Cannot rely on organic search; must proactively find landowners.", "Target developers and agricultural clients directly."],
    tags: ["Service", "Land", "Industrial"]
  },
  {
    id: 37,
    title: "Farmer's Market Operator",
    category: "Tangible & Sweaty",
    why: "A logistics/management business, not farming. Revenue comes from vendor fees and community engagement.",
    how: ["Lease a field with high drive-by traffic.", "Recruit vendors and manage the weekly marketing/logistics."],
    tags: ["Platform", "Community", "Logistics"]
  },
  {
    id: 38,
    title: "Piano Removal",
    category: "Tangible & Sweaty",
    why: "Simple value prop: solve the logistics of moving massive 'free' pianos for a fee ($250+).",
    how: ["Monitor Facebook Marketplace for 'free' piano listings.", "Contact owners and offer professional haul-away for a fee."],
    tags: ["Service", "Logistics", "Niche"]
  },
  {
    id: 39,
    title: "LCD Screen Recycling",
    category: "Tangible & Sweaty",
    why: "Massive B2B potential (multi-million dollar revenue path). Serves the phone repair industry.",
    how: ["Ideal to start after gaining experience in phone repair.", "Buy broken screens in bulk and recycle/resell components."],
    tags: ["B2B", "Recycling", "Scalable"]
  },
  {
    id: 40,
    title: "Bathtub Refinishing",
    category: "Tangible & Sweaty",
    why: "Perfect 'sweaty' business. Costs $600-$900 vs a $10k+ remodel. High appeal for aging housing stock.",
    how: ["Target homeowners directly through local channels.", "Build a lead-gen site and sell excess leads to other refinishers."],
    tags: ["Home Service", "Maintenance", "High Demand"]
  }
];

const CategoryTag = ({ category }) => {
  const isModern = category === "Modern & Digital";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isModern ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
      {category}
    </span>
  );
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'playbook'
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // AI States
  const [isGenerating, setIsGenerating] = useState(null); // 'roadmap', 'names', 'logo'
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiNames, setAiNames] = useState(null);
  const [aiLogo, setAiLogo] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedIdea(null);
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setAiRoadmap(null);
    setAiNames(null);
    setAiLogo(null);
    setAiError(null);
  }, [selectedIdea?.id]);

  const filteredIdeas = useMemo(() => {
    return playbookData.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            idea.why.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            idea.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filter === "All" || idea.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

  const generateRoadmap = async () => {
    if (!selectedIdea) return;
    setIsGenerating('roadmap');
    setAiError(null);
    try {
      const prompt = `Create a detailed 4-month startup roadmap for a business called "${selectedIdea.title}". Context: ${selectedIdea.why}. Format as JSON with month1-4.`;
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      setAiRoadmap(JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text));
    } catch (err) { setAiError("Roadmap generation failed."); } finally { setIsGenerating(null); }
  };

  const brainstormNames = async () => {
    if (!selectedIdea) return;
    setIsGenerating('names');
    try {
      const prompt = `Suggest 5 brand names and taglines for "${selectedIdea.title}". JSON array of objects.`;
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      setAiNames(JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text));
    } catch (err) { setAiError("Name generation failed."); } finally { setIsGenerating(null); }
  };

  const generateLogoConcept = async () => {
    if (!selectedIdea) return;
    setIsGenerating('logo');
    try {
      const result = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: { prompt: `Minimalist logo for ${selectedIdea.title}, professional, white background.` }, parameters: { sampleCount: 1 } })
      });
      setAiLogo(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
    } catch (err) { setAiError("Logo generation failed."); } finally { setIsGenerating(null); }
  };

  const openIdeaFromIndex = (idea) => {
    setView('playbook');
    setSelectedIdea(idea);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDERING VIEWS ---

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        {/* Navigation */}
        <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-indigo-600">
              <Zap fill="currentColor" size={24} />
              FOUNDER'S PLAYBOOK
            </div>
            <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500">
              <a href="#guide" className="hover:text-indigo-600 transition-colors">User's Guide</a>
              <a href="#index" className="hover:text-indigo-600 transition-colors">Table of Contents</a>
              <button 
                onClick={() => setView('playbook')}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
              >
                Go to Playbook <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-top-4">
            <Sparkles size={16} />
            <span>AI-Enhanced Business Strategies</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 max-w-4xl text-slate-900">
            Trade Overthinking for <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Decisive Action.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
            A curated collection of 40 real-world business ventures, now enhanced with AI brainstorming, custom roadmaps, and visual identity generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setView('playbook')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl"
            >
              <Play size={20} fill="currentColor" />
              Launch Playbook
            </button>
            <a 
              href="#guide"
              className="bg-white border-2 border-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              Learn More
            </a>
          </div>
        </section>

        {/* Features / User's Guide Section */}
        <section id="guide" className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">How to use this Playbook</h2>
              <p className="text-slate-500 font-medium">Three steps to move from idea to execution.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Filter & Find</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Use the search bar or category filters to find a niche that matches your skills. Choose between "Modern & Digital" or "Tangible & Sweaty" ventures.
                </p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
                  <CheckCircle2 size={16} /> Instant keyword search
                </div>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Rocket size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Explore Strategy</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Every play includes a "Why" (Market Opportunity) and a "How" (Startup Action Plan). These are grounded in real founder experiences, not theory.
                </p>
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                  <CheckCircle2 size={16} /> Verified action steps
                </div>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-sparkle text-amber-500 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Leverage AI</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Unlock the full potential with the built-in AI Assistant. Generate custom roadmaps, creative business names, and even logo concepts instantly.
                </p>
                <div className="flex items-center gap-2 text-amber-600 text-sm font-bold">
                  <CheckCircle2 size={16} /> Gemini-powered tools
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents Section */}
        <section id="index" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Interactive Table of Contents</h2>
                <p className="text-slate-500 text-lg mt-2">Browse the 40 plays included in this edition.</p>
              </div>
              <button 
                onClick={() => setView('playbook')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
              >
                Go to Dashboard <LayoutDashboard size={18} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                  <div className="bg-blue-600 p-2 rounded-lg text-white"><LayoutDashboard size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Modern & Digital Ventures</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {playbookData.filter(i => i.category === "Modern & Digital").map(idea => (
                    <button 
                      key={idea.id} 
                      onClick={() => openIdeaFromIndex(idea)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                    >
                      <span className="text-slate-300 font-mono text-xs font-bold w-6">{idea.id}</span>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700 truncate">{idea.title}</span>
                      <ArrowRight size={12} className="ml-auto text-transparent group-hover:text-blue-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                  <div className="bg-orange-600 p-2 rounded-lg text-white"><Wrench size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 uppercase tracking-tighter">Tangible & Sweaty Ventures</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {playbookData.filter(i => i.category === "Tangible & Sweaty").map(idea => (
                    <button 
                      key={idea.id} 
                      onClick={() => openIdeaFromIndex(idea)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
                    >
                      <span className="text-slate-300 font-mono text-xs font-bold w-6">{idea.id}</span>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700 truncate">{idea.title}</span>
                      <ArrowRight size={12} className="ml-auto text-transparent group-hover:text-orange-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-indigo-600 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to build your momentum?</h2>
            <button 
              onClick={() => setView('playbook')}
              className="bg-white text-indigo-600 px-12 py-5 rounded-3xl font-black text-xl hover:scale-105 transition-transform shadow-2xl shadow-indigo-900/50"
            >
              Access the Playbook
            </button>
            <p className="mt-8 text-indigo-100 opacity-80 font-medium">Stop searching. Start building.</p>
          </div>
        </section>

        <footer className="py-12 border-t border-slate-100 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
          © 2024 The Founder's Playbook • Collaborative Entrepreneurship Tool
        </footer>
      </div>
    );
  }

  // --- PLAYBOOK DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 relative">
      
      {/* Table of Contents Trigger */}
      <div className="fixed top-6 left-6 z-40 flex gap-2 md:top-8 md:left-8">
        <button 
          onClick={() => setView('landing')}
          className="bg-white border border-slate-200 shadow-lg p-3 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-slate-700"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Landing</span>
        </button>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="bg-white border border-slate-200 shadow-lg p-3 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-slate-700 group"
        >
          <Menu size={20} className="group-hover:text-indigo-600" />
          <span className="hidden sm:inline">Contents</span>
        </button>
      </div>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 transform transition-transform animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-tighter text-lg">
                <BookOpen size={20} />
                Contents
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-8">
              <div>
                <h4 className="text-blue-600 font-bold text-xs uppercase tracking-widest px-3 mb-3">Modern & Digital</h4>
                <div className="space-y-1">
                  {playbookData.filter(i => i.category === "Modern & Digital").map(idea => (
                    <button 
                      key={idea.id}
                      onClick={() => { setSelectedIdea(idea); setIsSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-slate-300 font-mono text-[10px] w-4">{idea.id}</span>
                      <span className="truncate">{idea.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-orange-600 font-bold text-xs uppercase tracking-widest px-3 mb-3">Tangible & Sweaty</h4>
                <div className="space-y-1">
                  {playbookData.filter(i => i.category === "Tangible & Sweaty").map(idea => (
                    <button 
                      key={idea.id}
                      onClick={() => { setSelectedIdea(idea); setIsSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-slate-300 font-mono text-[10px] w-4">{idea.id}</span>
                      <span className="truncate">{idea.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Playbook Header */}
      <header className="max-w-6xl mx-auto mb-12 text-center mt-12 sm:mt-0">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 text-white">
          <Lightbulb size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 uppercase italic">
          Playbook Dashboard
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose your venture and leverage the AI Assistant to plan your execution.
        </p>
      </header>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, tags, or industry..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl border transition-all ${
                filter === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map(idea => (
          <div 
            key={idea.id} 
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
            onClick={() => setSelectedIdea(idea)}
          >
            <div className="flex justify-between items-start mb-4">
              <CategoryTag category={idea.category} />
              <div className="text-slate-300 font-mono text-xs font-bold">#{idea.id}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
              {idea.title}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
              {idea.why}
            </p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Explore Strategy <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal (Unchanged AI Logic) */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedIdea(null)} />
          <div className="relative bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <button onClick={() => setSelectedIdea(null)} className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors">
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 flex flex-col md:flex-row">
              <div className="flex-1 p-6 md:p-10 border-r border-slate-100 space-y-8">
                <div>
                  <CategoryTag category={selectedIdea.category} />
                  <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 text-slate-900 leading-tight">{selectedIdea.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{tag}</span>
                    ))}
                  </div>
                </div>
                
                <section>
                  <div className="flex items-center gap-2 text-indigo-600 mb-3 font-black uppercase tracking-widest text-sm italic">
                    <TrendingUp size={16} /> The Opportunity
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xl font-medium border-l-4 border-indigo-100 pl-4 py-1 italic">
                    "{selectedIdea.why}"
                  </p>
                </section>

                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-6 font-black uppercase tracking-widest text-sm">
                    <Wrench size={16} /> Action Plan
                  </div>
                  <ul className="space-y-6">
                    {selectedIdea.how.map((step, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center font-bold text-white text-lg">
                          {idx + 1}
                        </span>
                        <p className="text-slate-700 pt-1.5 leading-relaxed text-lg">{step}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="w-full md:w-80 bg-slate-50/80 p-6 space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4 uppercase tracking-tighter italic">
                  <Sparkles size={20} /> AI Assistant
                </div>
                {aiError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex gap-2"><AlertCircle size={14} />{aiError}</div>}
                
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Names</h5>
                  {!aiNames ? (
                    <button onClick={brainstormNames} disabled={isGenerating} className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                      {isGenerating === 'names' ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Suggest Names'}
                    </button>
                  ) : (
                    <div className="space-y-3">{aiNames.map((n, i) => (<div key={i}><p className="font-bold text-indigo-600 text-sm">{n.name}</p><p className="text-[10px] text-slate-400 italic">{n.tagline}</p></div>))}</div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-widest">4-Month Roadmap</h5>
                  {!aiRoadmap ? (
                    <button onClick={generateRoadmap} disabled={isGenerating} className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                      {isGenerating === 'roadmap' ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Build Roadmap'}
                    </button>
                  ) : (
                    <div className="space-y-3 overflow-y-auto max-h-48 pr-1">{Object.entries(aiRoadmap).map(([m, t]) => (<div key={m}><p className="text-[9px] font-black uppercase text-indigo-400 mb-1">{m}</p><ul className="text-[11px] text-slate-600 space-y-0.5">{t.map((x, i) => <li key={i}>• {x}</li>)}</ul></div>))}</div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Visual Concept</h5>
                  {!aiLogo ? (
                    <button onClick={generateLogoConcept} disabled={isGenerating} className="w-full border-2 border-indigo-600 text-indigo-600 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                      {isGenerating === 'logo' ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Generate Concept'}
                    </button>
                  ) : (
                    <div className="animate-in zoom-in"><img src={aiLogo} className="w-full aspect-square rounded-xl bg-slate-100 object-cover" /><p className="text-[9px] text-slate-400 text-center mt-2 italic">Imagen Concept</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>© 2024 • THE FOUNDER'S PLAYBOOK • AI EDITION</p>
      </footer>
    </div>
  );
}
