import Box from '@mui/material/Box';
import TimelineEditorView from './TimelineEditorView';
import { projects } from './data/projects';

/**
 * Démo du POC : la vue « Banc de montage » (timeline d'édition vidéo) avec des
 * données de démonstration. Remplacez `projects` par vos vrais projets (voir
 * src/data/projects.ts et le type Project dans src/types.ts).
 */
export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#060607', py: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 1.5, md: 3 } }}>
        <TimelineEditorView projects={projects} />
      </Box>
    </Box>
  );
}
