import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import AdminLayout from './AdminLayout';
import BioAdmin from './BioAdmin';
import Dashboard from './Dashboard';
import ExpertiseAdmin from './ExpertiseAdmin';
import GuestbookAdmin from './GuestbookAdmin';
import Login from './Login';
import PicturesAdmin from './PicturesAdmin';
import ProjectsAdmin from './ProjectsAdmin';
import SkillsAdmin from './SkillsAdmin';
import SocialsAdmin from './SocialsAdmin';
import TimelineAdmin from './TimelineAdmin';

/**
 * The whole admin area, loaded as one lazy chunk so public visitors never
 * download it. Paths are relative to /admin.
 */
export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="timeline" element={<TimelineAdmin />} />
          <Route path="expertise" element={<ExpertiseAdmin />} />
          <Route path="socials" element={<SocialsAdmin />} />
          <Route path="bio" element={<BioAdmin />} />
          <Route path="pictures" element={<PicturesAdmin />} />
          <Route path="guestbook" element={<GuestbookAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
