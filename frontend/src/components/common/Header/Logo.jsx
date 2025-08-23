import { useApp } from "../../../context/AppContext";

export default function Logo() {
    const { setCurrentView } = useApp();

    return (
        <div className="header-brand">
            <button className="logo" onClick={() => setCurrentView("home")}>
                <span>ShopHub</span>
            </button>
        </div>
    );
}
