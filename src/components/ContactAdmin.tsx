import { useState, useEffect } from 'react';

interface Email {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived';
	created_at: number;
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

export default function ContactAdmin() {
	const [emails, setEmails] = useState<Email[]>([]);
	const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [view, setView] = useState<'inbox' | 'compose'>('inbox');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [adminKey, setAdminKey] = useState<string | null>(null);
	const [keyValidated, setKeyValidated] = useState(false);

	// Compose form state
	const [composeFrom, setComposeFrom] = useState(VALID_RECIPIENTS[0]);
	const [composeTo, setComposeTo] = useState('');
	const [composeSubject, setComposeSubject] = useState('');
	const [composeMessage, setComposeMessage] = useState('');
	const [pastRecipients, setPastRecipients] = useState<string[]>([]);
	const [sending, setSending] = useState(false);

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
			} catch (err) {
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

	async function updateStatus(id: string, status: 'unread' | 'read' | 'archived') {
		if (!adminKey) return;
		try {
			const response = await fetch(`/contact/api/admin/submissions/${id}/status`, {
				method: 'PATCH',
				headers: {
					'X-User-Key': adminKey,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error('Failed to update status');
			}

			setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, status } : email)));
		} catch (err) {
			alert('Failed to update status: ' + (err as Error).message);
		}
	}

	async function sendEmail(e: React.FormEvent) {
		e.preventDefault();
		setSending(true);

		try {
			// TODO: Implement actual email sending API
			await new Promise((resolve) => setTimeout(resolve, 1000));

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
			alert('Failed to send email: ' + (err as Error).message);
		} finally {
			setSending(false);
		}
	}

	const filteredEmails =
		selectedRecipient === 'all'
			? emails
			: emails.filter((email) => email.recipient === selectedRecipient);

	const unreadCount = filteredEmails.filter((e) => e.status === 'unread').length;

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
			{/* Top Bar */}
			<div className="flex items-center justify-between px-6 py-3 border-b border-border bg-primary text-white">
				<h1 className="text-xl font-semibold">Hadoku Mail</h1>
				<div className="flex gap-2">
					<button
						onClick={() => setView('inbox')}
						className={`px-4 py-2 rounded ${
							view === 'inbox' ? 'bg-primary-dark' : 'bg-primary-light hover:bg-primary-hover'
						}`}
					>
						Inbox
					</button>
					<button
						onClick={() => setView('compose')}
						className={`px-4 py-2 rounded ${
							view === 'compose' ? 'bg-primary-dark' : 'bg-primary-light hover:bg-primary-hover'
						}`}
					>
						Compose
					</button>
				</div>
			</div>

			{view === 'inbox' ? (
				<div className="flex flex-1 overflow-hidden">
					{/* Sidebar */}
					<div className="w-64 border-r border-border bg-bg-alt">
						<div className="p-4">
							<h2 className="text-sm font-semibold text-text-secondary mb-3">FOLDERS</h2>
							<div className="space-y-1">
								<button
									onClick={() => {
										setSelectedRecipient('all');
										setSelectedEmail(null);
									}}
									className={`w-full text-left px-3 py-2 rounded text-sm ${
										selectedRecipient === 'all'
											? 'bg-primary-bg text-primary font-medium'
											: 'text-text hover:bg-bg-card'
									}`}
								>
									<span className="flex justify-between">
										<span>All Mail</span>
										<span className="text-text-secondary">{emails.length}</span>
									</span>
								</button>
								{VALID_RECIPIENTS.map((recipient) => {
									const count = emails.filter((e) => e.recipient === recipient).length;
									if (count === 0) return null;
									return (
										<button
											key={recipient}
											onClick={() => {
												setSelectedRecipient(recipient);
												setSelectedEmail(null);
											}}
											className={`w-full text-left px-3 py-2 rounded text-sm ${
												selectedRecipient === recipient
													? 'bg-primary-bg text-primary font-medium'
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
						</div>
					</div>

					{/* Email List */}
					<div className="w-96 border-r border-border bg-bg overflow-y-auto">
						<div className="sticky top-0 bg-bg border-b border-border px-4 py-3">
							<h2 className="font-semibold text-text">
								{selectedRecipient === 'all' ? 'All Mail' : selectedRecipient}
							</h2>
							<p className="text-sm text-text-secondary">
								{unreadCount} unread of {filteredEmails.length}
							</p>
						</div>
						<div>
							{filteredEmails.map((email) => (
								<button
									key={email.id}
									onClick={() => {
										setSelectedEmail(email);
										if (email.status === 'unread') {
											updateStatus(email.id, 'read');
										}
									}}
									className={`w-full text-left px-4 py-3 border-b border-border-light hover:bg-bg-card ${
										selectedEmail?.id === email.id ? 'bg-primary-bg' : ''
									} ${email.status === 'unread' ? 'bg-primary-bg/30' : ''}`}
								>
									<div className="flex justify-between items-start mb-1">
										<span
											className={`font-medium text-sm ${
												email.status === 'unread' ? 'text-text' : 'text-text-secondary'
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
							))}
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
									</div>
									<div className="flex gap-2">
										<select
											value={selectedEmail.status}
											onChange={(e) =>
												updateStatus(
													selectedEmail.id,
													e.target.value as 'unread' | 'read' | 'archived'
												)
											}
											className="px-3 py-1 text-sm border border-border rounded focus:outline-none focus:shadow-focus"
										>
											<option value="unread">Unread</option>
											<option value="read">Read</option>
											<option value="archived">Archived</option>
										</select>
										<button
											onClick={() => {
												setComposeTo(selectedEmail.email);
												setComposeSubject(`Re: Message from ${selectedEmail.name}`);
												setView('compose');
											}}
											className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-hover"
										>
											Reply
										</button>
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
			) : (
				/* Compose View */
				<div className="flex-1 overflow-y-auto bg-bg-alt">
					<div className="max-w-4xl mx-auto p-8">
						<h2 className="text-2xl font-semibold text-text mb-6">New Message</h2>
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
			)}
		</div>
	);
}
