import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom'
import Creator from './pages/Creator'
import Gallery from './pages/Gallery'
import WorkInfo from './pages/WorkInfo'
import WorkDetail from './pages/WorkDetail'
import Works from './pages/Works'
import Home from './pages/Home'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/work-info" element={<WorkInfo />}>
          <Route path="creator/:workId" element={<Creator />} />
          <Route path="detail/:workId" element={<WorkDetail />} />
        </Route>
        <Route path="/works" element={<Works />} />
      </Routes>
    </Router>
  )
}

export default App
