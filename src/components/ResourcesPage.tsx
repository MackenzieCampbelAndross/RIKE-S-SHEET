import React, { useState } from 'react';
import { ArrowLeft, Code, Terminal, Layers, Database, Copy, Check } from 'lucide-react';

interface ResourcesPageProps {
  onBack: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'cpp' | 'patterns' | 'core' | 'system'>('cpp');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Workspace</span>
        </button>
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
          PREPARATION RESOURCES
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-7 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title */}
        <div className="space-y-1 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
            Placement Resource Bank
          </h1>
          <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96]">
            Curated syntax references, high-frequency DSA blueprints, and core engineering interview sheets.
          </p>

          {/* Category Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setActiveCategory('cpp')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'cpp'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>C++ &amp; STL Cheatsheet</span>
            </button>

            <button
              onClick={() => setActiveCategory('patterns')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'patterns'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DSA Patterns</span>
            </button>

            <button
              onClick={() => setActiveCategory('core')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'core'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Core CS (OS, DBMS, CN)</span>
            </button>

            <button
              onClick={() => setActiveCategory('system')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'system'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>System Design Primer</span>
            </button>
          </div>
        </div>

        {/* C++ STL Tab */}
        {activeCategory === 'cpp' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Essential C++ Standard Template Library Cheatsheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vector */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">std::vector &bull; Dynamic Array</h3>
                  <button
                    onClick={() => copyCode('cpp-vector', 'vector<int> v = {1, 2, 3};\nv.push_back(4); // O(1) amortized\nv.pop_back();   // O(1)\nsort(v.begin(), v.end()); // O(N log N)')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'cpp-vector' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`vector<int> v = {1, 2, 3};
v.push_back(4); // O(1) amortized
v.pop_back();   // O(1)
sort(v.begin(), v.end()); // O(N log N)`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Continuous memory allocation. Best for indexed lookups and sequential iteration.</p>
              </div>

              {/* Unordered Map */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">std::unordered_map &bull; Hash Table</h3>
                  <button
                    onClick={() => copyCode('cpp-map', 'unordered_map<string, int> mp;\nmp["target"] = 10; // O(1) avg\nif (mp.count("target")) {\n    // key exists\n}')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'cpp-map' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`unordered_map<string, int> mp;
mp["target"] = 10; // O(1) avg
if (mp.count("target")) {
    int val = mp["target"];
}`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Hash map. Average O(1) insertion, deletion, and lookup. Worst case O(N) on collisions.</p>
              </div>

              {/* Priority Queue */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">std::priority_queue &bull; Heap</h3>
                  <button
                    onClick={() => copyCode('cpp-pq', '// Max-heap (default)\npriority_queue<int> maxH;\n\n// Min-heap\npriority_queue<int, vector<int>, greater<int>> minH;')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'cpp-pq' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`// Max-Heap (default)
priority_queue<int> maxH;

// Min-Heap
priority_queue<int, vector<int>, greater<int>> minH;`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Heap structure. O(log N) push/pop, O(1) top lookup. Indispensable for Dijkstra and Top-K elements.</p>
              </div>

              {/* Custom Comparator */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Lambda Comparator</h3>
                  <button
                    onClick={() => copyCode('cpp-comp', 'auto comp = [](const pair<int,int>& a, const pair<int,int>& b) {\n    return a.first > b.first; // ascending\n};\nsort(v.begin(), v.end(), comp);')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'cpp-comp' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`auto comp = [](const auto& a, const auto& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second > b.second;
};
sort(v.begin(), v.end(), comp);`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Clean inline sorting logic for intervals, coordinate pairs, and complex objects.</p>
              </div>
            </div>
          </div>
        )}

        {/* DSA Patterns Tab */}
        {activeCategory === 'patterns' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              High Frequency 15+ LPA Placement Patterns
            </h2>

            <div className="space-y-3">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">1. Two Pointers / Sliding Window</h3>
                  <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FAE392] text-[#091424]">Frequency: Very High</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                  Applied when seeking subarrays or contiguous segments with a monotonic condition (sum &le; K, at most K distinct elements). Reduces O(N&sup2;) brute force to O(N).
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">2. Binary Search on Answer</h3>
                  <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FAE392] text-[#091424]">Frequency: High</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                  Used when the decision function is monotonic: `if check(mid) == true`, then all values &ge; mid or &le; mid are also valid. Classic problems: Book Allocation, Painter's Partition, Aggressive Cows.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">3. Dynamic Programming (1D &bull; 2D &bull; Knapsack &bull; MCM)</h3>
                  <span className="text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-[#FAE392] text-[#091424]">Frequency: Critical</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                  Identified by overlapping subproblems and optimal substructure. 4 key steps: State definition `dp[i][j]`, Base case, State transition recurrence, and Space optimization from O(N&sup2;) to O(N).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Core CS Tab */}
        {activeCategory === 'core' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Computer Science Fundamentals Rapid Fire
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Operating Systems (OS)</h3>
                <ul className="text-xs text-[#64748B] dark:text-[#9E9E96] space-y-1 list-disc pl-4">
                  <li>Process vs Thread (Address space, context switch cost)</li>
                  <li>Deadlock 4 Coffman conditions: Mutual Exclusion, Hold &amp; Wait, No Preemption, Circular Wait</li>
                  <li>Virtual Memory, Paging, TLB, Page Fault Handling, LRU replacement</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Database Management Systems (DBMS)</h3>
                <ul className="text-xs text-[#64748B] dark:text-[#9E9E96] space-y-1 list-disc pl-4">
                  <li>ACID Properties: Atomicity, Consistency, Isolation, Durability</li>
                  <li>Indexing: B+ Trees vs Hash Index, Clustered vs Non-Clustered</li>
                  <li>SQL Joins, Normalization (1NF, 2NF, 3NF, BCNF)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* System Design Tab */}
        {activeCategory === 'system' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              High-Level System Design (HLD) Building Blocks
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">CAP Theorem</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">In any distributed data store, you can only pick two of Consistency, Availability, and Partition Tolerance.</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Caching Strategies</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Read-Through, Write-Through, Write-Behind, and Cache-Aside. Redis vs Memcached.</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-1.5">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Load Balancing</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Round Robin, Least Connections, Consistent Hashing for stateless and stateful clusters.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
