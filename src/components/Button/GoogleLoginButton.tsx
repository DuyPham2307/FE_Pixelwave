import { getGoogleLoginUrl } from "@/services/authService";
import gg from "@/assets/images/gg.png";

const GoogleLoginButton = () => {
	const handleGoogleLogin = async () => {
		const googleLoginUrl: string = await getGoogleLoginUrl(); // <-- có dấu ngoặc
		if (googleLoginUrl) {
		  window.location.href = googleLoginUrl;
		}
	};

	return (
		<button className="social-btn google" onClick={handleGoogleLogin}>
			<img src={gg} alt="Google" />
			Google
		</button>
	);
};

export default GoogleLoginButton;
