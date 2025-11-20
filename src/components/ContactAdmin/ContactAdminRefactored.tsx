/**
 * Contact Admin Component - Refactored
 * Main component that orchestrates all sub-components and hooks
 */

import { useState, useMemo } from 'react';
import ThemePickerWrapper from '../ThemePickerWrapper';
import { ContactAdminClient } from '../../lib/api/contact-admin-client';

// Hooks
import { useAdminAuth } from './hooks/useAdminAuth';
import { useEmails } from './hooks/useEmails';
import { useComposeForm } from './hooks/useComposeForm';
import { useWhitelist } from './hooks/useWhitelist';
import { useAppointmentConfig } from './hooks/useAppointmentConfig';

// Components
import { MailSidebar } from './Mail/MailSidebar';
import { MailList } from './Mail/MailList';
import { MailDetail } from './Mail/MailDetail';
import { MailCompose } from './Mail/MailCompose';
import { WhitelistModal } from './Whitelist/WhitelistModal';
import { AppointmentConfigEditor } from './Appointments/AppointmentConfigEditor';

type ViewMode = 'inbox' | 'compose';
type TabMode = 'mail' | 'appointments';

export default function ContactAdminRefactored() {
	// Auth
	const { adminKey, keyValidated, loading: authLoading, error: authError } = useAdminAuth();

	// Create API client once auth is validated
	const client = useMemo(
		() => (keyValidated && adminKey ? new ContactAdminClient(adminKey) : null),
		[keyValidated, adminKey]
	);

	// State
	const [view, setView] = useState<ViewMode>('inbox');
	const [activeTab, setActiveTab] = useState<TabMode>('mail');
	const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
	const [showTrash, setShowTrash] = useState(false);

	// Hooks
	const emailsHook = useEmails(client);
	const composeHook = useComposeForm(client);
	const whitelistHook = useWhitelist(client);
	const appointmentHook = useAppointmentConfig(client, activeTab === 'appointments');

	// Filter emails based on selection
	const filteredEmails = useMemo(() => {
		if (showTrash) {
			return emailsHook.emails.filter((email) => email.status === 'deleted');
		}

		if (selectedRecipient === 'all') {
			return emailsHook.emails.filter((email) => email.status !== 'deleted');
		}

		return emailsHook.emails.filter(
			(email) => email.recipient === selectedRecipient && email.status !== 'deleted'
		);
	}, [emailsHook.emails, selectedRecipient, showTrash]);

	const unreadCount = useMemo(
		() => filteredEmails.filter((e) => !emailsHook.readEmails.has(e.id)).length,
		[filteredEmails, emailsHook.readEmails]
	);

	// Handlers
	const handleSelectRecipient = (recipient: string) => {
		setSelectedRecipient(recipient);
		setShowTrash(false);
		emailsHook.selectEmail(null);
	};

	const handleShowTrash = () => {
		setShowTrash(true);
		emailsHook.selectEmail(null);
	};

	const handleReply = () => {
		if (!emailsHook.selectedEmail) return;
		composeHook.replyTo(emailsHook.selectedEmail.email, emailsHook.selectedEmail.name);
		setView('compose');
	};

	const handleSendEmail = async () => {
		const success = await composeHook.sendEmail();
		if (success) {
			composeHook.reset();
			setView('inbox');
		}
	};

	// Loading state
	if (authLoading) {
		return (
			<div className="h-screen bg-bg flex items-center justify-center">
				<div className="text-text-secondary">Loading...</div>
			</div>
		);
	}

	// Error state
	if (authError) {
		return (
			<div className="h-screen bg-bg flex items-center justify-center">
				<div className="text-center">
					<div className="text-danger text-lg mb-2">Error: {authError}</div>
					{authError.includes('key') && (
						<div className="text-text-secondary text-sm">
							Please check your admin key and try again.
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-bg">
			{/* Top Bar with Navigation */}
			<div className="border-b border-border bg-bg-card">
				<div className="flex items-center justify-between px-6 py-3">
					<div className="flex items-center gap-4">
						<h1 className="text-xl font-semibold text-text">Hadoku Admin</h1>
						<ThemePickerWrapper />
					</div>
				</div>
				{/* Navigation Tabs */}
				<div className="flex gap-1 px-6">
					<button
						onClick={() => setActiveTab('mail')}
						className={`px-4 py-2 font-medium transition-colors border-b-2 ${
							activeTab === 'mail'
								? 'text-primary border-primary'
								: 'text-text-secondary border-transparent hover:text-text'
						}`}
					>
						Mail
					</button>
					<button
						onClick={() => setActiveTab('appointments')}
						className={`px-4 py-2 font-medium transition-colors border-b-2 ${
							activeTab === 'appointments'
								? 'text-primary border-primary'
								: 'text-text-secondary border-transparent hover:text-text'
						}`}
					>
						Appointments
					</button>
				</div>
			</div>

			{/* Mail Tab Content */}
			{activeTab === 'mail' && view === 'inbox' && (
				<div className="flex flex-1 overflow-hidden">
					<MailSidebar
						emails={emailsHook.emails}
						selectedRecipient={selectedRecipient}
						showTrash={showTrash}
						onSelectRecipient={handleSelectRecipient}
						onShowTrash={handleShowTrash}
						onCompose={() => setView('compose')}
						onRefresh={emailsHook.refreshEmails}
						onOpenWhitelist={whitelistHook.openModal}
						refreshing={emailsHook.refreshing}
					/>

					<MailList
						emails={filteredEmails}
						selectedEmail={emailsHook.selectedEmail}
						selectedRecipient={selectedRecipient}
						showTrash={showTrash}
						readEmails={emailsHook.readEmails}
						unreadCount={unreadCount}
						onSelectEmail={emailsHook.selectEmail}
					/>

					{emailsHook.selectedEmail ? (
						<MailDetail
							email={emailsHook.selectedEmail}
							onReply={handleReply}
							onDelete={() => {
								if (emailsHook.selectedEmail) {
									emailsHook.deleteEmail(emailsHook.selectedEmail.id);
								}
							}}
							onRestore={() => {
								if (emailsHook.selectedEmail) {
									emailsHook.restoreEmail(emailsHook.selectedEmail.id);
								}
							}}
						/>
					) : (
						<div className="flex-1 flex items-center justify-center text-text-secondary">
							Select an email to read
						</div>
					)}
				</div>
			)}

			{/* Compose View */}
			{activeTab === 'mail' && view === 'compose' && (
				<MailCompose
					from={composeHook.form.from}
					to={composeHook.form.to}
					subject={composeHook.form.subject}
					message={composeHook.form.message}
					pastRecipients={composeHook.pastRecipients}
					sending={composeHook.sending}
					onFromChange={composeHook.setFrom}
					onToChange={composeHook.setTo}
					onSubjectChange={composeHook.setSubject}
					onMessageChange={composeHook.setMessage}
					onSend={handleSendEmail}
					onCancel={() => setView('inbox')}
				/>
			)}

			{/* Appointments Tab Content */}
			{activeTab === 'appointments' && (
				<AppointmentConfigEditor
					config={appointmentHook.config}
					loading={appointmentHook.loading}
					saving={appointmentHook.saving}
					onUpdate={appointmentHook.updateConfig}
					onSave={appointmentHook.saveConfig}
				/>
			)}

			{/* Whitelist Modal */}
			{whitelistHook.showModal && (
				<WhitelistModal
					whitelist={whitelistHook.whitelist}
					loading={whitelistHook.loading}
					onClose={whitelistHook.closeModal}
					onRemove={whitelistHook.removeFromWhitelist}
				/>
			)}
		</div>
	);
}
