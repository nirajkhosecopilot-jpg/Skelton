import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectDescriptionForm from './components/ProjectDescriptionForm'
import RequiredInformation from './components/RequiredInformation'
import Architecture from './components/Architecture'
import ArchitectureOverview from './components/ArchitectureOverview'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<ProjectDescriptionForm />} />
          <Route path="/required-information" element={<RequiredInformation />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/architecture-overview" element={<ArchitectureOverview />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
