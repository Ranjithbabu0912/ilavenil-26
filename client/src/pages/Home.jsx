import Hero from '../components/Hero'
import CheckStatusModal from '../components/CheckStatusModal';
import Desc from '../components/Desc';
import Guidelines from '../components/Guidelines';
import EventTile from '../components/EventTile';
import Footer from '../components/Footer';
import PaymentGuide from '../components/PaymentGuide';

const Home = ({ openStatus, setOpenStatus }) => {


    return (
        <div>
            <Hero />
            {openStatus && (
                <CheckStatusModal onClose={() => setOpenStatus(false)} />
            )}
            <Desc />
            <Guidelines />
            <EventTile />
            <PaymentGuide />
            <Footer />
        </div>
    )
}

export default Home