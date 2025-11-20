import { useState, useEffect } from 'react';

interface Submission {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived';
	created_at: number;
	ip_address: string;
	referrer: string | null;
}

interface ContactAdminProps {
	adminKey: string;
}

export default function ContactAdmin({ adminKey }: ContactAdminProps) {
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, archived: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	// Create session on mount
	useEffect(() => {
		async function createSession() {
			try {
				const response = await fetch('/session/create', {
					method: 'POST',
					headers: {
						'X-User-Key': adminKey,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to create session');
				}

				const data = await response.json();
				setSessionId(data.sessionId);
			} catch (err) {
				setError('Authentication failed');
				setLoading(false);
			}
		}

		createSession();
	}, [adminKey]);

	// Fetch submissions once session is created
	useEffect(() => {
		if (!sessionId) return;

		async function fetchSubmissions() {
			try {
				const response = await fetch('/contact/api/admin/submissions?limit=50&offset=0', {
					headers: {
						'X-Session-Id': sessionId,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch submissions');
				}

				const result = await response.json();
				setSubmissions(result.data.submissions);
				setStats(result.data.stats);
				setLoading(false);
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		}

		fetchSubmissions();
	}, [sessionId]);

	async function updateStatus(id: string, status: 'unread' | 'read' | 'archived') {
		if (!sessionId) return;

		try {
			const response = await fetch(`/contact/api/admin/submissions/${id}/status`, {
				method: 'PATCH',
				headers: {
					'X-Session-Id': sessionId,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error('Failed to update status');
			}

			// Update local state
			setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)));

			// Update stats
			setStats((prev) => {
				const old = submissions.find((s) => s.id === id);
				if (!old) return prev;

				return {
					...prev,
					[old.status]: prev[old.status] - 1,
					[status]: prev[status] + 1,
				};
			});
		} catch (err) {
			alert('Failed to update status: ' + (err as Error).message);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-lg text-gray-600">Loading submissions...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-lg text-red-600">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
					<div className="flex gap-4 text-sm text-gray-600">
						<span>Total: {stats.total}</span>
						<span>Unread: {stats.unread}</span>
						<span>Read: {stats.read}</span>
						<span>Archived: {stats.archived}</span>
					</div>
				</div>

				<div className="space-y-4">
					{submissions.map((submission) => (
						<div
							key={submission.id}
							className={`bg-white rounded-lg shadow p-6 ${
								submission.status === 'unread' ? 'border-l-4 border-blue-500' : ''
							}`}
						>
							<div className="flex justify-between items-start mb-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
									<a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
										{submission.email}
									</a>
									<div className="text-sm text-gray-500 mt-1">
										{new Date(submission.created_at).toLocaleString()} • {submission.ip_address}
									</div>
								</div>
								<div className="flex gap-2">
									<select
										value={submission.status}
										onChange={(e) =>
											updateStatus(submission.id, e.target.value as 'unread' | 'read' | 'archived')
										}
										className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="unread">Unread</option>
										<option value="read">Read</option>
										<option value="archived">Archived</option>
									</select>
								</div>
							</div>
							<div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">
								{submission.message}
							</div>
							{submission.referrer && (
								<div className="mt-2 text-xs text-gray-500">Referrer: {submission.referrer}</div>
							)}
						</div>
					))}

					{submissions.length === 0 && (
						<div className="text-center py-12 text-gray-500">No submissions yet</div>
					)}
				</div>
			</div>
		</div>
	);
}
