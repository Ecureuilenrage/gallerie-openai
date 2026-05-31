import Box from '@mui/material/Box';
import CreditsView from './CreditsView';
import { projects } from './data/projects';

/**
 * Démo du POC : la vue « Générique (titres) » en plein écran avec des données de
 * démonstration. Remplacez `projects` par vos vrais projets (voir src/data/projects.ts
 * et le type Project dans src/types.ts).
 */
export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#060607' }}>
      <CreditsView projects={projects} />
    </Box>
  );
}
