import { main as engineMain } from '@/engine/main';
import { main as renderMain } from '@/render/main';

import '@/render/styles/activity.css';
import '@/render/styles/dialog.css';
import '@/render/styles/energy.css';
import '@/render/styles/inventory.css';
import '@/render/styles/menu.css';
import '@/render/styles/quest.css';
import '@/render/styles/tilemap.css';

renderMain();
engineMain();
