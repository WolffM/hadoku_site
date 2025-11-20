/**
 * Email compose view
 */

import { VALID_RECIPIENTS } from '../../../config/contact-admin';

interface MailComposeProps {
	from: string;
	to: string;
	subject: string;
	message: string;
	pastRecipients: string[];
	sending: boolean;
	onFromChange: (from: string) => void;
	onToChange: (to: string) => void;
	onSubjectChange: (subject: string) => void;
	onMessageChange: (message: string) => void;
	onSend: () => Promise<void>;
	onCancel: () => void;
}

export function MailCompose({
	from,
	to,
	subject,
	message,
	pastRecipients,
	sending,
	onFromChange,
	onToChange,
	onSubjectChange,
	onMessageChange,
	onSend,
	onCancel,
}: MailComposeProps) {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSend();
	};

	return (
		<div className="flex-1 overflow-y-auto bg-bg-alt">
			<div className="max-w-4xl mx-auto p-8">
				<div className="flex items-center gap-4 mb-6">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded border border-border bg-bg text-text hover:bg-bg-card transition-colors"
					>
						← Back to Inbox
					</button>
					<h2 className="text-2xl font-semibold text-text">New Message</h2>
				</div>
				<form
					onSubmit={handleSubmit}
					className="bg-bg-card rounded-lg shadow-sm border border-border"
				>
					<div className="p-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-text mb-1">From</label>
							<select
								value={from}
								onChange={(e) => onFromChange(e.target.value)}
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
								value={to}
								onChange={(e) => onToChange(e.target.value)}
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
								value={subject}
								onChange={(e) => onSubjectChange(e.target.value)}
								className="w-full px-3 py-2 border border-border bg-bg text-text rounded focus:outline-none focus:shadow-focus"
								placeholder="Subject"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-text mb-1">Message</label>
							<textarea
								value={message}
								onChange={(e) => onMessageChange(e.target.value)}
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
							className="px-6 py-2 bg-primary text-primary-dark rounded hover:bg-primary-dark hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{sending ? 'Sending...' : 'Send'}
						</button>
						<button
							type="button"
							onClick={onCancel}
							className="px-6 py-2 border border-border rounded hover:bg-bg-card"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
