import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CleanWhiteDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFFFF] to-[#F8F9FA] text-[#141b2b] antialiased flex flex-col font-sans selection:bg-[#dbe1ff] selection:text-[#00174b]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#E5E7EB] transition-colors duration-150 ease-in-out">
        <div className="flex justify-between items-center w-full px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/')} 
              aria-label="Back to Hub" 
              className="flex items-center justify-center p-1.5 rounded-lg text-[#141b2b] hover:bg-[#f1f3ff] transition-colors duration-150"
            >
              <span className="text-xl">⊞</span>
            </button>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-semibold text-[#141b2b] tracking-tight">Workspace Overview</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Workspace Switch Dropdown Trigger */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-[#f1f3ff] rounded-lg border border-[#c3c6d7]/50 text-xs font-semibold text-[#141b2b]">
              <span className="w-2 h-2 rounded-full bg-[#004ac6]"></span>
              <span>JOBLEX Workspace</span>
              <span className="text-xs text-[#565e74]">▼</span>
            </div>
            <button 
              aria-label="Notifications" 
              className="relative flex items-center justify-center p-1.5 rounded-lg text-[#434655] hover:bg-[#f1f3ff] transition-colors duration-150"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#004ac6] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Canvas */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-5 pb-24 space-y-6">
        {/* 1. Header Greeting & Scope Indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#f1f3ff] border border-[#c3c6d7]/60 text-[#565e74] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]"></span>
              <span>JOBLEX Studio • Enterprise Tier</span>
            </span>
            <span className="text-[11px] font-medium text-[#565e74]">Q3 Active Cycle</span>
          </div>
          <div className="pt-1">
            <h2 className="text-2xl font-semibold text-[#141b2b]">Executive Summary</h2>
            <p className="text-xs text-[#434655]">Real-time consolidated fiscal balance and project pipeline.</p>
          </div>
        </div>

        {/* 2. Primary Metric Summary Cards */}
        <div className="space-y-2">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#565e74]">Total Net Revenue</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#004ac6] text-[11px] font-semibold">
                ↗ +8.4%
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl font-bold text-[#141b2b] tracking-tight">$128,450.00</div>
            </div>
            <div className="mt-2 text-[11px] text-[#434655] flex items-center justify-between border-t border-[#F3F4F6] pt-2">
              <span>Target: $140,000.00</span>
              <span className="text-[#565e74]">91.7% of Goal</span>
            </div>
          </div>

          {/* Split Metric Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Active Projects */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#565e74]">Pipeline</span>
                  <span className="text-sm">📁</span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#141b2b]">14 active</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#565e74]">
                <span>On Schedule</span>
                <span className="font-semibold text-[#141b2b]">12/14</span>
              </div>
            </div>

            {/* Operational Burn */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#565e74]">Burn Rate</span>
                  <span className="text-sm">🔥</span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#141b2b]">
                  $18,200<span className="text-xs font-normal text-[#565e74]">/mo</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#565e74]">
                <span>Runway</span>
                <span className="font-semibold text-[#141b2b]">18.4 mos</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Portfolio Allocation */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#141b2b]">Portfolio Allocation</h3>
              <p className="text-[11px] text-[#565e74]">Capital distribution across functional clusters</p>
            </div>
            <span className="text-[11px] font-semibold text-[#565e74]">100% Assigned</span>
          </div>

          {/* Segmented Bar Meter */}
          <div className="w-full h-2.5 bg-[#f1f3ff] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#004ac6]" style={{ width: '42%' }}></div>
            <div className="h-full bg-[#3B82F6]" style={{ width: '28%' }}></div>
            <div className="h-full bg-[#bec6e0]" style={{ width: '18%' }}></div>
            <div className="h-full bg-[#c3c6d7]" style={{ width: '12%' }}></div>
          </div>

          {/* Distribution Rows */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]"></span>
                <span className="text-[#141b2b] font-medium">Development</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#565e74]">$53,949.00</span>
                <span className="font-semibold text-[#141b2b] w-8 text-right">42%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                <span className="text-[#141b2b] font-medium">Design & UX</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#565e74]">$35,966.00</span>
                <span className="font-semibold text-[#141b2b] w-8 text-right">28%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bec6e0]"></span>
                <span className="text-[#141b2b] font-medium">Operations</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#565e74]">$23,121.00</span>
                <span className="font-semibold text-[#141b2b] w-8 text-right">18%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c3c6d7]"></span>
                <span className="text-[#141b2b] font-medium">Growth & Acquisition</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#565e74]">$15,414.00</span>
                <span className="font-semibold text-[#141b2b] w-8 text-right">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Quick Actions Bar */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#565e74] uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#E5E7EB] hover:bg-[#f1f3ff] transition-colors shadow-sm active:scale-[0.98]">
              <div className="w-9 h-9 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#004ac6] text-lg mb-1.5 font-bold">
                +
              </div>
              <span className="text-[11px] text-[#141b2b] font-medium">New Project</span>
            </button>

            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#E5E7EB] hover:bg-[#f1f3ff] transition-colors shadow-sm active:scale-[0.98]">
              <div className="w-9 h-9 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#004ac6] text-lg mb-1.5 font-bold">
                ⇄
              </div>
              <span className="text-[11px] text-[#141b2b] font-medium">Transfer Funds</span>
            </button>

            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#E5E7EB] hover:bg-[#f1f3ff] transition-colors shadow-sm active:scale-[0.98]">
              <div className="w-9 h-9 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#004ac6] text-lg mb-1.5 font-bold">
                ↓
              </div>
              <span className="text-[11px] text-[#141b2b] font-medium">Export Report</span>
            </button>
          </div>
        </div>

        {/* 5. Recent Activity */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)]">
          <div className="p-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#141b2b]">Recent Activity</h3>
              <p className="text-[11px] text-[#565e74]">Verified transactions and pipeline logs</p>
            </div>
            <button className="text-[#004ac6] text-[11px] font-semibold hover:underline">View All</button>
          </div>

          <div className="divide-y divide-[#F3F4F6]">
            {/* Item 1 */}
            <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-sm text-[#434655] flex-shrink-0">
                  💳
                </div>
                <div>
                  <div className="text-xs font-medium text-[#141b2b] leading-snug">Client Retainer • Apex Inc.</div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-[#565e74]">Today, 14:32</span>
                    <span className="text-[#c3c6d7]">•</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[10px] font-medium">Completed</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[#059669]">+ $12,500.00</div>
                <div className="text-[10px] text-[#565e74]">Wire ACH</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-sm text-[#434655] flex-shrink-0">
                  ☁️
                </div>
                <div>
                  <div className="text-xs font-medium text-[#141b2b] leading-snug">AWS Cloud Tier Infrastructure</div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-[#565e74]">Yesterday, 09:15</span>
                    <span className="text-[#c3c6d7]">•</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#004ac6] text-[10px] font-medium">Completed</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[#141b2b]">- $1,840.20</div>
                <div className="text-[10px] text-[#565e74]">Auto-Debit</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-sm text-[#434655] flex-shrink-0">
                  📝
                </div>
                <div>
                  <div className="text-xs font-medium text-[#141b2b] leading-snug">Design Sprint Milestone Beta</div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-[#565e74]">Oct 24, 16:40</span>
                    <span className="text-[#c3c6d7]">•</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-medium">In Review</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[#141b2b]">$4,200.00</div>
                <div className="text-[10px] text-[#565e74]">Escrow Hold</div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-sm text-[#434655] flex-shrink-0">
                  📄
                </div>
                <div>
                  <div className="text-xs font-medium text-[#141b2b] leading-snug">Contractor Payout • UX Research</div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[11px] text-[#565e74]">Oct 23, 11:20</span>
                    <span className="text-[#c3c6d7]">•</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151] text-[10px] font-medium">Pending</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[#141b2b]">- $2,450.00</div>
                <div className="text-[10px] text-[#565e74]">Net-15 Invoice</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-white border-t border-[#E5E7EB] shadow-sm">
        <button className="flex flex-col items-center justify-center text-[#004ac6] py-1 flex-1">
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-semibold mt-0.5">Overview</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#565e74] py-1 hover:text-[#004ac6] flex-1">
          <span className="text-lg">🧾</span>
          <span className="text-[10px] mt-0.5">Ledger</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#565e74] py-1 hover:text-[#004ac6] flex-1">
          <span className="text-lg">👥</span>
          <span className="text-[10px] mt-0.5">Workspace</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#565e74] py-1 hover:text-[#004ac6] flex-1">
          <span className="text-lg">⚙️</span>
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </nav>
    </div>
  );
}
