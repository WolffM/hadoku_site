/**
 * Email list view
 */

import type { Email } from '../../../lib/api/types';

interface MailListProps {
	emails: Email[];
	selectedEmail: Email | null;
	selectedRecipient: string;
	showTrash: boolean;
	readEmails: Set<string>;
	unreadCount: number;
	onSelectEmail: (email: Email) => void;
}

export function MailList({
	emails,
	selectedEmail,
	selectedRecipient,
	showTrash,
	readEmails,
	unreadCount,
	onSelectEmail,
}: MailListProps) {
	return (
		<div className="w-96 border-r border-border bg-bg overflow-y-auto">
			<div className="sticky top-0 bg-bg border-b border-border px-4 py-3">
				<h2 className="font-semibold text-text">
					{showTrash ? '🗑️ Trash' : selectedRecipient === 'all' ? 'All Mail' : selectedRecipient}
				</h2>
				<p className="text-sm text-text-secondary">
					{showTrash ? `${emails.length} deleted` : `${unreadCount} unread of ${emails.length}`}
				</p>
			</div>
			<div>
				{emails.map((email) => {
					const isUnread = !readEmails.has(email.id);
					return (
						<button
							key={email.id}
							onClick={() => onSelectEmail(email)}
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
							<div className="text-xs text-text-muted mb-1">{email.email}</div>
							<div className="text-sm text-text-secondary truncate">{email.message}</div>
						</button>
					);
				})}
				{emails.length === 0 && (
					<div className="text-center py-12 text-text-secondary">No emails</div>
				)}
			</div>
		</div>
	);
}
