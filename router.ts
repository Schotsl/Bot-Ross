import { Router } from 'https://deno.land/x/oak/mod.ts';

import { addLabel, deleteLabel, getLabels, updateLabel } from './controller/label.ts'

const router = new Router()

// Add the label endpoints
router.get('/label', getLabels);
router.put('/label/:uuid', updateLabel);
router.post('/label', addLabel);
router.delete('/label/:uuid', deleteLabel);

export default router