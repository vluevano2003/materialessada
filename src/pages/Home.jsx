import DestacadosSection from "../components/DestacadosSection";
import WhatsAppWidget from "../components/WhatsAppWidget";
import { Link } from "react-router-dom";

import "../styles/home.css";

function Home() {
  return (
    <>
      <section className="main-section">
        <div className="main-overlay">
          <div className="promo-content">
            <h1>
              Materiales <span>SADA</span>
            </h1>
            <p>
              Tu aliado estratégico en la construcción. Materiales de primera calidad,
              entregas puntuales y el mejor servicio en Coatzacoalcos, Ver.
            </p>
            <Link to="/productos" className="promo-button">
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </section>
      <DestacadosSection />
      <WhatsAppWidget />
    </>
  );
}

export default Home;
