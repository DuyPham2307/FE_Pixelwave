import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
	return (
		<div style={{ textAlign: "center", marginTop: "50px", display: 'flex',flexDirection: 'column' ,alignItems: 'center', width: '100%' }}>
			<h1 style={{fontSize: '2rem', color: 'red'}}>404</h1>
			<p>Oops! The page you are looking for does not exist.</p>
			<img
      style={{alignSelf: "center"}}
				src="https://cdni.iconscout.com/illustration/premium/thumb/network-warning-404-error-6128597-5059516.png"
				alt=""
			/>
			<Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
				Go back to Home
			</Link>
		</div>
	);
};

export default NotFoundPage;
