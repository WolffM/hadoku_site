/**
 * ContactAdmin - Main Export
 *
 * This file has been refactored into a modular structure:
 * - Hooks: ./ContactAdmin/hooks/
 * - Components: ./ContactAdmin/Mail/, ./ContactAdmin/Whitelist/, ./ContactAdmin/Appointments/
 * - API Client: ../lib/api/contact-admin-client.ts
 * - Storage: ../lib/storage/contact-admin-storage.ts
 * - Constants: ../config/contact-admin.ts
 *
 * The original 1,055-line monolithic component has been split into:
 * - 5 custom hooks for state management
 * - 6 feature components (Mail, Whitelist, Appointments)
 * - API client layer with type safety
 * - Centralized constants and configuration
 */

export { default } from './ContactAdmin/ContactAdminRefactored';
