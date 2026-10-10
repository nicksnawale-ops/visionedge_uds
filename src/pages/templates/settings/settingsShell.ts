/** The settings page is generic: it always uses the Generic product shell (sidebar, product name, top bar). */
import { getDashboardUseCase } from '../dashboard/data/useCases';

export const SETTINGS_USE_CASE = 'generic';

export const SETTINGS_SHELL = getDashboardUseCase(SETTINGS_USE_CASE);
