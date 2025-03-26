import BackupManagement from './components/BackupManagement';
import UpdateManagement from './components/UpdateManagement';

// Eski kod...
function App() {
  return (
    <div>
      <nav>{/* Navigatsiya */}</nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/logs" element={<AdminLogs />} />
        <Route path="/backups" element={<BackupManagement />} /> {/* Yangi marshrut */}
        <Route path="/updates" element={<UpdateManagement />} />
      </Routes>
    </div>
  );
}