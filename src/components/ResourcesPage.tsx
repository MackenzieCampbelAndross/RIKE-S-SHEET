import React, { useState } from 'react';
import { ArrowLeft, Code, Terminal, Layers, Database, Copy, Check } from 'lucide-react';
import type { CourseId, CourseMetadata, CourseStats } from '../types/curriculum';
import { CourseSwitcher } from './CourseSwitcher';

interface ResourcesPageProps {
  onBack: () => void;
  courseMeta?: CourseMetadata;
  courses?: CourseStats[];
  onSelectCourse?: (courseId: CourseId) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  onBack,
  courseMeta,
  courses,
  onSelectCourse,
}) => {
  const defaultTab = courseMeta?.id === 'java-heavy' ? 'java' : courseMeta?.id === 'python' ? 'python' : 'cpp';
  const [activeCategory, setActiveCategory] = useState<'cpp' | 'java' | 'python' | 'patterns' | 'core' | 'system'>(defaultTab);
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

        <div className="flex items-center space-x-3">
          {courseMeta && courses && onSelectCourse && (
            <CourseSwitcher
              currentCourseId={courseMeta.id}
              courses={courses}
              onSelectCourse={onSelectCourse}
            />
          )}
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white hidden sm:inline">
            PREPARATION RESOURCES
          </span>
        </div>
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
              <span>C++ &amp; STL</span>
            </button>

            <button
              onClick={() => setActiveCategory('java')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'java'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Java Collections</span>
            </button>

            <button
              onClick={() => setActiveCategory('python')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'python'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Python DSA</span>
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
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Contiguous memory allocation. Best for indexed lookups and sequential iteration.</p>
              </div>

              {/* Unordered Map */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">std::unordered_map &bull; Hash Table</h3>
                  <button
                    onClick={() => copyCode('cpp-map', 'unordered_map<string, int> mp;\nmp["apple"] = 5; // O(1) avg\nif (mp.count("apple")) { ... }\nfor (auto& [k, v] : mp) { ... }')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'cpp-map' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`unordered_map<string, int> mp;
mp["apple"] = 5; // O(1) average
if (mp.count("apple")) { ... }
for (auto& [k, v] : mp) { ... }`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Hash table with average O(1) insertions, deletions, and key lookups.</p>
              </div>
            </div>
          </div>
        )}

        {/* Java Collections Tab */}
        {activeCategory === 'java' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Java Collections Framework &amp; Essential Utilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ArrayList */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">ArrayList &amp; Sorting</h3>
                  <button
                    onClick={() => copyCode('java-arraylist', 'List<Integer> list = new ArrayList<>();\nlist.add(10);\nCollections.sort(list); // Dual-Pivot Quicksort / Timsort\nlist.sort((a, b) -> b - a); // Descending')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'java-arraylist' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`List<Integer> list = new ArrayList<>();
list.add(10); // O(1) amortized
Collections.sort(list); // O(N log N)
list.sort((a, b) -> b - a); // Descending sort`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Dynamic array backed by continuous array resizing by 50% (newCapacity = oldCapacity + (oldCapacity &gt;&gt; 1)).</p>
              </div>

              {/* HashMap */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">HashMap &amp; Frequency Counter</h3>
                  <button
                    onClick={() => copyCode('java-hashmap', 'Map<String, Integer> map = new HashMap<>();\nmap.put("key", map.getOrDefault("key", 0) + 1);\nfor (Map.Entry<String, Integer> e : map.entrySet()) {\n  System.out.println(e.getKey() + ": " + e.getValue());\n}')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'java-hashmap' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`Map<String, Integer> map = new HashMap<>();
map.put("key", map.getOrDefault("key", 0) + 1);
for (Map.Entry<String, Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + ": " + e.getValue());
}`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">O(1) average lookup. Buckets treeify to Red-Black Trees when chain exceeds TREEIFY_THRESHOLD (8).</p>
              </div>
            </div>
          </div>
        )}

        {/* Python DSA Tab */}
        {activeCategory === 'python' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Python Collections, heapq &amp; Algorithmic Idioms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Counter and defaultdict */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">collections.Counter &amp; defaultdict</h3>
                  <button
                    onClick={() => copyCode('py-counter', 'from collections import Counter, defaultdict\ncounts = Counter([1, 2, 2, 3]) # counts[2] == 2\nadj = defaultdict(list)\nadj[u].append(v)')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'py-counter' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`from collections import Counter, defaultdict
counts = Counter("placement_prep") # O(N) frequency
adj = defaultdict(list)
adj[node].append(neighbor)`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">High performance hashing wrappers in CPython eliminating KeyError checks.</p>
              </div>

              {/* Heapq */}
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">heapq &bull; Priority Queue</h3>
                  <button
                    onClick={() => copyCode('py-heapq', 'import heapq\nheap = [3, 1, 4]\nheapq.heapify(heap) # O(N) in-place min-heap\nheapq.heappush(heap, 2) # O(log N)\nsmallest = heapq.heappop(heap) # O(log N)')}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
                    title="Copy Snippet"
                  >
                    {copiedId === 'py-heapq' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-3 bg-[#091424] dark:bg-[#151515] text-[#FCD34D] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-transparent dark:border-white/5">
{`import heapq
heap = [3, 1, 4]
heapq.heapify(heap) # O(N) min-heap
heapq.heappush(heap, 2) # O(log N)
min_val = heapq.heappop(heap) # O(log N)`}
                </pre>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Min-heap implementation over standard Python lists. For max-heap, negate values.</p>
              </div>
            </div>
          </div>
        )}

        {/* DSA Patterns Tab */}
        {activeCategory === 'patterns' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              High-Frequency Algorithmic Blueprints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">1. Two Pointers (Opposite Ends)</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Applicable to sorted arrays for pair sum, palindrome verification, and water trapping.</p>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">2. Sliding Window (Dynamic Expansion)</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Applicable to contiguous subarray/substring problems under dynamic constraints.</p>
              </div>
            </div>
          </div>
        )}

        {/* Core CS Tab */}
        {activeCategory === 'core' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Computer Science Core Subject Interview Sheets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Operating Systems</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Process vs Thread, Semaphores, Mutex, Banker's Algorithm, Paging &amp; Virtual Memory.</p>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">DBMS &amp; SQL</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">ACID Properties, Normalization (1NF to BCNF), Indexing (B+ Trees), Joins &amp; Window Functions.</p>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Computer Networks</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">TCP 3-Way Handshake, Flow vs Congestion Control, DNS, HTTP/HTTPS, IP Subnetting.</p>
              </div>
            </div>
          </div>
        )}

        {/* System Design Tab */}
        {activeCategory === 'system' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              High-Level System Design Fundamentals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Scalability &amp; Load Balancing</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Horizontal vs Vertical scaling, Reverse Proxy (Nginx), Round-Robin and Consistent Hashing.</p>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-2">
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Caching &amp; CAP Theorem</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Redis/Memcached, Cache-Aside vs Write-Through, Consistency vs Availability under network partitions.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
