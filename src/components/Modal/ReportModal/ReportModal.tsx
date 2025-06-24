// components/ReportModal.tsx
import { useState } from "react";
import { createReport } from "@/services/reportService";
import toast from "react-hot-toast";

const reportReasons = [
	"Nudity or Sexual Content",
	"Violence or Threats",
	"Harassment or Bullying",
	"Hate Speech or Symbols",
	"False Information",
	"Spam or Scam",
	"Promotes Drugs or Regulated Goods",
	"Suicide or Self-Injury Concerns",
	"Other",
];

interface ReportModalProps {
	postId: number;
	open: boolean;
	onClose: () => void;
}

export const ReportModal = ({ postId, open, onClose }: ReportModalProps) => {
	const [reason, setReason] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!reason || !description.trim()) return;

		setLoading(true);
		try {
			await createReport({ postId, reason, description });
			onClose();
			toast.success("Report submitted successfully.");
		} catch (err) {
			if (err.code === "ERR_BAD_RESPONSE") {
				toast.error("This post already reported!!!");
			}
			console.error("Report failed", err);
		} finally {
			setLoading(false);
			setReason("");
			setDescription("");
		}
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
			onClick={onClose}
		>
			<div
				className="bg-white p-6 rounded shadow-md w-full max-w-md"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-semibold mb-4">Report Post</h2>

				<div className="mb-4">
					<label className="block mb-1">Reason</label>
					<select
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					>
						<option value="">-- Select a reason --</option>
						{reportReasons.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label className="block mb-1">Description</label>
					<textarea
						rows={4}
						placeholder="Describe the issue"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					/>
				</div>

				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						disabled={!reason || !description.trim() || loading}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
					>
						{loading ? "Submitting..." : "Submit Report"}
					</button>
				</div>
			</div>
		</div>
	);
};
