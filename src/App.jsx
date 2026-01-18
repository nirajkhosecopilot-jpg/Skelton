import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectDescriptionForm from './components/ProjectDescriptionForm'
import RequiredInformation from './components/RequiredInformation'
import Architecture from './components/Architecture'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<ProjectDescriptionForm />} />
          <Route path="/required-information" element={<RequiredInformation />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
