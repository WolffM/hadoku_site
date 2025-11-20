import { useState, useEffect } from 'react';
import ThemePickerWrapper from './ThemePickerWrapper';

interface Email {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived' | 'deleted';
	created_at: number;
	deleted_at?: number | null;
	ip_address: string;
	referrer: string | null;
	recipient?: string; // Which email address they sent to
}

const VALID_RECIPIENTS = [
	'matthaeus@hadoku.me',
	'mw@hadoku.me',
	'business@hadoku.me',
	'support@hadoku.me',
	'no-reply@hadoku.me',
	'hello@hadoku.me',
];

interface WhitelistEntry {
	email: string;
	whitelisted_at: number;
	whitelisted_by: string;
	contact_id: string | null;
	notes: string | null;
}

export default function ContactAdmin() {
	const [emails, setEmails] = useState<Email[]>([]);
	const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [view, setView] = useState<'inbox' | 'compose'>('inbox');
	const [activeTab, setActiveTab] = useState<'mail' | 'appointments'>('mail');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [adminKey, setAdminKey] = useState<string | null>(null);
	const [keyValidated, setKeyValidated] = useState(false);
	const [showTrash, setShowTrash] = useState(false);
	const [showWhitelist, setShowWhitelist] = useState(false);
	const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
	const [loadingWhitelist, setLoadingWhitelist] = useState(false);

	// Compose form state
	const [composeFrom, setComposeFrom] = useState(VALID_RECIPIENTS[0]);
	const [composeTo, setComposeTo] = useState('');
	const [composeSubject, setComposeSubject] = useState('');
	const [composeMessage, setComposeMessage] = useState('');
	const [pastRecipients, setPastRecipients] = useState<string[]>([]);
	const [sending, setSending] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [readEmails, setReadEmails] = useState<Set<string>>(new Set());

	// Load read emails from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem('hadoku_read_emails');
		if (stored) {
			setReadEmails(new Set(JSON.parse(stored)));
		}
	}, []);

	// Validate key from URL on mount
	useEffect(() => {
		async function validateKey() {
			// Get key from URL
			const urlParams = new URLSearchParams(window.location.search);
			const key = urlParams.get('key');

			if (!key) {
				setError('No admin key provided');
				setLoading(false);
				return;
			}

			try {
				// Validate key by calling session endpoint
				const response = await fetch('https://hadoku.me/session/create', {
					method: 'POST',
					headers: {
						'X-User-Key': key,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					setError('Invalid admin key');
					setLoading(false);
					return;
				}

				// Key is valid, save it
				setAdminKey(key);
				setKeyValidated(true);
			} catch {
				setError('Failed to validate admin key');
				setLoading(false);
			}
		}

		validateKey();
	}, []);

	// Fetch emails on mount (after key validation)
	useEffect(() => {
		if (!keyValidated || !adminKey) return;
		async function fetchEmails() {
			try {
				const response = await fetch('/contact/api/admin/submissions?limit=100&offset=0', {
					headers: {
						'X-User-Key': adminKey,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch emails');
				}

				const result = await response.json();
				setEmails(result.data.submissions);
				setLoading(false);

				// Load past recipients from localStorage
				const stored = localStorage.getItem('hadoku_past_recipients');
				if (stored) {
					setPastRecipients(JSON.parse(stored));
				}
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		}

		fetchEmails();
	}, [keyValidated, adminKey]);

	async function refreshEmails() {
		if (!adminKey) return;
		setRefreshing(true);
		try {
			const response = await fetch('/contact/api/admin/submissions?limit=100&offset=0', {
				headers: {
					'X-User-Key': adminKey,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch emails');
			}

			const result = await response.json();
			setEmails(result.data.submissions);
		} catch (err) {
			alert(`Failed to refresh emails: ${(err as Error).message}`);
		} finally {
			setRefreshing(false);
		}
	}

	async function deleteEmail(id: string) {
		if (!adminKey) return;
		if (!confirm('Move this email to trash?')) {
			return;
		}

		try {
			const response = await fetch(`/contact/api/admin/submissions/${id}`, {
				method: 'DELETE',
				headers: {
					'X-User-Key': adminKey,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to delete email');
			}

			// Update status to deleted in state
			setEmails((prev) =>
				prev.map((email) =>
					email.id === id ? { ...email, status: 'deleted' as const, deleted_at: Date.now() } : email
				)
			);
			if (selectedEmail?.id === id) {
				setSelectedEmail(null);
			}
		} catch (err) {
			alert(`Failed to delete email: ${(err as Error).message}`);
		}
	}

	async function restoreEmail(id: string) {
		if (!adminKey) return;

		try {
			const response = await fetch(`/contact/api/admin/submissions/${id}/restore`, {
				method: 'POST',
				headers: {
					'X-User-Key': adminKey,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to restore email');
			}

			// Update status to unread in state
			setEmails((prev) =>
				prev.map((email) =>
					email.id === id ? { ...email, status: 'unread' as const, deleted_at: null } : email
				)
			);
			if (selectedEmail?.id === id) {
				setSelectedEmail((prev) =>
					prev ? { ...prev, status: 'unread' as const, deleted_at: null } : null
				);
			}
		} catch (err) {
			alert(`Failed to restore email: ${(err as Error).message}`);
		}
	}

	// Fetch whitelist
	async function fetchWhitelist() {
		if (!adminKey) return;

		setLoadingWhitelist(true);
		try {
			const response = await fetch('/contact/api/admin/whitelist', {
				headers: {
					'X-User-Key': adminKey || '',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch whitelist');
			}

			const data = await response.json();
			setWhitelist(data.data.emails || []);
		} catch (err) {
			console.error('Failed to fetch whitelist:', err);
			alert('Failed to load whitelist');
		} finally {
			setLoadingWhitelist(false);
		}
	}

	// Delete from whitelist
	async function deleteFromWhitelist(email: string) {
		if (!adminKey) return;
		if (!confirm(`Remove ${email} from whitelist?`)) return;

		try {
			const response = await fetch(`/contact/api/admin/whitelist/${encodeURIComponent(email)}`, {
				method: 'DELETE',
				headers: {
					'X-User-Key': adminKey || '',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to remove from whitelist');
			}

			// Refresh whitelist
			await fetchWhitelist();
			alert('Email removed from whitelist');
		} catch (err) {
			console.error('Failed to remove from whitelist:', err);
			alert('Failed to remove from whitelist');
		}
	}

	async function sendEmail(e: React.FormEvent) {
		e.preventDefault();
		setSending(true);

		try {
			if (!adminKey) {
				throw new Error('No admin key available');
			}

			// Send email via API
			const response = await fetch('/contact/api/admin/send-email', {
				method: 'POST',
				headers: {
					'X-User-Key': adminKey,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from: composeFrom,
					to: composeTo,
					subject: composeSubject,
					text: composeMessage,
					replyTo: selectedEmail?.email,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
				throw new Error(errorData.message || `Failed to send email: ${response.statusText}`);
			}

			// Save recipient to past recipients
			if (composeTo && !pastRecipients.includes(composeTo)) {
				const updated = [...pastRecipients, composeTo];
				setPastRecipients(updated);
				localStorage.setItem('hadoku_past_recipients', JSON.stringify(updated));
			}

			// Clear form
			setComposeTo('');
			setComposeSubject('');
			setComposeMessage('');
			setView('inbox');
			alert('Email sent successfully!');
		} catch (err) {
			alert(`Failed to send email: ${(err as Error).message}`);
		} finally {
			setSending(false);
		}
	}

	const filteredEmails = showTrash
		? emails.filter((email) => email.status === 'deleted')
		: selectedRecipient === 'all'
			? emails.filter((email) => email.status !== 'deleted')
			: emails.filter(
					(email) => email.recipient === selectedRecipient && email.status !== 'deleted'
				);

	const unreadCount = filteredEmails.filter((e) => !readEmails.has(e.id)).length;
	const deletedCount = emails.filter((e) => e.status === 'deleted').length;

	if (loading) {
		return (
			<div className="h-screen bg-bg flex items-center justify-center">
				<div className="text-text-secondary">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen bg-bg flex items-center justify-center">
				<div className="text-center">
					<div className="text-danger text-lg mb-2">Error: {error}</div>
					{error.includes('key') && (
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
			{activeTab === 'mail' && view === 'inbox' ? (
				<div className="flex flex-1 overflow-hidden">
					{/* Sidebar */}
					<div className="w-64 border-r border-border bg-bg-alt">
						<div className="p-4">
							{/* Action Buttons */}
							<div className="space-y-2 mb-6">
								<button
									onClick={() => setView('compose')}
									className="w-full px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition-colors"
								>
									✉ Compose
								</button>
								<button
									onClick={refreshEmails}
									disabled={refreshing}
									className="w-full px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card disabled:opacity-50 transition-colors"
									title="Refresh emails"
								>
									{refreshing ? '↻ Refreshing...' : '↻ Refresh'}
								</button>
								<button
									onClick={() => {
										setShowWhitelist(true);
										fetchWhitelist();
									}}
									className="w-full px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card transition-colors"
									title="Manage email whitelist"
								>
									🔓 Whitelist
								</button>
							</div>

							<h2 className="text-sm font-semibold text-text-secondary mb-3">FOLDERS</h2>
							<div className="space-y-1">
								<button
									onClick={() => {
										setSelectedRecipient('all');
										setShowTrash(false);
										setSelectedEmail(null);
									}}
									className={`w-full text-left px-3 py-2 rounded text-sm ${
										selectedRecipient === 'all' && !showTrash
											? 'bg-primary-light text-primary-dark font-medium'
											: 'text-text hover:bg-bg-card'
									}`}
								>
									<span className="flex justify-between">
										<span>All Mail</span>
										<span className="text-text-secondary">
											{emails.filter((e) => e.status !== 'deleted').length}
										</span>
									</span>
								</button>
								{VALID_RECIPIENTS.map((recipient) => {
									const count = emails.filter(
										(e) => e.recipient === recipient && e.status !== 'deleted'
									).length;
									if (count === 0) return null;
									return (
										<button
											key={recipient}
											onClick={() => {
												setSelectedRecipient(recipient);
												setShowTrash(false);
												setSelectedEmail(null);
											}}
											className={`w-full text-left px-3 py-2 rounded text-sm ${
												selectedRecipient === recipient && !showTrash
													? 'bg-primary-light text-primary-dark font-medium'
													: 'text-text hover:bg-bg-card'
											}`}
										>
											<span className="flex justify-between">
												<span className="truncate">{recipient}</span>
												<span className="text-text-secondary">{count}</span>
											</span>
										</button>
									);
								})}
							</div>
							<div className="mt-6 pt-6 border-t border-border">
								<h2 className="text-sm font-semibold text-text-secondary mb-3">OTHER</h2>
								<button
									onClick={() => {
										setShowTrash(true);
										setSelectedEmail(null);
									}}
									className={`w-full text-left px-3 py-2 rounded text-sm ${
										showTrash
											? 'bg-primary-light text-primary-dark font-medium'
											: 'text-text hover:bg-bg-card'
									}`}
								>
									<span className="flex justify-between">
										<span>🗑️ Trash</span>
										<span className="text-text-secondary">{deletedCount}</span>
									</span>
								</button>
							</div>
						</div>
					</div>

					{/* Email List */}
					<div className="w-96 border-r border-border bg-bg overflow-y-auto">
						<div className="sticky top-0 bg-bg border-b border-border px-4 py-3">
							<h2 className="font-semibold text-text">
								{showTrash
									? '🗑️ Trash'
									: selectedRecipient === 'all'
										? 'All Mail'
										: selectedRecipient}
							</h2>
							<p className="text-sm text-text-secondary">
								{showTrash
									? `${filteredEmails.length} deleted`
									: `${unreadCount} unread of ${filteredEmails.length}`}
							</p>
						</div>
						<div>
							{filteredEmails.map((email) => {
								const isUnread = !readEmails.has(email.id);
								return (
									<button
										key={email.id}
										onClick={() => {
											setSelectedEmail(email);
											// Mark as read in localStorage
											if (!readEmails.has(email.id)) {
												const updated = new Set(readEmails);
												updated.add(email.id);
												setReadEmails(updated);
												localStorage.setItem('hadoku_read_emails', JSON.stringify([...updated]));
											}
										}}
										className={`w-full text-left px-4 py-3 border-b border-border-light hover:bg-bg-card ${
											selectedEmail?.id === email.id ? 'bg-primary-bg' : ''
										} ${isUnread ? 'bg-primary-bg/20' : ''}`}
									>
										<div className="flex justify-between items-start mb-1">
											<span
												className={`font-medium text-sm ${
													isUnread ? 'text-text' : 'text-text-secondary'
												}`}
											>
												{email.name}
											</span>
											<span className="text-xs text-text-secondary">
												{new Date(email.created_at).toLocaleDateString()}
											</span>
										</div>
										<div className="text-xs text-text-secondary mb-1">{email.email}</div>
										<div className="text-sm text-text-secondary truncate">{email.message}</div>
									</button>
								);
							})}
							{filteredEmails.length === 0 && (
								<div className="text-center py-12 text-text-secondary">No emails</div>
							)}
						</div>
					</div>

					{/* Email Detail */}
					<div className="flex-1 bg-bg overflow-y-auto">
						{selectedEmail ? (
							<div className="p-6">
								<div className="mb-6 pb-6 border-b border-border">
									<h2 className="text-2xl font-semibold text-text mb-2">
										Message from {selectedEmail.name}
									</h2>
									<div className="flex gap-4 text-sm text-text-secondary mb-4">
										<span>
											<strong>From:</strong> {selectedEmail.email}
										</span>
										<span>
											<strong>Date:</strong> {new Date(selectedEmail.created_at).toLocaleString()}
										</span>
										{selectedEmail.status === 'deleted' && selectedEmail.deleted_at && (
											<span>
												<strong>Deleted:</strong>{' '}
												{new Date(selectedEmail.deleted_at).toLocaleString()}
											</span>
										)}
									</div>
									<div className="flex gap-2">
										{selectedEmail.status === 'deleted' ? (
											<>
												<button
													onClick={() => restoreEmail(selectedEmail.id)}
													className="px-4 py-1 text-sm bg-success text-success-text rounded hover:opacity-90 transition-opacity"
												>
													↩ Restore
												</button>
												<div className="text-sm text-text-secondary py-1 px-2">
													This email is in trash
												</div>
											</>
										) : (
											<>
												<button
													onClick={() => {
														setComposeTo(selectedEmail.email);
														setComposeSubject(`Re: Message from ${selectedEmail.name}`);
														setView('compose');
													}}
													className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
												>
													Reply
												</button>
												<button
													onClick={() => deleteEmail(selectedEmail.id)}
													className="px-4 py-1 text-sm bg-danger text-danger-text rounded hover:opacity-90 transition-opacity"
												>
													Delete
												</button>
											</>
										)}
									</div>
								</div>
								<div className="prose max-w-none">
									<div className="whitespace-pre-wrap text-text">{selectedEmail.message}</div>
								</div>
								<div className="mt-6 pt-6 border-t border-border text-sm text-text-secondary">
									<div>IP Address: {selectedEmail.ip_address}</div>
									{selectedEmail.referrer && <div>Referrer: {selectedEmail.referrer}</div>}
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center h-full text-text-secondary">
								Select an email to read
							</div>
						)}
					</div>
				</div>
			) : activeTab === 'mail' && view === 'compose' ? (
				/* Compose View */
				<div className="flex-1 overflow-y-auto bg-bg-alt">
					<div className="max-w-4xl mx-auto p-8">
						<div className="flex items-center gap-4 mb-6">
							<button
								onClick={() => setView('inbox')}
								className="px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card transition-colors"
							>
								← Back to Inbox
							</button>
							<h2 className="text-2xl font-semibold text-text">New Message</h2>
						</div>
						<form
							onSubmit={sendEmail}
							className="bg-bg-card rounded-lg shadow-sm border border-border"
						>
							<div className="p-6 space-y-4">
								<div>
									<label className="block text-sm font-medium text-text mb-1">From</label>
									<select
										value={composeFrom}
										onChange={(e) => setComposeFrom(e.target.value)}
										className="w-full px-3 py-2 border border-border bg-bg text-text rounded focus:outline-none focus:shadow-focus"
										required
									>
										{VALID_RECIPIENTS.map((email) => (
											<option key={email} value={email}>
												{email}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-text mb-1">To</label>
									<input
										type="email"
										value={composeTo}
										onChange={(e) => setComposeTo(e.target.value)}
										list="past-recipients"
										className="w-full px-3 py-2 border border-border bg-bg text-text rounded focus:outline-none focus:shadow-focus"
										placeholder="recipient@example.com"
										required
									/>
									<datalist id="past-recipients">
										{pastRecipients.map((recipient) => (
											<option key={recipient} value={recipient} />
										))}
									</datalist>
								</div>

								<div>
									<label className="block text-sm font-medium text-text mb-1">Subject</label>
									<input
										type="text"
										value={composeSubject}
										onChange={(e) => setComposeSubject(e.target.value)}
										className="w-full px-3 py-2 border border-border bg-bg text-text rounded focus:outline-none focus:shadow-focus"
										placeholder="Subject"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-text mb-1">Message</label>
									<textarea
										value={composeMessage}
										onChange={(e) => setComposeMessage(e.target.value)}
										className="w-full px-3 py-2 border border-border bg-bg text-text rounded focus:outline-none focus:shadow-focus font-mono"
										rows={12}
										placeholder="Write your message here..."
										required
									/>
								</div>
							</div>

							<div className="px-6 py-4 bg-bg-alt border-t border-border flex gap-3">
								<button
									type="submit"
									disabled={sending}
									className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{sending ? 'Sending...' : 'Send'}
								</button>
								<button
									type="button"
									onClick={() => setView('inbox')}
									className="px-6 py-2 border border-border rounded hover:bg-bg-card"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}

			{/* Whitelist Modal */}
			{showWhitelist && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
						{/* Modal Header */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-border">
							<h2 className="text-xl font-semibold text-text">Email Whitelist</h2>
							<button
								onClick={() => setShowWhitelist(false)}
								className="text-text-secondary hover:text-text"
							>
								✕
							</button>
						</div>

						{/* Modal Body */}
						<div className="flex-1 overflow-auto p-6">
							{loadingWhitelist ? (
								<div className="text-center text-text-secondary py-8">Loading whitelist...</div>
							) : whitelist.length === 0 ? (
								<div className="text-center text-text-secondary py-8">
									No whitelisted emails yet
								</div>
							) : (
								<div className="space-y-3">
									{whitelist.map((entry) => (
										<div
											key={entry.email}
											className="flex items-center justify-between p-4 bg-bg border border-border rounded hover:bg-bg-alt transition-colors"
										>
											<div className="flex-1">
												<div className="font-medium text-text">{entry.email}</div>
												<div className="text-sm text-text-secondary mt-1">
													Added: {new Date(entry.whitelisted_at).toLocaleString()}
													{entry.notes && <span className="ml-2">• {entry.notes}</span>}
												</div>
											</div>
											<button
												onClick={() => deleteFromWhitelist(entry.email)}
												className="ml-4 px-3 py-1 text-sm bg-danger text-white rounded hover:bg-danger-dark transition-colors"
											>
												Remove
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Modal Footer */}
						<div className="px-6 py-4 border-t border-border">
							<button
								onClick={() => setShowWhitelist(false)}
								className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Appointments Tab Content (Placeholder) */}
			{activeTab === 'appointments' && (
				<div className="flex-1 flex items-center justify-center text-text-secondary">
					<div className="text-center">
						<div className="text-4xl mb-4">📅</div>
						<div className="text-xl">Appointments</div>
						<div className="text-sm mt-2">Coming soon...</div>
					</div>
				</div>
			)}
		</div>
	);
}
