/**
 * Email sidebar with folders and navigation
 */

import type { Email } from '../../../lib/api/types';
import { VALID_RECIPIENTS } from '../../../config/contact-admin';

interface MailSidebarProps {
	emails: Email[];
	selectedRecipient: string;
	showTrash: boolean;
	onSelectRecipient: (recipient: string) => void;
	onShowTrash: () => void;
	onCompose: () => void;
	onRefresh: () => void;
	onOpenWhitelist: () => void;
	refreshing: boolean;
}

export function MailSidebar({
	emails,
	selectedRecipient,
	showTrash,
	onSelectRecipient,
	onShowTrash,
	onCompose,
	onRefresh,
	onOpenWhitelist,
	refreshing,
}: MailSidebarProps) {
	const deletedCount = emails.filter((e) => e.status === 'deleted').length;

	return (
		<div className="w-64 border-r border-border bg-bg-alt">
			<div className="p-4">
				{/* Action Buttons */}
				<div className="space-y-2 mb-6">
					<button
						onClick={onCompose}
						className="w-full px-4 py-2 rounded bg-primary text-bg-card hover:bg-primary-dark transition-colors"
					>
						✉ Compose
					</button>
					<button
						onClick={onRefresh}
						disabled={refreshing}
						className="w-full px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card disabled:opacity-50 transition-colors"
						title="Refresh emails"
					>
						{refreshing ? '↻ Refreshing...' : '↻ Refresh'}
					</button>
					<button
						onClick={onOpenWhitelist}
						className="w-full px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card transition-colors"
						title="Manage email whitelist"
					>
						Whitelist
					</button>
				</div>

				<h2 className="text-sm font-semibold text-text-secondary mb-3">FOLDERS</h2>
				<div className="space-y-1">
					<button
						onClick={() => {
							onSelectRecipient('all');
						}}
						className={`w-full text-left px-3 py-2 rounded text-sm ${
							selectedRecipient === 'all' && !showTrash
								? 'bg-primary text-bg-card font-medium'
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
								onClick={() => onSelectRecipient(recipient)}
								className={`w-full text-left px-3 py-2 rounded text-sm ${
									selectedRecipient === recipient && !showTrash
										? 'bg-primary text-bg-card font-medium'
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
						onClick={onShowTrash}
						className={`w-full text-left px-3 py-2 rounded text-sm ${
							showTrash ? 'bg-primary text-bg-card font-medium' : 'text-text hover:bg-bg-card'
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
	);
}
