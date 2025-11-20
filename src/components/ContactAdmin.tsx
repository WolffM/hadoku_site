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

interface ContactAdminProps {
	adminKey: string;
}

const VALID_RECIPIENTS = [
	'matthaeus@hadoku.me',
	'mw@hadoku.me',
	'business@hadoku.me',
	'support@hadoku.me',
	'no-reply@hadoku.me',
	'hello@hadoku.me',
];

export default function ContactAdmin({ adminKey }: ContactAdminProps) {
	const [emails, setEmails] = useState<Email[]>([]);
	const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [view, setView] = useState<'inbox' | 'compose'>('inbox');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Compose form state
	const [composeFrom, setComposeFrom] = useState(VALID_RECIPIENTS[0]);
	const [composeTo, setComposeTo] = useState('');
	const [composeSubject, setComposeSubject] = useState('');
	const [composeMessage, setComposeMessage] = useState('');
	const [pastRecipients, setPastRecipients] = useState<string[]>([]);
	const [sending, setSending] = useState(false);

	// Fetch emails on mount
	useEffect(() => {
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
	}, [adminKey]);

	async function updateStatus(id: string, status: 'unread' | 'read' | 'archived') {
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
			<div className="h-screen bg-white flex items-center justify-center">
				<div className="text-gray-600">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen bg-white flex items-center justify-center">
				<div className="text-red-600">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-white">
			{/* Top Bar */}
			<div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-blue-600 text-white">
				<h1 className="text-xl font-semibold">Hadoku Mail</h1>
				<div className="flex gap-2">
					<button
						onClick={() => setView('inbox')}
						className={`px-4 py-2 rounded ${
							view === 'inbox' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
						}`}
					>
						Inbox
					</button>
					<button
						onClick={() => setView('compose')}
						className={`px-4 py-2 rounded ${
							view === 'compose' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
						}`}
					>
						Compose
					</button>
				</div>
			</div>

			{view === 'inbox' ? (
				<div className="flex flex-1 overflow-hidden">
					{/* Sidebar */}
					<div className="w-64 border-r border-gray-200 bg-gray-50">
						<div className="p-4">
							<h2 className="text-sm font-semibold text-gray-700 mb-3">FOLDERS</h2>
							<div className="space-y-1">
								<button
									onClick={() => {
										setSelectedRecipient('all');
										setSelectedEmail(null);
									}}
									className={`w-full text-left px-3 py-2 rounded text-sm ${
										selectedRecipient === 'all'
											? 'bg-blue-100 text-blue-700 font-medium'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									<span className="flex justify-between">
										<span>All Mail</span>
										<span className="text-gray-500">{emails.length}</span>
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
													? 'bg-blue-100 text-blue-700 font-medium'
													: 'text-gray-700 hover:bg-gray-100'
											}`}
										>
											<span className="flex justify-between">
												<span className="truncate">{recipient}</span>
												<span className="text-gray-500">{count}</span>
											</span>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Email List */}
					<div className="w-96 border-r border-gray-200 bg-white overflow-y-auto">
						<div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
							<h2 className="font-semibold text-gray-900">
								{selectedRecipient === 'all' ? 'All Mail' : selectedRecipient}
							</h2>
							<p className="text-sm text-gray-500">
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
									className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
										selectedEmail?.id === email.id ? 'bg-blue-50' : ''
									} ${email.status === 'unread' ? 'bg-blue-50/30' : ''}`}
								>
									<div className="flex justify-between items-start mb-1">
										<span
											className={`font-medium text-sm ${
												email.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
											}`}
										>
											{email.name}
										</span>
										<span className="text-xs text-gray-500">
											{new Date(email.created_at).toLocaleDateString()}
										</span>
									</div>
									<div className="text-xs text-gray-500 mb-1">{email.email}</div>
									<div className="text-sm text-gray-600 truncate">{email.message}</div>
								</button>
							))}
							{filteredEmails.length === 0 && (
								<div className="text-center py-12 text-gray-500">No emails</div>
							)}
						</div>
					</div>

					{/* Email Detail */}
					<div className="flex-1 bg-white overflow-y-auto">
						{selectedEmail ? (
							<div className="p-6">
								<div className="mb-6 pb-6 border-b border-gray-200">
									<h2 className="text-2xl font-semibold text-gray-900 mb-2">
										Message from {selectedEmail.name}
									</h2>
									<div className="flex gap-4 text-sm text-gray-600 mb-4">
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
											className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
											className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
										>
											Reply
										</button>
									</div>
								</div>
								<div className="prose max-w-none">
									<div className="whitespace-pre-wrap text-gray-800">{selectedEmail.message}</div>
								</div>
								<div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
									<div>IP Address: {selectedEmail.ip_address}</div>
									{selectedEmail.referrer && <div>Referrer: {selectedEmail.referrer}</div>}
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center h-full text-gray-500">
								Select an email to read
							</div>
						)}
					</div>
				</div>
			) : (
				/* Compose View */
				<div className="flex-1 overflow-y-auto bg-gray-50">
					<div className="max-w-4xl mx-auto p-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-6">New Message</h2>
						<form
							onSubmit={sendEmail}
							className="bg-white rounded-lg shadow-sm border border-gray-200"
						>
							<div className="p-6 space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">From</label>
									<select
										value={composeFrom}
										onChange={(e) => setComposeFrom(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
									<label className="block text-sm font-medium text-gray-700 mb-1">To</label>
									<input
										type="email"
										value={composeTo}
										onChange={(e) => setComposeTo(e.target.value)}
										list="past-recipients"
										className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
									<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
									<input
										type="text"
										value={composeSubject}
										onChange={(e) => setComposeSubject(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Subject"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
									<textarea
										value={composeMessage}
										onChange={(e) => setComposeMessage(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
										rows={12}
										placeholder="Write your message here..."
										required
									/>
								</div>
							</div>

							<div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
								<button
									type="submit"
									disabled={sending}
									className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									{sending ? 'Sending...' : 'Send'}
								</button>
								<button
									type="button"
									onClick={() => setView('inbox')}
									className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
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
