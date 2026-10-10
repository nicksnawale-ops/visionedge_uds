/** The profile page is generic: it always uses the Generic product shell (sidebar items, product name, top bar). */
import { getDashboardUseCase } from '../dashboard/data/useCases';

export const PROFILE_USE_CASE = 'generic';

export const PROFILE_SHELL = getDashboardUseCase(PROFILE_USE_CASE);
