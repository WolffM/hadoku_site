/**
 * Whitelist management modal
 */

import { useState, type FormEvent } from 'react';
import type { WhitelistEntry } from '../../../lib/api/types';

interface WhitelistModalProps {
	whitelist: WhitelistEntry[];
	loading: boolean;
	onClose: () => void;
	onRemove: (email: string) => void;
	onAdd: (email: string, notes?: string) => Promise<boolean>;
}

export function WhitelistModal({
	whitelist,
	loading,
	onClose,
	onRemove,
	onAdd,
}: WhitelistModalProps) {
	const [newEmail, setNewEmail] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [adding, setAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAddEmail = (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const email = newEmail.trim().toLowerCase();
		if (!email) {
			setError('Email is required');
			return;
		}

		// Basic email validation
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError('Invalid email format');
			return;
		}

		setAdding(true);
		onAdd(email, newNotes.trim() || undefined)
			.then((success) => {
				if (success) {
					setNewEmail('');
					setNewNotes('');
				} else {
					setError('Failed to add email to whitelist');
				}
			})
			.catch(() => {
				setError('Failed to add email to whitelist');
			})
			.finally(() => {
				setAdding(false);
			});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
				{/* Modal Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<h2 className="text-xl font-semibold text-text">Email Whitelist</h2>
					<button onClick={onClose} className="text-text-secondary hover:text-text">
						✕
					</button>
				</div>

				{/* Add Email Form */}
				<form onSubmit={handleAddEmail} className="px-6 py-4 border-b border-border bg-bg-alt">
					<div className="flex flex-col gap-3">
						<div className="flex gap-3">
							<input
								type="email"
								placeholder="Email address"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text placeholder-text-secondary focus:outline-none focus:border-primary"
								disabled={adding}
							/>
							<button
								type="submit"
								disabled={adding || !newEmail.trim()}
								className="px-4 py-2 bg-success text-success-text rounded hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{adding ? 'Adding...' : 'Add'}
							</button>
						</div>
						<input
							type="text"
							placeholder="Notes (optional)"
							value={newNotes}
							onChange={(e) => setNewNotes(e.target.value)}
							className="px-3 py-2 bg-bg border border-border rounded text-text placeholder-text-secondary focus:outline-none focus:border-primary"
							disabled={adding}
						/>
						{error && <div className="text-danger text-sm">{error}</div>}
					</div>
				</form>

				{/* Modal Body */}
				<div className="flex-1 overflow-auto p-6">
					{loading ? (
						<div className="text-center text-text-secondary py-8">Loading whitelist...</div>
					) : whitelist.length === 0 ? (
						<div className="text-center text-text-secondary py-8">No whitelisted emails yet</div>
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
										onClick={() => onRemove(entry.email)}
										className="ml-4 px-3 py-1 text-sm bg-danger text-danger-text rounded hover:bg-danger-dark transition-colors"
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
						onClick={onClose}
						className="px-6 py-2 bg-primary text-primary-dark rounded hover:bg-primary-dark hover:text-white transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
