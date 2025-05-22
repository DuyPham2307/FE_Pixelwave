// components/Spinner.tsx
import React from "react";
import "@/styles/components/_spinner.scss";

const Spinner: React.FC = () => {
	return (
		<div className="spinner-wrapper">
			<div className="spinner" />
		</div>
	);
};

export default Spinner;
