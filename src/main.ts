import { main as engineMain } from '@/engine/main';
import { main as renderMain } from '@/render/main';

import '@/render/styles/activity.css';
import '@/render/styles/inventory.css';
import '@/render/styles/tilemap.css';
import '@/render/styles/dialog.css';

renderMain();
engineMain();
