/**
 * Email detail view
 */

import type { Email } from '../../../lib/api/types';

interface MailDetailProps {
	email: Email;
	onReply: () => void;
	onDelete: () => void;
	onRestore: () => void;
}

export function MailDetail({ email, onReply, onDelete, onRestore }: MailDetailProps) {
	return (
		<div className="flex-1 bg-bg overflow-y-auto">
			<div className="p-6">
				<div className="mb-6 pb-6 border-b border-border">
					<h2 className="text-2xl font-semibold text-text mb-2">Message from {email.name}</h2>
					<div className="flex gap-4 text-sm text-text-secondary mb-4">
						<span>
							<strong>From:</strong> {email.email}
						</span>
						<span>
							<strong>Date:</strong> {new Date(email.created_at).toLocaleString()}
						</span>
						{email.status === 'deleted' && email.deleted_at && (
							<span>
								<strong>Deleted:</strong> {new Date(email.deleted_at).toLocaleString()}
							</span>
						)}
					</div>
					<div className="flex gap-2">
						{email.status === 'deleted' ? (
							<>
								<button
									onClick={onRestore}
									className="px-4 py-1 text-sm bg-success text-success-text rounded hover:opacity-90 transition-opacity"
								>
									↩ Restore
								</button>
								<div className="text-sm text-text-secondary py-1 px-2">This email is in trash</div>
							</>
						) : (
							<>
								<button
									onClick={onReply}
									className="px-4 py-1 text-sm bg-primary text-bg-card rounded hover:bg-primary-dark transition-colors"
								>
									Reply
								</button>
								<button
									onClick={onDelete}
									className="px-4 py-1 text-sm bg-danger text-danger-text rounded hover:bg-danger-dark transition-colors"
								>
									Delete
								</button>
							</>
						)}
					</div>
				</div>
				<div className="prose max-w-none">
					<div className="whitespace-pre-wrap text-text">{email.message}</div>
				</div>
				<div className="mt-6 pt-6 border-t border-border text-sm text-text-secondary">
					<div>IP Address: {email.ip_address}</div>
					{email.referrer && <div>Referrer: {email.referrer}</div>}
				</div>
			</div>
		</div>
	);
}
