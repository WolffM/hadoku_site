/**
 * Whitelist management modal
 */

import type { WhitelistEntry } from '../../../lib/api/types';

interface WhitelistModalProps {
	whitelist: WhitelistEntry[];
	loading: boolean;
	onClose: () => void;
	onRemove: (email: string) => void;
}

export function WhitelistModal({ whitelist, loading, onClose, onRemove }: WhitelistModalProps) {
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
