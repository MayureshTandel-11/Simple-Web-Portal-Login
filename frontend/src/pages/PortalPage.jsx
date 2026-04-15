import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OpportunityCard from '../components/OpportunityCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileMenu from '../components/MobileMenu'
import { DEPARTMENTS } from '../constants'
import { EmptyState, SectionTitle, StatusMessage, Modal } from '../components/ui'
import { getOpportunities } from '../services/opportunitiesJson'

export default function PortalPage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [search, setSearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('Broadcast to All')
  const [sortOrder, setSortOrder] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('both')
  const [opportunities, setOpportunities] = useState([])
  const [error, setError] = useState('')
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const response = await getOpportunities()
        if (mounted) {
          if (response?.data && Array.isArray(response.data)) {
            setOpportunities(response.data)
            setError('')
          } else {
            setOpportunities([])
            setError(response?.error || 'Failed to fetch opportunities')
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch opportunities')
      }
    }
    load()
    const timer = setInterval(load, 4000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const filtered = useMemo(() => {
    const result = opportunities
      .filter((opp) => opp.announcementHeading.toLowerCase().includes(search.toLowerCase()))
      .filter(
        (opp) =>
          selectedDepartment === 'Broadcast to All' ||
          opp.department === 'Broadcast to All' ||
          opp.department === selectedDepartment,
      )
      .sort((a, b) => (sortOrder === 'asc' ? a.lastDate.localeCompare(b.lastDate) : b.lastDate.localeCompare(a.lastDate)))
    if (statusFilter === 'both') return result
    return result.filter((opp) => {
      const archived = opp.lastDate < today
      return statusFilter === 'active' ? !archived : archived
    })
  }, [opportunities, search, selectedDepartment, sortOrder, statusFilter, today])

  const active = filtered.filter((opp) => opp.lastDate >= today)
  const archived = filtered.filter((opp) => opp.lastDate < today)

  // Modal handler to prevent stale data
  const handleModalClose = () => {
    setSelectedOpportunity(null)
    setIsModalOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 px-3 pt-0 pb-4 md:px-5 md:pt-0 md:pb-5">
      <section className="flex-1 w-full space-y-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <MobileMenu>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Menu</h3>
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Back to Home
              </button>
            </div>
          </MobileMenu>
          <Navbar mode="student" />
        </div>
        <div className="glass-panel p-6">
          <SectionTitle title="Placement Portal" subtitle="Explore opportunities by department" />
        </div>
        {error && <StatusMessage type="error" message={error} />}
        <div className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Filters</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {filtered.length} results
            </span>
          </div>
          <div className="grid gap-4 xl:grid-cols-[2fr_1fr_1fr_1fr]">
            <input
              className="input-modern w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by opportunity heading..."
            />
            <select className="input-modern" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Deadline: Earliest First</option>
              <option value="desc">Deadline: Latest First</option>
            </select>
            <select className="input-modern" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="both">All Opportunities</option>
              <option value="active">Active Only</option>
              <option value="archived">Archived Only</option>
            </select>
            <select className="input-modern" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="Broadcast to All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="No opportunities match your filters" subtitle="Adjust your search or department filters" />
        ) : (
          <div className="space-y-6">
            {(statusFilter === 'both' || statusFilter === 'active') && (
              <section>
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Active Opportunities ({active.length})</h2>
                {active.length === 0 ? (
                  <EmptyState title="No active opportunities yet" subtitle="No active opportunities match your filters" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {active.map((opp) => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        onClick={() => {
                          setSelectedOpportunity(opp)
                          setIsModalOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            {(statusFilter === 'both' || statusFilter === 'archived') && (
              <section>
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Archived Opportunities ({archived.length})</h2>
                {archived.length === 0 ? (
                  <EmptyState title="No archived opportunities" subtitle="Expired opportunities will appear here" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {archived.map((opp) => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        onClick={() => {
                          setSelectedOpportunity(opp)
                          setIsModalOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}
