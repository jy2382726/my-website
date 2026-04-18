import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from './hooks/useTheme'
import { AuthProvider, useAuth } from './hooks/useAuth'
import SiteLayout from './layouts/SiteLayout'
import AppLayout from './layouts/AppLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CoursesPage from './pages/dashboard/CoursesPage'
import CourseDetailPage from './pages/dashboard/CourseDetailPage'
import LearnPage from './pages/dashboard/LearnPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import CoursesAdmin from './pages/admin/CoursesAdmin'
import LessonEditor from './pages/admin/LessonEditor'
import UsersAdmin from './pages/admin/UsersAdmin'
import StatsPage from './pages/admin/StatsPage'
import NotFound from './pages/NotFound'

function LoginGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/my-website">
        <AuthProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route
              path="/login"
              element={
                <LoginGuard>
                  <LoginPage />
                </LoginGuard>
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="learn/:id" element={<LearnPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/courses" replace />} />
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="lessons" element={<LessonEditor />} />
              <Route path="users" element={<UsersAdmin />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
