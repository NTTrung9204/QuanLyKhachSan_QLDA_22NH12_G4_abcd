import HotelToolbar from "../components/HotelToolbar";

const CustomerLayout = ({ children }) => {
    return (
        <div>
            <HotelToolbar />
            {children}
        </div>
    );
};

export default CustomerLayout;